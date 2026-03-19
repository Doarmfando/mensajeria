const axios = require("axios");
const config = require("../config/env");

const api = axios.create({
  baseURL: `${config.whatsapp.apiUrl}/${config.whatsapp.phoneNumberId}`,
  headers: {
    Authorization: `Bearer ${config.whatsapp.accessToken}`,
    "Content-Type": "application/json",
  },
});

/**
 * Enviar mensaje de texto simple
 */
async function sendTextMessage(to, message) {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { preview_url: false, body: message },
  };

  const response = await api.post("/messages", payload);
  return response.data;
}

/**
 * Enviar mensaje con imagen
 */
async function sendImageMessage(to, imageUrl, caption = "") {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "image",
    image: { link: imageUrl, caption },
  };

  const response = await api.post("/messages", payload);
  return response.data;
}

/**
 * Enviar mensaje con documento (PDF, etc.)
 */
async function sendDocumentMessage(to, documentUrl, filename, caption = "") {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "document",
    document: { link: documentUrl, caption, filename },
  };

  const response = await api.post("/messages", payload);
  return response.data;
}

/**
 * Enviar mensaje con template predefinido
 */
async function sendTemplateMessage(to, templateName, languageCode = "es", components = []) {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  };

  console.log("Payload enviado:", JSON.stringify(payload, null, 2));
  const response = await api.post("/messages", payload);
  console.log("Respuesta de Meta:", JSON.stringify(response.data));
  return response.data;
}

/**
 * Enviar mensaje interactivo con botones
 */
async function sendButtonMessage(to, bodyText, buttons) {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: buttons.map((btn, index) => ({
          type: "reply",
          reply: { id: `btn_${index}`, title: btn },
        })),
      },
    },
  };

  const response = await api.post("/messages", payload);
  return response.data;
}

/**
 * Enviar mensaje interactivo con lista de opciones
 */
async function sendListMessage(to, bodyText, buttonText, sections) {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: bodyText },
      action: { button: buttonText, sections },
    },
  };

  const response = await api.post("/messages", payload);
  return response.data;
}

/**
 * Enviar ubicacion
 */
async function sendLocationMessage(to, latitude, longitude, name = "", address = "") {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "location",
    location: { latitude, longitude, name, address },
  };

  const response = await api.post("/messages", payload);
  return response.data;
}

/**
 * Envio masivo de texto a multiples numeros
 * Incluye delay entre mensajes para no exceder limites de la API
 */
async function sendBulkTextMessage(numbers, message) {
  const results = [];

  for (const number of numbers) {
    try {
      const data = await sendTextMessage(number, message);
      results.push({ number, status: "sent", data });
    } catch (error) {
      results.push({ number, status: "failed", error: error.response?.data || error.message });
    }
    // Delay de 1 segundo entre mensajes para evitar rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * Envio masivo de template a multiples numeros
 */
async function sendBulkTemplateMessage(numbers, templateName, languageCode = "es", components = []) {
  const results = [];

  for (const number of numbers) {
    try {
      console.log(`Enviando template "${templateName}" (${languageCode}) a ${number}`);
      const data = await sendTemplateMessage(number, templateName, languageCode, components);
      results.push({ number, status: "sent", data });
    } catch (error) {
      console.error(`Error enviando a ${number}:`, JSON.stringify(error.response?.data || error.message));
      results.push({ number, status: "failed", error: error.response?.data || error.message });
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * Subir imagen a Media API de Meta y obtener media_id permanente
 */
async function uploadImageToMedia(imageBuffer, mimeType) {
  const FormData = require("form-data");
  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("file", imageBuffer, {
    filename: "header.jpg",
    contentType: mimeType,
  });
  form.append("type", mimeType);

  const response = await axios.post(
    `${config.whatsapp.apiUrl}/${config.whatsapp.phoneNumberId}/media`,
    form,
    {
      headers: {
        Authorization: `Bearer ${config.whatsapp.accessToken}`,
        ...form.getHeaders(),
      },
    }
  );

  return response.data.id;
}

/**
 * Descargar imagen desde URL y subirla a Media API
 */
async function downloadAndUploadImage(imageUrl) {
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${config.whatsapp.accessToken}`,
    },
  });

  const mimeType = response.headers["content-type"] || "image/jpeg";
  const buffer = Buffer.from(response.data);
  return uploadImageToMedia(buffer, mimeType);
}

/**
 * Marcar mensaje como leido
 */
async function markAsRead(messageId) {
  const payload = {
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageId,
  };

  const response = await api.post("/messages", payload);
  return response.data;
}

module.exports = {
  sendTextMessage,
  sendImageMessage,
  sendDocumentMessage,
  sendTemplateMessage,
  sendButtonMessage,
  sendListMessage,
  sendLocationMessage,
  sendBulkTextMessage,
  sendBulkTemplateMessage,
  markAsRead,
  downloadAndUploadImage,
};
