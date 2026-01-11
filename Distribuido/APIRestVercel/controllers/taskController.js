const pool = require("../config/db");

// Convierte fila MySQL -> TaskApi (con created_at / updated_at)
function toTaskApi(row) {
  return {
    id: row.id,
    name: row.name,
    status: Boolean(row.status),
    deadline: row.deadline, // MySQL suele devolver YYYY-MM-DD (perfecto)
    userId: row.userId,
    created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
}

// GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    // Si quieres filtrar por usuario logueado:
    const userId = req.user?.id;

    const [rows] = await pool.query(
      "SELECT id, name, status, deadline, userId, created_at, updated_at FROM tasks WHERE userId = ? ORDER BY id DESC",
      [userId]
    );

    return res.status(200).json(rows.map(toTaskApi));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/tasks/:id
exports.getTask = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id;

    const [rows] = await pool.query(
      "SELECT id, name, status, deadline, userId, created_at, updated_at FROM tasks WHERE id = ? AND userId = ? LIMIT 1",
      [id, userId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(toTaskApi(rows[0]));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/tasks  Body: TaskRequest
exports.createTask = async (req, res) => {
  try {
    const { name, status, deadline, userId } = req.body || {};

    if (typeof name !== "string" || typeof status !== "boolean" || !deadline || !userId) {
      return res.status(400).json({ message: "Invalid body" });
    }

    // Seguridad: forzar que userId sea el del token (evita que alguien cree tareas para otro)
    const tokenUserId = req.user?.id;
    if (Number(userId) !== Number(tokenUserId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [result] = await pool.query(
      "INSERT INTO tasks (name, status, deadline, userId) VALUES (?, ?, ?, ?)",
      [name, status ? 1 : 0, deadline, tokenUserId]
    );

    const insertedId = result.insertId;

    const [rows] = await pool.query(
      "SELECT id, name, status, deadline, userId, created_at, updated_at FROM tasks WHERE id = ? LIMIT 1",
      [insertedId]
    );

    return res.status(201).json(toTaskApi(rows[0]));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/tasks/:id  Body: TaskRequest  -> MessageResponse
exports.updateTask = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, status, deadline, userId } = req.body || {};
    const tokenUserId = req.user?.id;

    if (Number(userId) !== Number(tokenUserId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (typeof name !== "string" || typeof status !== "boolean" || !deadline) {
      return res.status(400).json({ message: "Invalid body" });
    }

    const [result] = await pool.query(
      "UPDATE tasks SET name = ?, status = ?, deadline = ? WHERE id = ? AND userId = ?",
      [name, status ? 1 : 0, deadline, id, tokenUserId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "Task updated" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/tas
