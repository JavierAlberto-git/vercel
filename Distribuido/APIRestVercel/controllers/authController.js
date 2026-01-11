const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// GET /api/health
exports.health = (req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
};

// POST /api/login
// Body: { username, password }
// Response: { token, user: { id, username, email } }
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const [rows] = await pool.query(
      "SELECT id, username, email, password_hash FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id, username: user.username, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};
