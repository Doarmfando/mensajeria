require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  },
  webhook: {
    verifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "mensajeria",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "default_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
};
