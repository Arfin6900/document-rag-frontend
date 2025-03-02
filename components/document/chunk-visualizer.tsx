"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Chunk {
  id: string;
  content: string;
  relevance: number;
}

interface ChunkVisualizerProps {
  chunks: Chunk[];
}

export function ChunkVisualizer({ chunks }: ChunkVisualizerProps) {
  const [selectedChunk, setSelectedChunk] = useState<string | null>(chunks[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredChunks = chunks.filter(chunk => 
    chunk.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedChunkIndex = filteredChunks.findIndex(chunk => chunk.id === selectedChunk);
  const selectedChunkData = filteredChunks.find(chunk => chunk.id === selectedChunk);
  
  const handlePrevChunk = () => {
    if (selectedChunkIndex > 0) {
      setSelectedChunk(filteredChunks[selectedChunkIndex - 1].id);
    }
  };
  
  const handleNextChunk = () => {
    if (selectedChunkIndex < filteredChunks.length - 1) {
      setSelectedChunk(filteredChunks[selectedChunkIndex + 1].id);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search in chunks..."
          className="pl-10 glass border-primary/20 focus:border-primary/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filteredChunks.map((chunk) => (
          <motion.div
            key={chunk.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedChunk(chunk.id)}
            className={`cursor-pointer p-2 rounded-md transition-colors ${
              selectedChunk === chunk.id 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted/30 hover:bg-muted/50"
            }`}
            style={{
              opacity: 0.5 + chunk.relevance * 0.5,
            }}
          >
            {chunk.id}
          </motion.div>
        ))}
      </div>
      
      {filteredChunks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No chunks match your search</p>
        </div>
      ) : selectedChunkData ? (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-medium">Chunk Content</h3>
              <Badge variant="outline" className="text-xs">
                {selectedChunkIndex + 1} of {filteredChunks.length}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handlePrevChunk}
                disabled={selectedChunkIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleNextChunk}
                disabled={selectedChunkIndex >= filteredChunks.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <motion.div
            key={selectedChunkData.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-lg bg-muted/30 border border-primary/10"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                Chunk ID: {selectedChunkData.id}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Relevance: {Math.round(selectedChunkData.relevance * 100)}%
              </Badge>
            </div>
            <p className="text-sm whitespace-pre-wrap">{selectedChunkData.content}</p>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}