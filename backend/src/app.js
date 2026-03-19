const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config/env");

const messageRoutes = require("./routes/messageRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const templateRoutes = require("./routes/templateRoutes");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/messages", messageRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/templates", templateRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.port}`);
  console.log(`Webhook URL: http://localhost:${config.port}/api/webhook`);
});

module.exports = app;
