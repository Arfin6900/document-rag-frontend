export interface Document {
  id: string;
  fileName: string;
  summary: string;
  chunks: number;
  uploadDate: Date;
  fileType: string;
  fileSize: string;
  lastQueried?: Date;
  metadata?: {
    author: string;
    createdDate: Date;
    pages: number;
    keywords: string[];
  };
  relatedDocuments?: Array<{
    id: string;
    fileName: string;
    relevance: number;
  }>;
  chunkContent?: Array<{
    id: string;
    content: string;
    relevance: number;
  }>;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface DocumentUploadResponse {
  message: string;
  details: {
    fileName: string;
    fileUrl: string;
    totalChunks: number;
    summary: string;
    fileType: string;
    fileSize: string;
    uploadDate: Date;
  };
}

export interface DocumentQueryResponse {
  relevantChunks: string[];
  contextSummaries: string[];
  metadata: Array<{
    fileName: string;
    pageNumber?: number;
    type: string;
    summary: string;
  }>;
  confidence: number;
}

export interface DocumentDeleteResponse {
  message: string;
  details: {
    fileName: string;
    deletedFromStorage: boolean;
  };
}
