// api/tasks.js  → handler para Vercel

import express from "express";
import dotenv from "dotenv";
import taskRoutes from "../routes/tasks.js";
import pool from "../config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

// Usamos el mismo router de siempre, pero SIN prefijo "/api/tasks"
app.use(taskRoutes);

// Ruta de prueba opcional: GET /api/tasks/ping
app.get("/ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "DB error" });
  }
});

// En Vercel NO usamos app.listen, solo exportamos un handler
export default function handler(req, res) {
  return app(req, res);
}
