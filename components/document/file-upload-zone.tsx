"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, X, FileText, File as FilePdf, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

interface FileUploadZoneProps {
  onClose: () => void;
}

type FileStatus = "idle" | "uploading" | "success" | "error";

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: FileStatus;
  error?: string;
}

export function FileUploadZone({ onClose }: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      progress: 0,
      status: "idle" as FileStatus,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload process for each file
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxSize: 10485760, // 10MB
    onDropRejected: (rejections) => {
      rejections.forEach(rejection => {
        if (rejection.errors[0].code === 'file-too-large') {
          toast.error('File is too large. Maximum size is 10MB.');
        } else if (rejection.errors[0].code === 'file-invalid-type') {
          toast.error('Invalid file type. Only PDF and TXT files are supported.');
        } else {
          toast.error('File upload failed: ' + rejection.errors[0].message);
        }
      });
    }
  });

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: Math.random() > 0.9 ? "error" : "success", error: "Server error" } 
              : f
          )
        );
        
        const file = files.find(f => f.id === fileId);
        if (file) {
          if (Math.random() > 0.9) {
            toast.error(`Failed to upload ${file.file.name}`);
          } else {
            toast.success(`${file.file.name} uploaded successfully`);
          }
        }
      } else {
        setFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress, status: "uploading" } 
              : f
          )
        );
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadAll = () => {
    files.forEach(file => {
      if (file.status === "idle") {
        simulateUpload(file.id);
      }
    });
  };

  const allCompleted = files.length > 0 && files.every(f => f.status === "success" || f.status === "error");
  const hasFiles = files.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="glass border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-xl">Upload Documents</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              isDragActive 
                ? "border-primary bg-primary/10" 
                : "border-muted-foreground/30 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
              <div className={`p-4 rounded-full ${isDragActive ? "bg-primary/20" : "bg-muted"}`}>
                <Upload className={`h-8 w-8 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              
              <div>
                <h3 className="text-lg font-heading font-medium mb-1">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse (PDF, TXT up to 10MB)
                </p>
              </div>
            </div>
          </div>

          {hasFiles && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-medium">Files</h4>
                {!allCompleted && (
                  <Button 
                    size="sm" 
                    onClick={uploadAll}
                    className="bg-primary hover:bg-primary/90 neon-glow-purple"
                  >
                    Upload All
                  </Button>
                )}
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {files.map((fileObj) => (
                  <FileItem 
                    key={fileObj.id} 
                    fileObj={fileObj} 
                    onRemove={() => removeFile(fileObj.id)} 
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="glass border-primary/20">
            Cancel
          </Button>
          <Button 
            onClick={onClose} 
            disabled={!hasFiles || !allCompleted}
            className="bg-primary hover:bg-primary/90 neon-glow-purple"
          >
            Done
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

interface FileItemProps {
  fileObj: UploadFile;
  onRemove: () => void;
}

function FileItem({ fileObj, onRemove }: FileItemProps) {
  const { file, progress, status, error } = fileObj;
  
  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
        return null;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
      <div className="p-2 rounded-lg bg-primary/10">
        {file.type === "application/pdf" ? (
          <FilePdf className="h-5 w-5 text-primary" />
        ) : (
          <FileText className="h-5 w-5 text-secondary" />
        )}
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate" title={file.name}>
            {file.name}
          </p>
          {getStatusIcon()}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          {/* <Progress value={progress} className="h-1.5 flex-grow" /> */}
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {status === "error" ? "Failed" : `${progress}%`}
          </span>
        </div>
        
        {status === "error" && error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 flex-shrink-0" 
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}