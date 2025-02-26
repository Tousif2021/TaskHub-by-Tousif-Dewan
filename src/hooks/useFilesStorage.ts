
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFileStorage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async (file: File) => {
    if (!file) return null;
    
    setIsLoading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      
      // Upload to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('files')
        .upload(fileName, file);
        
      if (storageError) throw storageError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(fileName);
      
      // Save to database
      const { data, error: dbError } = await supabase.from('files').insert({
        name: file.name,
        path: publicUrl,
        size: file.size,
        type: file.type,
      }).select().single();
      
      if (dbError) throw dbError;
      
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (id: string, path?: string) => {
    setIsLoading(true);
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;
      
      // If path is provided, delete from storage as well
      if (path) {
        // Extract file name from URL
        const fileName = path.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('files')
            .remove([fileName]);
            
          if (storageError) {
            console.warn('Failed to delete file from storage:', storageError);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadFile,
    deleteFile,
    isLoading
  };
};
