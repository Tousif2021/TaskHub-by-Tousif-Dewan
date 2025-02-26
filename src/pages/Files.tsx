
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Upload, File, FileText, Image, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  created_at: string;
}

const Files = () => {
  const [dragActive, setDragActive] = useState(false);

  const { data: files, isLoading } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FileItem[];
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save file metadata to database
      const { error: dbError } = await supabase.from("files").insert({
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
      });

      if (dbError) throw dbError;

      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("text/")) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-fade-down">
          <h1 className="text-3xl font-semibold text-primary">File Room</h1>
          <p className="text-primary/60 mt-2">
            Upload and manage your files securely
          </p>
        </div>

        <div
          className={`mt-8 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-accent bg-accent/5"
              : "border-primary/20 hover:border-primary/30"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-10 h-10 text-primary/40 mx-auto mb-4" />
          <p className="text-primary/60 mb-2">
            Drag and drop files here, or{" "}
            <label className="text-accent hover:underline cursor-pointer">
              browse
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </p>
          <p className="text-primary/40 text-sm">
            Support for images, documents, and more
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-primary/60">Loading files...</p>
            </div>
          ) : !files?.length ? (
            <div className="text-center py-12 bg-white/50 rounded-lg">
              <p className="text-primary/60">No files uploaded yet</p>
            </div>
          ) : (
            files.map((file) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-secondary rounded">
                      <FileIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-primary font-medium">{file.name}</h3>
                      <p className="text-primary/40 text-sm">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-2 text-primary/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete file"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Files;
