"use client";

import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Document types
export interface Document {
  id: string;
  fileName: string;
  summary: string;
  chunks: number;
  uploadDate: Date;
  fileType: "pdf" | "txt";
  fileSize?: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface QueryResult {
  answer: string;
  sources: {
    documentId: string;
    fileName: string;
    content: string;
    relevance: number;
  }[];
}

// API functions
export const documentApi = {
  // Get all documents
  getAllDocuments: async (): Promise<Document[]> => {
    try {
      const response = await api.get("/documents");
      return response.data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },

  // Get document by ID
  getDocument: async (id: string): Promise<Document> => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error);
      throw error;
    }
  },

  // Upload document
  uploadDocument: async (file: File): Promise<Document> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await api.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },

  // Delete document
  deleteDocument: async (id: string): Promise<void> => {
    try {
      await api.delete(`/documents/${id}`);
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error);
      throw error;
    }
  },

  // Delete all documents
  deleteAllDocuments: async (): Promise<void> => {
    try {
      await api.delete("/documents");
    } catch (error) {
      console.error("Error deleting all documents:", error);
      throw error;
    }
  },

  // Query documents
  queryDocuments: async (query: string, modelType: string): Promise<QueryResult> => {
    try {
      const response = await api.post("/documents/query", {
        query,
        modelType,
      });
      
      return response.data;
    } catch (error) {
      console.error("Error querying documents:", error);
      throw error;
    }
  },
};