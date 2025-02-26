
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileIcon, FolderIcon, ChevronLeft, Clock, Download, Trash2, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const Files = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<{url: string, name: string, type: string} | null>(null);
 
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
          <FileItem 
            name="Quarterly Report.pdf"
            type="pdf"
            size="2.4 MB"
            updatedAt={new Date(2023, 5, 15)}
            onPreview={() => setPreviewFile({
              url: 'https://example.com/preview.pdf',
              name: 'Quarterly Report.pdf',
              type: 'pdf'
            })}
          />
          <FileItem 
            name="Team Photo.jpg"
            type="jpg"
            size="3.1 MB"
            updatedAt={new Date(2023, 6, 20)}
            onPreview={() => setPreviewFile({
              url: 'https://example.com/preview.jpg',
              name: 'Team Photo.jpg',
              type: 'jpg'
            })}
          />
          <FileItem 
            name="Project Timeline.xlsx"
            type="xlsx"
            size="1.8 MB"
            updatedAt={new Date(2023, 7, 5)}
            onPreview={() => setPreviewFile({
              url: 'https://example.com/preview.xlsx',
              name: 'Project Timeline.xlsx',
              type: 'xlsx'
            })}
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-3">Folders</h2>
        <div className="grid grid-cols-2 gap-3">
          <FolderItem name="Documents" count={12} />
          <FolderItem name="Images" count={34} />
          <FolderItem name="Projects" count={7} />
          <FolderItem name="Shared with me" count={19} />
        </div>
      </div>
      
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-secondary/30 rounded-md flex items-center justify-center">
            {/* This would be replaced with an actual preview component */}
            <div className="text-center p-8">
              <FileIcon className="mx-auto h-12 w-12 mb-3 text-muted-foreground" />
              <p>Preview not available</p>
              <Button variant="outline" className="mt-4" onClick={() => toast.success("File download started")}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Navigation />
    </div>
  );
};

const FileItem = ({ 
  name, 
  type, 
  size, 
  updatedAt, 
  onPreview
}: { 
  name: string; 
  type: string;
  size: string;
  updatedAt: Date;
  onPreview: () => void;
}) => {
  const getIconColor = () => {
    switch(type) {
      case 'pdf': return 'text-red-500';
      case 'jpg':
      case 'png': return 'text-blue-500';
      case 'xlsx': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800">
      <div className={`mr-3 ${getIconColor()}`}>
        <FileIcon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{name}</h3>
        <div className="flex text-xs text-muted-foreground">
          <span>{size}</span>
          <span className="mx-1">•</span>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDistanceToNow(updatedAt, { addSuffix: true })}
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onPreview}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => toast.success(`Downloaded ${name}`)}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => toast.success(`Deleted ${name}`)}>
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
