import axios from 'axios';

const api = axios.create({
  baseURL: 'https://studypilot-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

//For Syllabus search
export const searchSyllabi = (params) => api.get('/api/syllabus/search', { params });

//Study plan progress
export const getUserProgressStats = (userId) => api.get(`/api/study-plan/user/${userId}/progress`);

//Marks session as complete
export const completeSession = (studyPlanId, sessionId) =>
  api.put(`/api/study-plan/${studyPlanId}/session/${sessionId}/complete`);

export default api;