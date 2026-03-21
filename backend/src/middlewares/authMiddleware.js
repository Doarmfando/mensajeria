const jwt = require("jsonwebtoken");
const config = require("../config/env");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret, { algorithms: ["HS256"] });
    if (!decoded.id || !decoded.username) {
      return res.status(401).json({ error: "Token invalido" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalido o expirado" });
  }
}

module.exports = { verifyToken };
