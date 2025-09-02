// Backend API configuration for Vite
export const API = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? "/api" : "http://localhost:8000/api");