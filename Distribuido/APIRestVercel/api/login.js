import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "Missing credentials" });

  const [rows] = await pool.query(
    "SELECT id, username, email, password_hash FROM users WHERE username = ? LIMIT 1",
    [username]
  );

  if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
}
