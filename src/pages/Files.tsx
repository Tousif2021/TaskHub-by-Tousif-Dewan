import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex items-center border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Files</h1>
      </header>

      <div className="flex-1 p-4 pb-20">
        {/* Your files content here.  This section needs to be implemented based on your data fetching and display logic.  Example below: */}
        {/* {files.map(file => (
          <div key={file.id} className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm animate-fade-up">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileIcon className="h-6 w-6" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(file.createdAt))}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${file.path}`;
                        setPreviewFile({
                          url: fileUrl,
                          name: file.name,
                          type: file.type
                        });
                      }}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadFile(file)} //handleDownloadFile function needs to be implemented
                      className="h-8 w-8"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFile(file.id)} //handleDeleteFile function needs to be implemented
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
            </div>
          </div>
        ))} */}
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm animate-fade-up">
          No files yet
        </div>

      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 border-t bg-background"
      >
        <Navigation />
      </motion.div>

      {/* File Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 max-h-[60vh] overflow-auto">
            {previewFile && (
              <div>
                {previewFile.type.startsWith('image/') ? (
                  <img 
                    src={previewFile.url} 
                    alt={previewFile.name}
                    className="max-w-full h-auto rounded-md"
                  />
                ) : previewFile.type === 'application/pdf' ? (
                  <iframe 
                    src={previewFile.url} 
                    className="w-full h-[50vh]" 
                    title={previewFile.name}
                  />
                ) : previewFile.type.startsWith('video/') ? (
                  <video 
                    src={previewFile.url} 
                    controls 
                    className="max-w-full"
                  />
                ) : previewFile.type.startsWith('audio/') ? (
                  <audio 
                    src={previewFile.url} 
                    controls 
                    className="w-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground mb-4">
                      Preview not available for this file type
                    </p>
                    <Button asChild>
                      <a href={previewFile.url} target="_blank" rel="noopener noreferrer">
                        Open File
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Files;