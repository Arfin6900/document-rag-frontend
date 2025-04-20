import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface EmbeddingsVisualizerProps {
  chunks: Array<{
    id: string;
    text: string;
    embedding: number[]; // ChromaDB always returns an array of numbers
    metadata: any;
    vector_id: string;
  }>;
}

export function EmbeddingsVisualizer({ chunks }: EmbeddingsVisualizerProps) {
  const [activeChunk, setActiveChunk] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to draw heatmap
  // const drawHeatmap = () => {
  //   const canvas = canvasRef.current;
  //   if (!canvas || !chunks.length) return;

  //   const ctx = canvas.getContext('2d');
  //   if (!ctx) return;

  //   const padding = 20;
  //   const cellSize = 4;
  //   const embedSize = chunks.length;
  //   const numChunks = chunks.length;

  //   // Set canvas size
  //   canvas.width = embedSize * cellSize + padding * 2;
  //   canvas.height = numChunks * cellSize + padding * 2;

  //   // Clear canvas
  //   ctx.fillStyle = '#000';
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);

  //   // Draw embeddings
  //   chunks.forEach((chunk, chunkIndex) => {
  //     chunk.embedding.forEach((value, embedIndex) => {
  //       // Normalize value to 0-1 range
  //       const normalizedValue = (value + 1) / 2;

  //       // Create color gradient (purple to yellow)
  //       const r = Math.floor(normalizedValue * 255);
  //       const g = Math.floor(normalizedValue * 255);
  //       const b = Math.floor((1 - normalizedValue) * 255);

  //       ctx.fillStyle = `rgb(${r},${g},${b})`;
  //       ctx.fillRect(
  //         embedIndex * cellSize + padding,
  //         chunkIndex * cellSize + padding,
  //         cellSize,
  //         cellSize
  //       );
  //     });
  //   });

  //   // Add axis labels
  //   ctx.fillStyle = '#fff';
  //   ctx.font = '10px monospace';
  //   ctx.fillText('Chunks', 2, canvas.height / 2);
  //   ctx.fillText('Dimensions', canvas.width / 2, canvas.height - 2);
  // };

  // useEffect(() => {
  //   drawHeatmap();
  // }, [chunks]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Document Embeddings Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="heatmap">
          <TabsList>
            <TabsTrigger value="heatmap">Embeddings Heatmap</TabsTrigger>
            <TabsTrigger value="chunks">Chunks List</TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap" className="mt-4">
            <div className="flex flex-col items-center space-y-4">
              <canvas
                ref={canvasRef}
                className="border border-border rounded-lg"
              />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Each row represents a chunk's embedding vector</p>
                <p>
                  Colors indicate embedding values: darker = lower, brighter =
                  higher
                </p>
                <p>
                  Total chunks: {chunks.length}, Dimensions per chunk:{' '}
                  {chunks.length}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chunks" className="mt-4">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {chunks.map((chunk) => (
                <div
                  key={chunk.vector_id}
                  className={cn(
                    'p-4 rounded-lg mb-2 cursor-pointer transition-colors',
                    activeChunk === chunk.vector_id
                      ? 'bg-primary/20'
                      : 'hover:bg-muted'
                  )}
                  onClick={() => setActiveChunk(chunk.vector_id)}
                >
                  {/* <h4 className="font-medium mb-2">
                    Chunk{' '}
                    {chunk.metadata.pageNumber
                      ? `(Page ${chunk.metadata.pageNumber})`
                      : ''}
                  </h4> */}
                  <p className="text-sm text-muted-foreground">
                    {chunk.text}
                  </p>
                  {/* {activeChunk === chunk.id && (
                    <div className="mt-2 text-xs text-muted-foreground space-y-1">
                      <p>Embedding dimensions: {chunk.embedding.length}</p>
                      <p>
                        Range: [{Math.min(...chunk.embedding).toFixed(3)} to{' '}
                        {Math.max(...chunk.embedding).toFixed(3)}]
                      </p>
                      <p>
                        Average:{' '}
                        {(
                          chunk.embedding.reduce((a, b) => a + b, 0) /
                          chunk.embedding.length
                        ).toFixed(3)}
                      </p>
                    </div>
                  )} */}
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
