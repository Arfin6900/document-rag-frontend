import { postWithFormData } from '.';

const createDashboardRoutes = (api) => {
  const uploadMedia = async (body, isFormData) => {
    if (isFormData) {
      return postWithFormData(api, '/embeddings', body);
    }
    return api.post('/embeddings', body);
  };

  const uploadDocument = async (file, isFormData = true) => {
    const formData = new FormData();
    formData.append('file', file);
    if (isFormData) {
      return postWithFormData(api, '/doc/embeddings', formData);
    }
    return api.post('/doc/embeddings', formData);
  };

  const getDocuments = async (params) => {
    return api.get('/doc/list/');
  };

  const getDocument = async (id) => {
    return api.get(`/doc/document/${id}`);
  };

  const deleteDocument = async (id) => {
    return api.delete(`/doc/delete-asset/${id}`);
  };

  const queryDocument = async (query, documentId, limit) => {
    return api.post('/doc/query-docs', { query, documentId, limit });
  };

  return {
    uploadMedia,
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    queryDocument,
  };
};

export default createDashboardRoutes;
