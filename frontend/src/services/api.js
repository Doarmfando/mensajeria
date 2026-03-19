import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export function sendBulkMessages(numbers, message) {
  return api.post("/messages/send-bulk", { numbers, message });
}

export function sendBulkTemplate(numbers, templateName, languageCode = "es", templateComponents = []) {
  return api.post("/messages/send-bulk-template", { numbers, templateName, languageCode, templateComponents });
}

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

export default api;
