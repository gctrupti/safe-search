import axios from "axios";

export const API_BASE_URL = "https://safe-search-e9jp.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;