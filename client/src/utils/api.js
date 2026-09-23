import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:4000/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const studentToken = localStorage.getItem('StudentToken');
        const teacherToken = localStorage.getItem('TeacherToken');
        
        // Attach whichever token exists
        if (studentToken) {
            config.headers.Authorization = Bearer \;
        } else if (teacherToken) {
            config.headers.Authorization = Bearer \;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('StudentToken');
            localStorage.removeItem('TeacherToken');
            // Force reload to trigger auth state reset in Context
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
