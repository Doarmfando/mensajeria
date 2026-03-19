const config = require("../config/env");
const whatsappService = require("../services/whatsappService");

/**
 * GET /api/webhook
 * Verificacion del webhook por Meta (challenge)
 */
function verify(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.webhook.verifyToken) {
    console.log("Webhook verificado correctamente");
    return res.status(200).send(challenge);
  }

  console.warn("Verificacion de webhook fallida");
  res.sendStatus(403);
}

/**
 * POST /api/webhook
 * Recibir notificaciones de mensajes entrantes
 */
async function receive(req, res) {
  try {
    const body = req.body;

    if (body.object !== "whatsapp_business_account") {
      return res.sendStatus(404);
    }

    const entries = body.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        if (change.field !== "messages") continue;

        const value = change.value;
        const messages = value.messages || [];
        const contacts = value.contacts || [];

        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          const contact = contacts[i] || {};

          const messageData = {
            messageId: message.id,
            from: message.from,
            contactName: contact.profile?.name || "Desconocido",
            timestamp: message.timestamp,
            type: message.type,
          };

          // Extraer contenido segun el tipo de mensaje
          switch (message.type) {
            case "text":
              messageData.content = message.text.body;
              break;
            case "image":
              messageData.content = { caption: message.image.caption, mediaId: message.image.id };
              break;
            case "document":
              messageData.content = { filename: message.document.filename, mediaId: message.document.id };
              break;
            case "audio":
              messageData.content = { mediaId: message.audio.id };
              break;
            case "video":
              messageData.content = { caption: message.video.caption, mediaId: message.video.id };
              break;
            case "location":
              messageData.content = { latitude: message.location.latitude, longitude: message.location.longitude };
              break;
            case "interactive":
              if (message.interactive.type === "button_reply") {
                messageData.content = message.interactive.button_reply;
              } else if (message.interactive.type === "list_reply") {
                messageData.content = message.interactive.list_reply;
              }
              break;
            default:
              messageData.content = message;
          }

          console.log("Mensaje recibido:", JSON.stringify(messageData, null, 2));

          // Marcar como leido
          await whatsappService.markAsRead(message.id);

          // Aqui puedes agregar logica personalizada:
          // - Guardar en base de datos
          // - Responder automaticamente
          // - Emitir evento via WebSocket al frontend
        }
      }
    }

    // Siempre responder 200 a Meta
    res.sendStatus(200);
  } catch (error) {
    console.error("Error procesando webhook:", error.message);
    res.sendStatus(200);
  }
}

module.exports = { verify, receive };
