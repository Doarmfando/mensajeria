const { Router } = require("express");
const messageController = require("../controllers/messageController");

const router = Router();

router.post("/send-text", messageController.sendText);
router.post("/send-image", messageController.sendImage);
router.post("/send-document", messageController.sendDocument);
router.post("/send-template", messageController.sendTemplate);
router.post("/send-buttons", messageController.sendButtons);
router.post("/send-list", messageController.sendList);
router.post("/send-location", messageController.sendLocation);
router.post("/send-bulk", messageController.sendBulk);
router.post("/send-bulk-template", messageController.sendBulkTemplate);

module.exports = router;
