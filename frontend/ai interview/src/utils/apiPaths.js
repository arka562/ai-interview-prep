export const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const API_ROUTES = {
  // Auth
  REGISTER: `${BASE_URL}/api/auth/register`,
  LOGIN: `${BASE_URL}/api/auth/login`,
  PROFILE: `${BASE_URL}/api/auth/profile`,
  UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`,

  // Sessions
  CREATE_SESSION: `${BASE_URL}/api/sessions/`,
  GET_MY_SESSIONS: `${BASE_URL}/api/sessions/my-session`,
  GET_SESSION_BY_ID: (id) => `${BASE_URL}/api/sessions/${id}`,
  DELETE_SESSION: (id) => `${BASE_URL}/api/sessions/${id}`,

  // Questions
  TOGGLE_PIN_QUESTION: (id) => `${BASE_URL}/api/questions/${id}/pin`,
  UPDATE_QUESTION_NOTE: (id) => `${BASE_URL}/api/questions/${id}/note`,
  ADD_QUESTION_TO_SESSION: `${BASE_URL}/api/questions/add`,

  // AI
  GENERATE_QUESTIONS: `${BASE_URL}/api/ai/generate-questions`,
  GENERATE_EXPLANATIONS: `${BASE_URL}/api/ai/generate-explanations`,
};
