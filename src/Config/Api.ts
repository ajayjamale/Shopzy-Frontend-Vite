import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || "").trim();
export const ADMIN_API_PREFIX =
  import.meta.env.DEV && !API_URL ? "/api/_admin" : "/admin";

export const adminApiPath = (path = "") => {
  if (!path) return ADMIN_API_PREFIX;
  return `${ADMIN_API_PREFIX}${path.startsWith("/") ? path : `/${path}`}`;
};


export const api = axios.create({
  baseURL: API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});
