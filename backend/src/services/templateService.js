const axios = require("axios");
const config = require("../config/env");

const api = axios.create({
  baseURL: `${config.whatsapp.apiUrl}/${config.whatsapp.businessAccountId}`,
  headers: {
    Authorization: `Bearer ${config.whatsapp.accessToken}`,
    "Content-Type": "application/json",
  },
});

/**
 * Obtener todos los templates
 */
async function getTemplates() {
  const response = await api.get("/message_templates", {
    params: { limit: 100 },
  });
  return response.data.data;
}

/**
 * Obtener un template por nombre
 */
async function getTemplateByName(name) {
  const response = await api.get("/message_templates", {
    params: { name },
  });
  return response.data.data[0] || null;
}

/**
 * Crear un template nuevo (solo texto)
 */
async function createTemplate(name, language, category, bodyText) {
  const payload = {
    name,
    language,
    category,
    components: [
      {
        type: "BODY",
        text: bodyText,
      },
    ],
  };

  const response = await api.post("/message_templates", payload);
  return response.data;
}

/**
 * Subir imagen (buffer) a Meta via resumable upload
 * Retorna el handle para usar en el template
 */
async function uploadImageBuffer(fileBuffer, mimeType) {
  const fileLength = fileBuffer.length;

  // 1. Crear sesion de subida resumible
  const sessionResponse = await axios.post(
    `${config.whatsapp.apiUrl}/app/uploads`,
    null,
    {
      params: {
        file_length: fileLength,
        file_type: mimeType,
        access_token: config.whatsapp.accessToken,
      },
      headers: {
        Authorization: `Bearer ${config.whatsapp.accessToken}`,
      },
    }
  );

  const uploadSessionId = sessionResponse.data.id;

  // 2. Subir el archivo
  const uploadResponse = await axios.post(
    `${config.whatsapp.apiUrl}/${uploadSessionId}`,
    fileBuffer,
    {
      headers: {
        Authorization: `OAuth ${config.whatsapp.accessToken}`,
        "Content-Type": mimeType,
        file_offset: "0",
      },
    }
  );

  return uploadResponse.data.h;
}

/**
 * Crear template con header (texto o imagen) y footer
 */
async function createFullTemplate(name, language, category, { headerType, imageBuffer, imageMimeType, headerContent, bodyText, footerText }) {
  const components = [];

  if (headerType === "IMAGE" && imageBuffer) {
    const handle = await uploadImageBuffer(imageBuffer, imageMimeType);
    components.push({
      type: "HEADER",
      format: "IMAGE",
      example: { header_handle: [handle] },
    });
  } else if (headerType === "TEXT" && headerContent) {
    components.push({ type: "HEADER", format: "TEXT", text: headerContent });
  }

  components.push({ type: "BODY", text: bodyText });

  if (footerText) {
    components.push({ type: "FOOTER", text: footerText });
  }

  const payload = {
    name,
    language,
    category,
    components,
  };

  const response = await api.post("/message_templates", payload);
  return response.data;
}

/**
 * Eliminar un template por nombre
 */
async function deleteTemplate(name) {
  const response = await api.delete("/message_templates", {
    params: { name },
  });
  return response.data;
}

module.exports = {
  getTemplates,
  getTemplateByName,
  createTemplate,
  createFullTemplate,
  uploadImageBuffer,
  deleteTemplate,
};
