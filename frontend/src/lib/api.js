import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
export const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function formatApiError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e?.msg ?? JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail?.msg) return detail.msg;
  return String(detail);
}

export function fileUrl(fileId) {
  if (!fileId) return "";
  if (fileId.startsWith("http") || fileId.startsWith("/api/"))
    return `${BACKEND_URL}${fileId.startsWith("/") ? "" : "/"}${fileId}`;
  return `${API}/files/${fileId}`;
}

export default api;
