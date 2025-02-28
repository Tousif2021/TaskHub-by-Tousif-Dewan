
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileIcon, FolderIcon, ChevronLeft, Clock, Download, Trash2, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  created_at: string;
  path: string;
}

const Files = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<{url: string, name: string, type: string} | null>(null);
  
  const { data: files = [], isLoading, refetch } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FileItem[];
    }
  });
  
  const filteredFiles = searchQuery 
    ? files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : files;

  const downloadFile = async (file: FileItem) => {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .download(file.path);
        
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Downloaded ${file.name}`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const deleteFile = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from("files")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      refetch();
      toast.success(`Deleted ${name}`);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };
  
  // Group files by type to create folders
  const filesByType: Record<string, FileItem[]> = {};
  files.forEach(file => {
    const type = file.type.split('/')[0] || 'other';
    if (!filesByType[type]) {
      filesByType[type] = [];
    }
    filesByType[type].push(file);
  });
 
  return (
    <div className="min-h-screen p-6 pb-20">
      <header className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">Files</h1>
      </header>
      
      <div className="mb-6">
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Recent Files</h2>
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading files...</div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No files matching your search" : "No files uploaded yet"}
            </div>
          ) : (
            filteredFiles.map(file => (
              <FileItemComponent 
                key={file.id}
                file={file}
                onPreview={() => setPreviewFile({
                  url: `${supabase.storage.from('files').getPublicUrl(file.path).data.publicUrl}`,
                  name: file.name,
                  type: file.type
                })}
                onDelete={() => deleteFile(file.id, file.name)}
                onDownload={() => downloadFile(file)}
              />
            ))
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-3">Folders</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(filesByType).map(([type, files]) => (
            <FolderItem key={type} name={type.charAt(0).toUpperCase() + type.slice(1)} count={files.length} />
          ))}
          {Object.keys(filesByType).length === 0 && !isLoading && (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              No folders available
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-secondary/30 rounded-md flex items-center justify-center">
            {previewFile?.type.startsWith('image/') ? (
              <img 
                src={previewFile.url} 
                alt={previewFile.name} 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center p-8">
                <FileIcon className="mx-auto h-12 w-12 mb-3 text-muted-foreground" />
                <p>Preview not available</p>
                <Button variant="outline" className="mt-4" onClick={() => toast.success("File download started")}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const FileItemComponent = ({ 
  file,
  onPreview,
  onDelete,
  onDownload
}: { 
  file: FileItem;
  onPreview: () => void;
  onDelete: () => void;
  onDownload: () => void;
}) => {
  const getIconColor = () => {
    const fileType = file.type.split('/')[1];
    switch(fileType) {
      case 'pdf': return 'text-red-500';
      case 'jpeg':
      case 'jpg':
      case 'png': 
      case 'gif': return 'text-blue-500';
      case 'xlsx':
      case 'csv': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800">
      <div className={`mr-3 ${getIconColor()}`}>
        <FileIcon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{file.name}</h3>
        <div className="flex text-xs text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <span className="mx-1">•</span>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onPreview}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const FolderItem = ({ name, count }: { name: string; count: number }) => (
  <div className="p-4 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 cursor-pointer">
    <div className="flex items-center">
      <FolderIcon className="h-8 w-8 text-amber-500 mr-3" />
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-xs text-muted-foreground">{count} items</p>
      </div>
    </div>
  </div>
);

export default Files;
