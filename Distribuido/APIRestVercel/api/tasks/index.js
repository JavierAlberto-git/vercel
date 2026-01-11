import pool from "../../config/db.js";
import jwt from "jsonwebtoken";

function requireUser(req, res) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401).json({ message: "Invalid token" });
    return null;
  }
}

function toTaskApi(row) {
  return {
    id: row.id,
    name: row.name,
    status: Boolean(row.status),
    deadline: row.deadline, // YYYY-MM-DD ok
    userId: row.userId,
    created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
}

export default async function handler(req, res) {
  const user = requireUser(req, res);
  if (!user) return;

  if (req.method === "GET") {
    const [rows] = await pool.query(
      "SELECT id, name, status, deadline, userId, created_at, updated_at FROM tasks WHERE userId = ? ORDER BY id DESC",
      [user.id]
    );
    return res.status(200).json(rows.map(toTaskApi));
  }

  if (req.method === "POST") {
    const { name, status, deadline, userId } = req.body || {};

    if (typeof name !== "string" || typeof status !== "boolean" || !deadline || !userId) {
      return res.status(400).json({ message: "Invalid body" });
    }

    // fuerza userId al del token (seguridad)
    if (Number(userId) !== Number(user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [result] = await pool.query(
      "INSERT INTO tasks (name, status, deadline, userId) VALUES (?, ?, ?, ?)",
      [name, status ? 1 : 0, deadline, user.id]
    );

    const [rows] = await pool.query(
      "SELECT id, name, status, deadline, userId, created_at, updated_at FROM tasks WHERE id = ? LIMIT 1",
      [result.insertId]
    );

    return res.status(201).json(toTaskApi(rows[0]));
  }

  return res.status(405).json({ message: "Method not allowed" });
}
