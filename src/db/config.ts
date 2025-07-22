import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

console.log("API URL:", apiUrl); // Debug log

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default api;
