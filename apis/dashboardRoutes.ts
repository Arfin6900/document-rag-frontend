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
    return api.delete(`/doc/document/${id}`);
  };

  const queryDocument = async (query) => {
    return api.post('/doc/embeddings/query/', query);
  };


  interface Chats {
    id: string;
    name: string;
    created_at: string;
    user_id: string;
    contexts: string[];
    provider: string;
    is_active: boolean;
  }

  const getChats = async () : Promise<{data:Chats[]}> => {
    return api.get('/chat/rooms/');
  };


  interface ChatMessage {
    id: string;
    chat_room_id: string;
    query: string;
    response: string;
    timestamp: string;
    relevancy_scores: {
      document_name: string;
      score: number;
    }[];
  }
  const getChatMessages = async (id) : Promise<{data:ChatMessage[]}> => {
    return api.get(`/chat/room/${id}/messages/`);
  };

  const deleteChat = async (id) => {
    return api.delete(`/chat/room/${id}/`);
  };


  interface Chat {
    name: string;
    contexts?: string[]; 
    provider?: string | "gemini";
    user_id?: string;
  }
  const createChat = async (body: Chat) => {
    return api.post('/chat/room/', body);
  };
  

  return {
    uploadMedia,
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    queryDocument,
    getChats,
    getChatMessages,
    createChat,
    deleteChat,
  };
};

export default createDashboardRoutes;
