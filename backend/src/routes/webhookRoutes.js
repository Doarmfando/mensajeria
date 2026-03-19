const { Router } = require("express");
const webhookController = require("../controllers/webhookController");

const router = Router();

router.get("/", webhookController.verify);
router.post("/", webhookController.receive);

module.exports = router;
