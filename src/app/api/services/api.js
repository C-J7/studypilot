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

//to Upload syllabus (multipart/form-data)
export const uploadSyllabus = (formData) =>
  api.post('/api/syllabus/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

//Get all syllabi (with optional filters)
export const getSyllabi = (params) => api.get('/api/syllabus', { params });

//Generate study plan
export const generateStudyPlan = (data) =>
  api.post('/api/study-plan/generate', data);

//Fetch all dashboard data in parallel
export const fetchAllDashboardData = async (userId) => {
  const [progress, syllabi, reminders] = await Promise.all([
    getUserProgressStats(userId),
    getSyllabi({ userId }),
    api.get(`/api/reminders?userId=${userId}`) 
      .catch((error) => {
        console.error('Error fetching reminders:', error);
        return { data: [] }; //Returns an empty array if there's an error
      }),
  ]);
  return { progress: progress.data, syllabi: syllabi.data, reminders: reminders.data };
};

export default api;