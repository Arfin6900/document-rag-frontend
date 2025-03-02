import { postWithFormData } from '.';

const createDashboardRoutes = (api) => {
  const uploadMedia = async (body, isFormData) => {
    if (isFormData) {
      return postWithFormData(api, '/upload', body);
    }
    return api.post('/upload', body);
  };
  const addNewDocument = async (body, isFormData) => {
    if (isFormData) {
      return postWithFormData(api, '/dashboard/add-document', body);
    }
    return api.post('/dashboard/add-document', body);
  };
  return {
    uploadMedia,
    addNewDocument,
  };
};

export default createDashboardRoutes;
