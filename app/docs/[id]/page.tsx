'use client';

import { EmbeddingsVisualizer } from '@/components/document/EmbeddingsVisualizer';
import { MainLayout } from '@/components/layout/main-layout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation, useQuery } from '@tanstack/react-query';
import apis from 'apis';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, File, FileText, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DocumentViewPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Fetch document data
  const {
    data: documentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['document', id],
    queryFn: () => apis.getDocument(id as string),
  });
  const document = documentData?.data;

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => apis.deleteDocument(documentId),
    onSuccess: () => {
      toast.success('Document deleted successfully');
      router.push('/docs');
    },
    onError: (error) => {
      toast.error('Failed to delete document');
      console.error('Error deleting document:', error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(id as string);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !document) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-2">
            Failed to load document
          </h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
          <Button onClick={() => router.push('/docs')}>Go Back</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.push('/docs')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-heading font-bold neon-text-purple">
            Document Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {document.fileType === 'pdf' ? (
                      <File className="h-5 w-5 text-red-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-500" />
                    )}
                    <CardTitle>{document.fileName}</CardTitle>
                  </div>
                  <CardDescription>{document.summary}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Download className="h-5 w-5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this document? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Uploaded On</p>
                    <p className="text-sm">
                      {format(new Date(document.created_at), 'PPP')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">File Size</p>
                    <p className="text-sm">{document.fileSize || 'Unknown'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Content Preview */}
            {document.content && (
              <Card>
                <CardHeader>
                  <CardTitle>Content Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg">
                    {document.content}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Embeddings Visualization */}
            {document.chunks && document.chunks.length > 0 && (
              <EmbeddingsVisualizer chunks={document.chunks} />
            )}
          </div>
          {/* <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>
                    <strong>Author:</strong> {document.metadata.author}
                  </li>
                  <li>
                    <strong>Created Date:</strong>{' '}
                    {format(new Date(document.metadata.createdDate), 'PPP')}
                  </li>
                  <li>
                    <strong>Pages:</strong> {document.metadata.pages}
                  </li>
                  {document.metadata.keywords.length > 0 && (
                    <li>
                      <strong>Keywords:</strong>{' '}
                      {document.metadata.keywords.join(', ')}
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>
                    <strong>Total Chunks:</strong> {document.chunks.length}
                  </li>
                  <li>
                    <strong>File Type:</strong>{' '}
                    <span className="uppercase">{document.fileType}</span>
                  </li>
                  {document.lastQueried && (
                    <li>
                      <strong>Last Queried:</strong>{' '}
                      {format(new Date(document.lastQueried), 'PPP')}
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Embedding Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>
                    <strong>Total Chunks:</strong> {document.totalChunks}
                  </li>
                  <li>
                    <strong>Embedding Dimensions:</strong>{' '}
                    {document.chunks?.[0]?.embedding.length || 0}
                  </li>
                  <li>
                    <strong>Average Chunk Length:</strong>{' '}
                    {Math.round(
                      document.chunks?.reduce(
                        (acc, chunk) => acc + chunk?.content?.length,
                        0
                      ) / document.chunks?.length || 0
                    )}{' '}
                    characters
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </motion.div>
    </MainLayout>
  );
}
