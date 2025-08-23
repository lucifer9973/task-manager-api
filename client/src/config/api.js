// API configuration
// Use relative path so it works on both localhost and Vercel
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    ALL_USERS: `${API_BASE_URL}/api/auth/all`
  },
  TASKS: {
    BASE: `${API_BASE_URL}/api/tasks`,
    BY_ID: (id) => `${API_BASE_URL}/api/tasks/${id}`
  },
  ADMIN: {
    USERS: `${API_BASE_URL}/api/admin/users`,
    TASKS: `${API_BASE_URL}/api/admin/tasks`,
    STATS: `${API_BASE_URL}/api/admin/stats`,
    USER_BY_ID: (id) => `${API_BASE_URL}/api/admin/users/${id}`,
    TASK_BY_ID: (id) => `${API_BASE_URL}/api/admin/tasks/${id}`
  }
};

export default API_BASE_URL;
