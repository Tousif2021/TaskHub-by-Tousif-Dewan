
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FileIcon, FolderIcon, ChevronLeft, Clock, Download, Trash2, Eye, Plus, Camera, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function Files() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<{url: string, name: string, type: string} | null>(null);
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
 
  const { data: files = [], isLoading, refetch } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load files");
        throw error;
      }
      
      return data || [];
    },
  });

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    try {
      toast.loading("Uploading file...");
      
      // Upload to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('files')
        .upload(fileName, file);
        
      if (storageError) throw storageError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(fileName);
      
      // Save to Supabase database
      const { error: dbError } = await supabase.from('files').insert({
        name: file.name,
        path: publicUrl,
        size: file.size,
        type: file.type,
      });
      
      if (dbError) throw dbError;
      
      toast.dismiss();
      toast.success(`Uploaded ${file.name}`);
      setIsAddFileDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Upload error:", error);
      toast.dismiss();
      toast.error("Failed to upload file");
    }
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      toast.error("Image size exceeds 10MB limit");
      return;
    }

    try {
      toast.loading("Uploading image...");
      
      // Upload to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('files')
        .upload(fileName, file);
        
      if (storageError) throw storageError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(fileName);
      
      // Save to Supabase database
      const { error: dbError } = await supabase.from('files').insert({
        name: file.name,
        path: publicUrl,
        size: file.size,
        type: file.type,
      });
      
      if (dbError) throw dbError;
      
      toast.dismiss();
      toast.success(`Captured image: ${file.name}`);
      setIsAddFileDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Upload error:", error);
      toast.dismiss();
      toast.error("Failed to upload image");
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePreview = (file: any) => {
    setPreviewFile({
      url: file.path,
      name: file.name,
      type: file.type
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    
    try {
      const { error } = await supabase
        .from("files")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast.success("File deleted successfully");
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    if (type.includes('presentation') || type.includes('powerpoint')) return '📑';
    if (type.includes('text')) return '📃';
    if (type.includes('zip') || type.includes('compressed')) return '🗜️';
    if (type.includes('audio')) return '🎵';
    if (type.includes('video')) return '🎬';
    return '📁';
  };

  const renderFilePreview = () => {
    if (!previewFile) return null;
    
    if (previewFile.type.includes('image')) {
      return <img src={previewFile.url} alt={previewFile.name} className="max-w-full max-h-[70vh] object-contain" />;
    }
    
    if (previewFile.type.includes('pdf')) {
      return <iframe src={previewFile.url} className="w-full h-[70vh]" title={previewFile.name}></iframe>;
    }
    
    if (previewFile.type.includes('text') || previewFile.type.includes('json')) {
      return (
        <div className="p-4 bg-muted rounded-md overflow-auto max-h-[70vh]">
          <p>Text preview is not available. Please download the file to view its contents.</p>
        </div>
      );
    }
    
    return (
      <div className="p-8 text-center">
        <FileIcon className="h-20 w-20 mx-auto mb-4 text-primary" />
        <p>Preview not available for this file type</p>
        <p className="text-sm text-muted-foreground mt-2">Please download the file to view its contents</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Files</h1>
        </div>
        <Button 
          onClick={() => setIsAddFileDialogOpen(true)}
          className="bg-primary text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add File
        </Button>
      </header>
      
      <div className="mb-6">
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
        </div>
      ) : paginatedFiles.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <FolderIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No files found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try a different search term" : "Upload your first file to get started"}
          </p>
          <Button 
            onClick={() => setIsAddFileDialogOpen(true)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add File
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedFiles.map((file) => (
              <div 
                key={file.id} 
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 flex items-start space-x-4">
                  <div className="bg-secondary/30 w-12 h-12 rounded-md flex items-center justify-center text-2xl flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{file.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary/10 px-4 py-2 flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handlePreview(file)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownload(file.path, file.name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
      
      {/* File Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="my-4">{renderFilePreview()}</div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              onClick={() => setPreviewFile(null)}
            >
              Close
            </Button>
            <Button 
              variant="default"
              onClick={() => previewFile && handleDownload(previewFile.url, previewFile.name)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add File Dialog */}
      <Dialog open={isAddFileDialogOpen} onOpenChange={setIsAddFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New File</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div 
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/20"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mb-2 text-primary" />
              <p className="font-medium">Upload File</p>
              <p className="text-xs text-muted-foreground">PDF, DOC, Images, etc.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.txt"
              />
            </div>
            
            <div 
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/20"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="h-8 w-8 mb-2 text-primary" />
              <p className="font-medium">Take Picture</p>
              <p className="text-xs text-muted-foreground">Use camera to capture</p>
              <input 
                type="file" 
                ref={cameraInputRef} 
                onChange={handleCameraCapture} 
                className="hidden" 
                accept="image/*" 
                capture="environment"
              />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Maximum file size: 10MB
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
