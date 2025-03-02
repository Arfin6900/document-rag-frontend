"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid, List, Plus, FileText, File as FilePdf, SortAsc, SortDesc, Trash2, Download, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadZone } from "@/components/document/file-upload-zone";
import { format } from "date-fns";

// Mock data
const documents = [
  {
    id: "1",
    fileName: "Annual Report 2024.pdf",
    summary: "Financial report covering Q1-Q4 of fiscal year 2024 with detailed analysis of revenue streams and market performance.",
    chunks: 24,
    uploadDate: new Date("2024-03-15"),
    fileType: "pdf",
  },
  {
    id: "2",
    fileName: "Project Proposal.txt",
    summary: "Detailed proposal for the new AI integration project including timeline, resource requirements, and expected outcomes.",
    chunks: 12,
    uploadDate: new Date("2024-03-10"),
    fileType: "txt",
  },
  {
    id: "3",
    fileName: "Meeting Minutes.txt",
    summary: "Minutes from the quarterly board meeting discussing strategic initiatives and budget allocations for upcoming projects.",
    chunks: 8,
    uploadDate: new Date("2024-03-05"),
    fileType: "txt",
  },
  {
    id: "4",
    fileName: "Technical Documentation.pdf",
    summary: "Comprehensive documentation of the system architecture, API endpoints, and integration points for the new platform.",
    chunks: 32,
    uploadDate: new Date("2024-02-28"),
    fileType: "pdf",
  },
  {
    id: "5",
    fileName: "Market Analysis.pdf",
    summary: "In-depth analysis of current market trends, competitor landscape, and growth opportunities in the AI sector.",
    chunks: 18,
    uploadDate: new Date("2024-02-20"),
    fileType: "pdf",
  },
  {
    id: "6",
    fileName: "Product Roadmap.txt",
    summary: "Detailed roadmap outlining feature development, release schedules, and strategic milestones for the next 12 months.",
    chunks: 15,
    uploadDate: new Date("2024-02-15"),
    fileType: "txt",
  },
];

type ViewMode = "grid" | "list";
type SortOption = "name" | "date" | "chunks";
type SortDirection = "asc" | "desc";
type FileType = "all" | "pdf" | "txt";

export default function DocumentsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [fileTypeFilter, setFileTypeFilter] = useState<FileType>("all");
  const [showUpload, setShowUpload] = useState(false);

  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = fileTypeFilter === "all" || doc.fileType === fileTypeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc" 
          ? a.fileName.localeCompare(b.fileName)
          : b.fileName.localeCompare(a.fileName);
      } else if (sortBy === "date") {
        return sortDirection === "asc"
          ? a.uploadDate.getTime() - b.uploadDate.getTime()
          : b.uploadDate.getTime() - a.uploadDate.getTime();
      } else {
        return sortDirection === "asc"
          ? a.chunks - b.chunks
          : b.chunks - a.chunks;
      }
    });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold neon-text-purple">Documents</h1>
            <p className="text-muted-foreground">Manage and query your document collection</p>
          </div>
          
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="glass">
              <TabsTrigger 
                value="all" 
                onClick={() => setFileTypeFilter("all")}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="pdf" 
                onClick={() => setFileTypeFilter("pdf")}
              >
                PDF
              </TabsTrigger>
              <TabsTrigger 
                value="txt" 
                onClick={() => setFileTypeFilter("txt")}
              >
                TXT
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10 glass border-primary/20 focus:border-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="glass border-primary/20">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-primary/20">
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name {sortBy === "name" && (sortDirection === "asc" ? <SortAsc className="h-4 w-4 ml-2" /> : <SortDesc className="h-4 w-4 ml-2" />)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Date {sortBy === "date" && (sortDirection === "asc" ? <SortAsc className="h-4 w-4 ml-2" /> : <SortDesc className="h-4 w-4 ml-2" />)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("chunks")}>
                  Chunks {sortBy === "chunks" && (sortDirection === "asc" ? <SortAsc className="h-4 w-4 ml-2" /> : <SortDesc className="h-4 w-4 ml-2" />)}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleSortDirection}>
                  {sortDirection === "asc" ? "Ascending" : "Descending"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center border border-primary/20 rounded-md overflow-hidden glass">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-9 w-9 ${viewMode === "grid" ? "bg-primary/20" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-9 w-9 ${viewMode === "list" ? "bg-primary/20" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              className="bg-primary hover:bg-primary/90 neon-glow-purple"
              onClick={() => setShowUpload(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showUpload ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FileUploadZone onClose={() => setShowUpload(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="documents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-heading font-medium mb-2">No documents found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? "Try a different search term or filter" : "Upload your first document to get started"}
                  </p>
                  {!searchQuery && (
                    <Button 
                      className="bg-primary hover:bg-primary/90 neon-glow-purple"
                      onClick={() => setShowUpload(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  )}
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((doc, index) => (
                    <DocumentCard 
                      key={doc.id} 
                      document={doc} 
                      index={index}
                      onView={() => router.push(`/docs/${doc.id}`)}
                      onDelete={() => console.log("Delete", doc.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map((doc, index) => (
                    <DocumentListItem 
                      key={doc.id} 
                      document={doc} 
                      index={index}
                      onView={() => router.push(`/docs/${doc.id}`)}
                      onDelete={() => console.log("Delete", doc.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MainLayout>
  );
}

interface DocumentCardProps {
  document: typeof documents[0];
  index: number;
  onView: () => void;
  onDelete: () => void;
}

function DocumentCard({ document, index, onView, onDelete }: DocumentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass rounded-xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-primary/10">
            {document.fileType === "pdf" ? (
              <FilePdf className="h-6 w-6 text-primary" />
            ) : (
              <FileText className="h-6 w-6 text-secondary" />
            )}
          </div>
          <Badge variant="outline" className="bg-muted/30">
            {document.chunks} chunks
          </Badge>
        </div>
        
        <h3 className="font-heading font-medium text-lg mb-2 truncate" title={document.fileName}>
          {document.fileName}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 h-[4.5rem]">
          {document.summary}
        </p>
        
        <div className="text-xs text-muted-foreground mb-4">
          Uploaded on {format(document.uploadDate, "MMM d, yyyy")}
        </div>
      </div>
      
      <CardFooter className="flex justify-between gap-2 p-4 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full glass border-primary/20 hover:border-primary/50"
          onClick={onView}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full glass border-destructive/20 hover:border-destructive/50 text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </motion.div>
  );
}

interface DocumentListItemProps {
  document: typeof documents[0];
  index: number;
  onView: () => void;
  onDelete: () => void;
}

function DocumentListItem({ document, index, onView, onDelete }: DocumentListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ x: 5 }}
      className="glass rounded-lg overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-300"
    >
      <div className="p-4 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
          {document.fileType === "pdf" ? (
            <FilePdf className="h-6 w-6 text-primary" />
          ) : (
            <FileText className="h-6 w-6 text-secondary" />
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <h3 className="font-heading font-medium truncate" title={document.fileName}>
            {document.fileName}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {document.summary}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline" className="bg-muted/30 text-xs">
              {document.chunks} chunks
            </Badge>
            <span className="text-xs text-muted-foreground">
              {format(document.uploadDate, "MMM d, yyyy")}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onView}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}