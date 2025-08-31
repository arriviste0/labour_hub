import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url, response.data);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    }
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
            { refreshToken }
          );
          
          const newToken = response.data.token;
          localStorage.setItem('token', newToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    sendOTP: '/auth/otp/send',
    verifyOTP: '/auth/otp/verify',
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    setPassword: '/auth/set-password',
    changePassword: '/auth/change-password',
    refreshToken: '/auth/refresh-token',
  },
  
  // Workers
  workers: {
    profile: '/workers/profile',
    updateProfile: '/workers/profile',
    uploadDocument: '/workers/documents/upload',
    getDocuments: '/workers/documents',
    updateDocuments: '/workers/documents',
  },
  
  // Employers
  employers: {
    profile: '/employers/profile',
    updateProfile: '/employers/profile',
    uploadDocument: '/employers/documents/upload',
    getDocuments: '/employers/documents',
    updateDocuments: '/employers/documents',
  },
  
  // Jobs
  jobs: {
    list: '/jobs',
    detail: (id) => `/jobs/${id}`,
    create: '/jobs',
    update: (id) => `/jobs/${id}`,
    delete: (id) => `/jobs/${id}`,
    employerJobs: '/jobs/employer/my-jobs',
    urgentJobs: '/jobs/urgent/all',
    stats: '/jobs/stats/overview',
  },
  
  // Applications
  applications: {
    apply: '/applications',
    list: '/applications',
    detail: (id) => `/applications/${id}`,
    update: (id) => `/applications/${id}`,
    workerApplications: '/applications/worker/my-applications',
    employerApplications: '/applications/employer/job-applications',
    stats: '/applications/stats/overview',
  },
  
  // Documents
  documents: {
    upload: '/documents/upload',
    list: '/documents',
    detail: (id) => `/documents/${id}`,
    update: (id) => `/documents/${id}`,
    delete: (id) => `/documents/${id}`,
  },
  
  // Admin
  admin: {
    users: '/admin/users',
    workers: '/admin/workers',
    employers: '/admin/employers',
    jobs: '/admin/jobs',
    applications: '/admin/applications',
    documents: '/admin/documents',
    stats: '/admin/stats/overview',
  },
  
  // Upload
  upload: {
    presignedUrl: '/upload/presigned-url',
    uploadFile: '/upload/file',
  },
};

// Helper functions
export const apiHelpers = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      return { message, status: error.response.status };
    } else if (error.request) {
      // Request made but no response
      return { message: 'No response from server. Please check your connection.', status: 0 };
    } else {
      // Something else happened
      return { message: error.message || 'An unexpected error occurred', status: 0 };
    }
  },
  
  // Format validation errors
  formatValidationErrors: (error) => {
    if (error.response?.data?.errors) {
      return error.response.data.errors.map(err => err.msg).join(', ');
    }
    return error.response?.data?.error || 'Validation failed';
  },
  
  // Check if error is network error
  isNetworkError: (error) => {
    return !error.response && error.request;
  },
  
  // Check if error is server error
  isServerError: (error) => {
    return error.response && error.response.status >= 500;
  },
  
  // Check if error is client error
  isClientError: (error) => {
    return error.response && error.response.status >= 400 && error.response.status < 500;
  },
};

// Export default api instance
export default api;
