const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const config = require("./config/env");
const database = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const templateRoutes = require("./routes/templateRoutes");
const logRoutes = require("./routes/logRoutes");
const { verifyToken } = require("./middlewares/authMiddleware");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos de login, intenta en 15 minutos" },
});

// Rutas publicas
app.use("/api/auth", loginLimiter, authRoutes);
app.use("/api/webhook", webhookRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Middleware de autenticacion (todo lo de abajo requiere JWT)
app.use("/api", verifyToken);

// Rutas protegidas
app.use("/api/messages", messageRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/logs", logRoutes);

// Iniciar servidor
async function start() {
  await database.initialize();
  app.listen(config.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.port}`);
    console.log(`Webhook URL: http://localhost:${config.port}/api/webhook`);
  });
}

start().catch((err) => {
  console.error("Error iniciando servidor:", err.message);
  process.exit(1);
});

module.exports = app;
