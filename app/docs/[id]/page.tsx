"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  FileText, 
  Calendar, 
  Layers, 
  Edit, 
  Trash2,
  Download,
  Link,
  ExternalLink
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ChunkVisualizer } from "@/components/document/chunk-visualizer";
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
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

// Mock document data
const documentData = {
  id: "1",
  fileName: "Annual Report 2024.pdf",
  summary: "Financial report covering Q1-Q4 of fiscal year 2024 with detailed analysis of revenue streams and market performance. The document includes executive summaries, financial statements, market analysis, and future projections. Key highlights include a 15% revenue growth, expansion into new markets, and strategic partnerships.",
  chunks: 24,
  uploadDate: new Date("2024-03-15"),
  fileType: "pdf",
  fileSize: "2.4 MB",
  lastQueried: new Date("2024-03-20"),
  metadata: {
    author: "Finance Department",
    createdDate: new Date("2024-02-28"),
    pages: 42,
    keywords: ["finance", "annual report", "revenue", "projections", "Q4"],
  },
  relatedDocuments: [
    {
      id: "2",
      fileName: "Q4 Financial Summary.pdf",
      relevance: 0.92,
    },
    {
      id: "5",
      fileName: "Market Analysis.pdf",
      relevance: 0.78,
    },
  ],
  chunkContent: [
    { id: "c1", content: "Executive Summary: The fiscal year 2024 has been a period of significant growth and transformation for our company. We achieved a 15% increase in revenue compared to the previous year, with particularly strong performance in our technology and services divisions.", relevance: 0.95 },
    { id: "c2", content: "Financial Highlights: Total revenue reached $245 million, representing a 15% year-over-year growth. Operating margin improved to 28%, up from 24% in the previous year. Cash flow from operations increased by 22% to $67 million.", relevance: 0.88 },
    { id: "c3", content: "Market Expansion: We successfully entered three new international markets in Asia-Pacific, establishing a strong presence in Singapore, Malaysia, and Vietnam. These new markets contributed 8% to our overall revenue in Q4.", relevance: 0.75 },
    { id: "c4", content: "Strategic Partnerships: We formed key strategic alliances with industry leaders in cloud computing and artificial intelligence, allowing us to enhance our product offerings and deliver more value to our customers.", relevance: 0.82 },
    { id: "c5", content: "Future Outlook: For fiscal year 2025, we project continued growth at 12-18%, driven by expansion in existing markets and further penetration into the Asia-Pacific region. We anticipate increased investment in R&D, particularly in AI and machine learning technologies.", relevance: 0.91 },
  ],
};

export default function DocumentViewPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [activeTab, setActiveTab] = useState("overview");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    toast.success("Document deleted successfully");
    router.push("/docs");
  };

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
            onClick={() => router.push("/docs")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-heading font-bold neon-text-purple">Document Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {/* {documentData.fileType === "pdf" ? <FilePdf className="h-5 w-5 text-red-500" /> : <FileText className="h-5 w-5 text-blue-500" />} */}
                    <CardTitle>{documentData.fileName}</CardTitle>
                  </div>
                  <CardDescription>{documentData.summary}</CardDescription>
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
                          Are you sure you want to delete this document? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Uploaded On</p>
                    <p className="text-sm">{format(documentData.uploadDate, 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">File Size</p>
                    <p className="text-sm">{documentData.fileSize}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li><strong>Author:</strong> {documentData.metadata.author}</li>
                  <li><strong>Created Date:</strong> {format(documentData.metadata.createdDate, 'PPP')}</li>
                  <li><strong>Pages:</strong> {documentData.metadata.pages}</li>
                  <li><strong>Keywords:</strong> {documentData.metadata.keywords.join(", ")}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
