const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const config = require("./env");

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
});

async function query(text, params) {
  return pool.query(text, params);
}

async function initialize() {
  // Crear tablas
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      phone_number VARCHAR(20) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS message_logs (
      id SERIAL PRIMARY KEY,
      phone_number VARCHAR(20) NOT NULL,
      template_name VARCHAR(100),
      status VARCHAR(20) NOT NULL DEFAULT 'accepted',
      whatsapp_message_id VARCHAR(100),
      error_details TEXT,
      sent_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_message_logs_phone ON message_logs(phone_number);
    CREATE INDEX IF NOT EXISTS idx_message_logs_wa_id ON message_logs(whatsapp_message_id);
  `);

  // Seed admin user
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD no configurado en .env");
    process.exit(1);
  }
  const existing = await pool.query("SELECT id FROM users WHERE username = $1", ["admin"]);
  if (existing.rows.length === 0) {
    const hash = await bcrypt.hash(adminPassword, 12);
    await pool.query("INSERT INTO users (username, password_hash) VALUES ($1, $2)", ["admin", hash]);
    console.log("Usuario admin creado");
  }

  console.log("Base de datos inicializada");
}

module.exports = { query, initialize, pool };
