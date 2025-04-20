'use client';

import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle,
  File as FilePdf,
  FileText,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
// import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import apis from 'apis';
import toast from 'react-hot-toast';

interface FileUploadZoneProps {
  onClose: () => void;
  onUploadComplete?: () => void;
}

type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: FileStatus;
  error?: string;
}

export function FileUploadZone({
  onClose,
  onUploadComplete,
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      progress: 0,
      status: 'idle' as FileStatus,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      for (const fileObj of files) {
        if (fileObj.status === 'success') continue;

        try {
          // Update status to uploading
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, status: 'uploading' as FileStatus, progress: 0 }
                : f
            )
          );

          // Upload file
          const result = await apis.uploadDocument(fileObj.file);

          // Update status to success
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, status: 'success' as FileStatus, progress: 100 }
                : f
            )
          );

          toast.success(`${fileObj.file.name} uploaded successfully`);
        } catch (error) {
          // Update status to error
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    status: 'error' as FileStatus,
                    error:
                      error instanceof Error ? error.message : 'Upload failed',
                  }
                : f
            )
          );
        }
      }

      // If all files uploaded successfully
      if (files.every((f) => f.status === 'success')) {
        onUploadComplete?.();
        onClose();
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Documents
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload
              className={`h-10 w-10 ${
                isDragActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            <p className="text-muted-foreground">
              {isDragActive
                ? 'Drop the files here'
                : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, TXT (Max 10MB)
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((fileObj) => (
              <div
                key={fileObj.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {fileObj.file.type === 'application/pdf' ? (
                    <FilePdf className="h-5 w-5 text-red-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-blue-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{fileObj.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(fileObj.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {fileObj.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {fileObj.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {fileObj.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(fileObj.id)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
              Uploading...
            </>
          ) : (
            'Upload'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
