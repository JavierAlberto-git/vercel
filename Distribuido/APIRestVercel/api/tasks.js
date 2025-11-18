// api/tasks.js — handler de Vercel

import dotenv from "dotenv";
import express from "express";
import { Task } from "../model/Task.js";

dotenv.config();

const app = express();
app.use(express.json());

// GET /api/tasks  -> todas las tareas
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.getAll();
    res.json(tasks);
  } catch (err) {
    console.error("Error en GET /api/tasks", err);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
});

// POST /api/tasks  -> crear tarea
app.post("/api/tasks", async (req, res) => {
  try {
    const nueva = await Task.create(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    console.error("Error en POST /api/tasks", err);
    res.status(500).json({ message: "Error al crear tarea" });
  }
});

// PUT /api/tasks  -> actualizar tarea (recibe id en el body)
app.put("/api/tasks", async (req, res) => {
  try {
    const { id, ...data } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Falta el id en el cuerpo" });
    }

    await Task.update(id, data);
    res.json({ message: "Tarea actualizada" });
  } catch (err) {
    console.error("Error en PUT /api/tasks", err);
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
});

// DELETE /api/tasks  -> borrar tarea (recibe id en el body)
app.delete("/api/tasks", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Falta el id en el cuerpo" });
    }

    await Task.delete(id);
    res.json({ message: "Tarea eliminada" });
  } catch (err) {
    console.error("Error en DELETE /api/tasks", err);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
});

// Exportar app para Vercel
export default (req, res) => app(req, res);
