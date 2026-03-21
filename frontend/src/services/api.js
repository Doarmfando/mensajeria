import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Agregar token JWT a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el servidor devuelve 401, cerrar sesion
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes("/auth/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export function login(username, password) {
  return api.post("/auth/login", { username, password });
}

// Mensajes
export function sendBulkMessages(numbers, message) {
  return api.post("/messages/send-bulk", { numbers, message });
}

export function sendBulkTemplate(numbers, templateName, languageCode = "es", templateComponents = []) {
  return api.post("/messages/send-bulk-template", { numbers, templateName, languageCode, templateComponents });
}

// Templates
export function getTemplates() {
  return api.get("/templates");
}

export function getApprovedTemplates() {
  return api.get("/templates/approved");
}

export function createTemplate(formData) {
  return api.post("/templates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteTemplate(name) {
  return api.delete(`/templates/${name}`);
}

// Logs
export function checkNumbersStatus(numbers) {
  return api.post("/logs/check-numbers", { numbers });
}

export function getRecentLogs(page = 1, limit = 50) {
  return api.get(`/logs?page=${page}&limit=${limit}`);
}

export function getContacts() {
  return api.get("/logs/contacts");
}

export function saveContact(phone_number) {
  return api.post("/logs/contacts", { phone_number });
}

export function deleteContact(phone) {
  return api.delete(`/logs/contacts/${phone}`);
}

export default api;
