import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
const base = rawBase.replace(/\/+$/u, "");

const API = axios.create({
  baseURL: `${base}/api`,
});

export default API;