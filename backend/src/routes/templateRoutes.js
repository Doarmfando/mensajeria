const { Router } = require("express");
const multer = require("multer");
const templateController = require("../controllers/templateController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imagenes JPG o PNG"));
    }
  },
});

const router = Router();

router.get("/", templateController.getAll);
router.get("/approved", templateController.getApproved);
router.post("/", upload.single("image"), templateController.create);
router.delete("/:name", templateController.remove);

module.exports = router;
