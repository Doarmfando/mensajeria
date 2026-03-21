const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const config = require("../config/env");

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }

    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn, algorithm: "HS256" }
    );

    res.json({ success: true, token, username: user.username });
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = { login };
