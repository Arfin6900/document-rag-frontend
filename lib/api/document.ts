import axios from '../axios';

export const documentApi = {
  // Upload document
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('files', file);

    const response = await axios.post('/doc/add-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get documents list with pagination and filters
  getDocuments: async (params?: {
    page?: number;
    limit?: number;
    sort?: 'name' | 'date' | 'chunks';
    order?: 'asc' | 'desc';
    type?: 'all' | 'pdf' | 'txt';
    search?: string;
    fileType?: string;
  }) => {
    const response = await axios.get('/doc/list', { params });
    return response.data;
  },

  // Get single document details
  getDocument: async (id: string) => {
    const response = await axios.get(`/doc/${id}`);
    return response.data;
  },

  // Delete document
  deleteDocument: async (id: string) => {
    const response = await axios.delete(`/doc/delete-asset/${id}`);
    return response.data;
  },

  // Query document
  queryDocument: async (query: string, documentId?: string, limit?: number) => {
    const response = await axios.post('/doc/query-docs', {
      query,
      documentId,
      limit,
    });
    return response.data;
  },
};
