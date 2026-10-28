import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sp-5rvl.onrender.com';

const api = axios.create({ baseURL: API_URL, timeout: 90000 });

//One key per logical action, so a retried request can never create a duplicate on the server
const newIdempotencyKey = () => crypto.randomUUID();

//Turns the API's problem+json errors into a readable message
export const errorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const problem = error?.response?.data;
  if (problem?.errors) return Object.values(problem.errors).join(' ');
  if (problem?.detail) return problem.detail;
  if (error?.code === 'ECONNABORTED') return 'The server is waking up. Please try again in a moment.';
  return fallback;
};

export const getUserProgressStats = (userId) => api.get(`/api/study-plan/user/${userId}/progress`);

export const getUpcomingSessions = (userId, limit = 5) =>
  api.get(`/api/study-plan/user/${userId}/upcoming`, { params: { limit } });

export const getUserSyllabi = (userId) => api.get(`/api/syllabus/user/${userId}`);

export const getUserStudyPlans = (userId) => api.get(`/api/study-plan/user/${userId}`);

export const searchSyllabi = (params) => api.get('/api/syllabus/search', { params });

//Marks a session done or not done
export const setSessionCompleted = (studyPlanId, sessionId, completed = true) =>
  api.put(`/api/study-plan/${studyPlanId}/session/${sessionId}`, null, { params: { completed } });

export const uploadSyllabus = (formData) =>
  api.post('/api/syllabus/upload', formData, { headers: { 'Idempotency-Key': newIdempotencyKey() } });

export const generateStudyPlan = (data) =>
  api.post('/api/study-plan/generate', data, { headers: { 'Idempotency-Key': newIdempotencyKey() } });

//Fetch all dashboard data in parallel
export const fetchAllDashboardData = async (userId) => {
  const [progress, syllabi, upcoming] = await Promise.all([
    getUserProgressStats(userId),
    getUserSyllabi(userId),
    getUpcomingSessions(userId),
  ]);
  return { progress: progress.data, syllabi: syllabi.data, upcoming: upcoming.data };
};

export default api;
