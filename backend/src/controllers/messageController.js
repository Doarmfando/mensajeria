const whatsappService = require("../services/whatsappService");
const messageLogService = require("../services/messageLogService");

/**
 * POST /api/messages/send-text
 * Enviar mensaje de texto
 */
async function sendText(req, res) {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "Los campos 'to' y 'message' son obligatorios" });
    }

    const result = await whatsappService.sendTextMessage(to, message);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error enviando texto:", error.message);
    res.status(500).json({ success: false, error: "Error al enviar mensaje de texto" });
  }
}

/**
 * POST /api/messages/send-image
 * Enviar mensaje con imagen
 */
async function sendImage(req, res) {
  try {
    const { to, imageUrl, caption } = req.body;

    if (!to || !imageUrl) {
      return res.status(400).json({ error: "Los campos 'to' e 'imageUrl' son obligatorios" });
    }

    const result = await whatsappService.sendImageMessage(to, imageUrl, caption);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error enviando imagen:", error.message);
    res.status(500).json({ success: false, error: "Error al enviar imagen" });
  }
}

/**
 * POST /api/messages/send-document
 * Enviar mensaje con documento
 */
async function sendDocument(req, res) {
  try {
    const { to, documentUrl, filename, caption } = req.body;

    if (!to || !documentUrl || !filename) {
      return res.status(400).json({ error: "Los campos 'to', 'documentUrl' y 'filename' son obligatorios" });
    }

    const result = await whatsappService.sendDocumentMessage(to, documentUrl, filename, caption);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error enviando documento:", error.message);
    res.status(500).json({ success: false, error: "Error al enviar documento" });
  }
}

/**
 * POST /api/messages/send-template
 * Enviar mensaje con template
 */
async function sendTemplate(req, res) {
  try {
    const { to, templateName, languageCode, components } = req.body;

    if (!to || !templateName) {
      return res.status(400).json({ error: "Los campos 'to' y 'templateName' son obligatorios" });
    }

    const result = await whatsappService.sendTemplateMessage(to, templateName, languageCode, components);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error enviando template:", error.message);
    res.status(500).json({ success: false, error: "Error al enviar template" });
  }
}

/**
 * POST /api/messages/send-buttons
 * Enviar mensaje interactivo con botones
 */
async function sendButtons(req, res) {
  try {
    const { to, bodyText, buttons } = req.body;

    if (!to || !bodyText || !buttons || !Array.isArray(buttons)) {
      return res.status(400).json({ error: "Los campos 'to', 'bodyText' y 'buttons' (array) son obligatorios" });
    }

    const result = await whatsappService.sendButtonMessage(to, bodyText, buttons);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error enviando botones:", error.message);
    res.status(500).json({ success: false, error: "Error al enviar botones" });
  }
}

/**
 * POST /api/messages/send-list
 * Enviar mensaje interactivo con lista
 */
async function sendList(req, res) {
  try {
    const { to, bodyText, buttonText, sections } = req.body;

    if (!to || !bodyText || !buttonText || !sections) {
      return res.status(400).json({ error: "Los campos 'to', 'bodyText', 'buttonText' y 'sections' son obligatorios" });
    }

    const result = await whatsappService.sendListMessage(to, bodyText, buttonText, sections);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error enviando lista:", error.message);
    res.status(500).json({ success: false, error: "Error al enviar lista" });
  }
}

/**
 * POST /api/messages/send-location
 * Enviar ubicacion
 */
async function sendLocation(req, res) {
  try {
    const { to, latitude, longitude, name, address } = req.body;

    if (!to || latitude == null || longitude == null) {
      return res.status(400).json({ error: "Los campos 'to', 'latitude' y 'longitude' son obligatorios" });
    }

    const result = await whatsappService.sendLocationMessage(to, latitude, longitude, name, address);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error enviando ubicacion:", error.message);
    res.status(500).json({ success: false, error: "Error al enviar ubicacion" });
  }
}

/**
 * POST /api/messages/send-bulk
 * Envio masivo: un mismo mensaje a multiples numeros
 */
async function sendBulk(req, res) {
  try {
    const { numbers, message } = req.body;

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({ error: "'numbers' debe ser un array con al menos un numero" });
    }

    if (!message) {
      return res.status(400).json({ error: "El campo 'message' es obligatorio" });
    }

    const results = await whatsappService.sendBulkTextMessage(numbers, message);

    const sent = results.filter((r) => r.status === "sent").length;
    const failed = results.filter((r) => r.status === "failed").length;

    res.json({
      success: true,
      summary: { total: numbers.length, sent, failed },
      details: results,
    });
  } catch (error) {
    console.error("Error en envio masivo:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * POST /api/messages/send-bulk-template
 * Envio masivo de template a multiples numeros
 */
async function sendBulkTemplate(req, res) {
  try {
    const { numbers, templateName, languageCode, templateComponents } = req.body;

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({ error: "'numbers' debe ser un array con al menos un numero" });
    }

    if (!templateName) {
      return res.status(400).json({ error: "El campo 'templateName' es obligatorio" });
    }

    // Detectar si el template tiene imagen en header usando los components enviados desde frontend
    let components = [];
    const srcComponents = templateComponents || [];
    const headerComp = srcComponents.find((c) => c.type === "HEADER" && c.format === "IMAGE");

    if (headerComp) {
      let imageUrl = "";
      if (headerComp.example && headerComp.example.header_url && headerComp.example.header_url[0]) {
        imageUrl = headerComp.example.header_url[0];
      } else if (headerComp.example && headerComp.example.header_handle && headerComp.example.header_handle[0]) {
        imageUrl = headerComp.example.header_handle[0];
      }
      console.log("Template con imagen, URL original:", imageUrl);
      if (imageUrl) {
        try {
          // Descargar imagen y subirla a Media API para obtener un media_id estable
          const mediaId = await whatsappService.downloadAndUploadImage(imageUrl);
          console.log("Imagen subida a Media API, media_id:", mediaId);
          components.push({
            type: "header",
            parameters: [{ type: "image", image: { id: mediaId } }],
          });
        } catch (uploadError) {
          console.error("Error subiendo imagen a Media API, usando link directo:", uploadError.message);
          // Fallback: usar el link directo
          components.push({
            type: "header",
            parameters: [{ type: "image", image: { link: imageUrl } }],
          });
        }
      }
    }

    const results = await whatsappService.sendBulkTemplateMessage(numbers, templateName, languageCode, components);

    // Registrar cada envio en la base de datos
    for (const r of results) {
      await messageLogService.logMessage(
        r.number,
        templateName,
        r.status === "sent" ? "accepted" : "failed",
        r.data?.messages?.[0]?.id || null,
        r.status === "failed" ? JSON.stringify(r.error) : null
      );
    }

    const sent = results.filter((r) => r.status === "sent").length;
    const failed = results.filter((r) => r.status === "failed").length;

    res.json({
      success: true,
      summary: { total: numbers.length, sent, failed },
      details: results,
    });
  } catch (error) {
    console.error("Error en envio masivo de template:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  sendText,
  sendImage,
  sendDocument,
  sendTemplate,
  sendButtons,
  sendList,
  sendLocation,
  sendBulk,
  sendBulkTemplate,
};
