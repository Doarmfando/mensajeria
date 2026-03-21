const express = require("express");
const router = express.Router();
const messageLogService = require("../services/messageLogService");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const data = await messageLogService.getRecentLogs(page, limit);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/contacts", async (req, res) => {
  try {
    const contacts = await messageLogService.getAllContacts();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/contacts", async (req, res) => {
  try {
    let { phone_number } = req.body;
    if (!phone_number) return res.status(400).json({ error: "phone_number es obligatorio" });
    // Agregar 51 si solo tiene 9 digitos
    if (/^\d{9}$/.test(phone_number)) phone_number = "51" + phone_number;
    const contact = await messageLogService.saveNumber(phone_number);
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/contacts/:phone", async (req, res) => {
  try {
    await messageLogService.deleteNumber(req.params.phone);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/check-numbers", async (req, res) => {
  try {
    const { numbers } = req.body;
    const statusMap = await messageLogService.checkNumbersStatus(numbers || []);
    res.json({ success: true, data: statusMap });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
