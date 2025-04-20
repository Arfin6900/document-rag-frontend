import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { documentApi } from '@/lib/api/document';
import { Document } from '@/lib/types';
import { calculateReadingTime, formatDate, formatFileSize } from '@/lib/utils';
import { Download, FileText, FileType, MessageSquare, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await documentApi.getDocument(document.id);
        setContent(response.content);
      } catch (error) {
        setError('Failed to load document content');
        toast.error('Failed to load document content');
        console.error('Error loading document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentContent();
  }, [document.id]);

  const handleDownload = async () => {
    try {
      // Implement download functionality
      toast.success('Document downloaded successfully');
    } catch (error) {
      toast.error('Failed to download document');
      console.error('Error downloading document:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Document Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            {document.fileType === 'pdf' ? (
              <FileType className="h-6 w-6 text-red-500" />
            ) : (
              <FileText className="h-6 w-6 text-blue-500" />
            )}
            <div>
              <CardTitle className="text-xl">{document.fileName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(Number(document.fileSize))} • Uploaded{' '}
                {formatDate(document.uploadDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Document Content */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Document Stats */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <div>
                  <p className="text-sm font-medium">Reading Time</p>
                  <p className="text-2xl font-bold">
                    {calculateReadingTime(content)} min
                  </p>
                </div>
                <div className="border-l pl-4">
                  <p className="text-sm font-medium">Word Count</p>
                  <p className="text-2xl font-bold">
                    {content.trim().split(/\s+/).length.toLocaleString()}
                  </p>
                </div>
                {document.lastQueried && (
                  <div className="border-l pl-4">
                    <p className="text-sm font-medium">Last Queried</p>
                    <p className="text-2xl font-bold">
                      {formatDate(document.lastQueried)}
                    </p>
                  </div>
                )}
              </div>

              {/* Document Preview */}
              <div className="relative">
                {document.fileType === 'pdf' ? (
                  <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">
                      PDF preview not available
                    </p>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-muted rounded-lg">
                    {content}
                  </pre>
                )}
              </div>

              {/* Query Button */}
              <div className="flex justify-center pt-4">
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Query this Document
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
