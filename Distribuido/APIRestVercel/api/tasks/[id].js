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
    deadline: row.deadline,
    userId: row.userId,
    created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
}

export default async function handler(req, res) {
  const user = requireUser(req, res);
  if (!user) return;

  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ message: "Invalid id" });

  if (req.method === "GET") {
    const [rows] = await pool.query(
      "SELECT id, name, status, deadline, userId, created_at, updated_at FROM tasks WHERE id = ? AND userId = ? LIMIT 1",
      [id, user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(toTaskApi(rows[0]));
  }

  if (req.method === "PUT") {
    const { name, status, deadline, userId } = req.body || {};

    if (Number(userId) !== Number(user.id)) return res.status(403).json({ message: "Forbidden" });
    if (typeof name !== "string" || typeof status !== "boolean" || !deadline) {
      return res.status(400).json({ message: "Invalid body" });
    }

    const [result] = await pool.query(
      "UPDATE tasks SET name = ?, status = ?, deadline = ? WHERE id = ? AND userId = ?",
      [name, status ? 1 : 0, deadline, id, user.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Task updated" });
  }

  if (req.method === "DELETE") {
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ? AND userId = ?",
      [id, user.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Task deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
