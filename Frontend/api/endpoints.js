export const ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    SIGNIN: '/api/auth/signin',
    GOOGLE: '/api/auth/google',
    ME: '/api/auth/me',
    PUSH_TOKEN: '/api/auth/push-token',
  },
  ASSIGNMENTS: {
    BASE: '/api/assignments',
    BY_COHORT: (cohort) => `/api/assignments/by-cohort/${cohort}`,
    COURSERA: (cohort) => `/api/coursera/assignments?cohort=${cohort}`,
    BY_ID: (id) => `/api/assignments/${id}`,
  },
  SUBJECTS: {
    BASE: '/api/subjects',
    BY_ID: (id) => `/api/subjects/${id}`,
    USER: (userId) => `/api/subjects/user/${userId}`,
  },
  ADMIN: {
    STATS: '/api/admin/stats',
    USERS: '/api/admin/Users',
  },
  NOTES: {
    UPLOAD: '/api/notes/upload',
    BY_ID: (id) => `/api/notes/${id}`,
  },
};
