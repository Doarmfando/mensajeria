const db = require("../config/database");

async function saveNumber(phoneNumber) {
  // Solo guardar si no existe
  const existing = await db.query(
    "SELECT id FROM contacts WHERE phone_number = $1",
    [phoneNumber]
  );
  if (existing.rows.length > 0) return existing.rows[0];
  const result = await db.query(
    "INSERT INTO contacts (phone_number) VALUES ($1) RETURNING *",
    [phoneNumber]
  );
  return result.rows[0];
}

async function deleteNumber(phoneNumber) {
  return db.query("DELETE FROM contacts WHERE phone_number = $1", [phoneNumber]);
}

async function getAllContacts() {
  const result = await db.query(
    `SELECT c.phone_number, ml.status AS last_status, ml.template_name AS last_template, ml.sent_at AS last_sent
     FROM contacts c
     LEFT JOIN LATERAL (
       SELECT status, template_name, sent_at FROM message_logs
       WHERE phone_number = c.phone_number ORDER BY sent_at DESC LIMIT 1
     ) ml ON true
     ORDER BY c.created_at DESC`
  );
  return result.rows;
}

async function logMessage(phoneNumber, templateName, status, waMessageId, errorDetails) {
  return db.query(
    `INSERT INTO message_logs (phone_number, template_name, status, whatsapp_message_id, error_details)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [phoneNumber, templateName, status, waMessageId, errorDetails]
  );
}

async function updateStatusByWaId(waMessageId, newStatus) {
  return db.query(
    "UPDATE message_logs SET status = $1 WHERE whatsapp_message_id = $2",
    [newStatus, waMessageId]
  );
}

async function checkNumbersStatus(numbers) {
  if (!numbers || numbers.length === 0) return {};

  const result = await db.query(
    `SELECT DISTINCT ON (phone_number) phone_number, template_name, status, sent_at
     FROM message_logs
     ORDER BY phone_number, sent_at DESC`,
  );

  const statusMap = {};
  for (const row of result.rows) {
    if (numbers.includes(row.phone_number)) {
      statusMap[row.phone_number] = {
        template: row.template_name,
        status: row.status,
        lastSent: row.sent_at,
      };
    }
  }
  return statusMap;
}

async function getRecentLogs(page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  const logs = await db.query(
    "SELECT * FROM message_logs ORDER BY sent_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  const count = await db.query("SELECT COUNT(*) FROM message_logs");
  return { logs: logs.rows, total: parseInt(count.rows[0].count) };
}

async function getSavedNumbers() {
  const result = await db.query(
    `SELECT DISTINCT ON (phone_number) phone_number, template_name, status, sent_at
     FROM message_logs
     ORDER BY phone_number, sent_at DESC`
  );
  return result.rows;
}

module.exports = { logMessage, updateStatusByWaId, checkNumbersStatus, getRecentLogs, getSavedNumbers, saveNumber, deleteNumber, getAllContacts };
