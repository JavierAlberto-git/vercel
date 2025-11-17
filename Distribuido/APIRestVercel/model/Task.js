// model/Task.js
import pool from "../config/db.js";

export class Task {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM tareas");
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM tareas WHERE id = ?", [id]);
    return rows[0];
  }

  static async create(task) {
    const { nombre, estatus, fecha_entrega } = task;
    const [result] = await pool.query(
      "INSERT INTO tareas (nombre, estatus, fecha_entrega) VALUES (?, ?, ?)",
      [nombre, estatus, fecha_entrega]
    );
    return { id: result.insertId, ...task };
  }

  static async update(id, task) {
    const { nombre, estatus, fecha_entrega } = task;
    await pool.query(
      "UPDATE tareas SET nombre = ?, estatus = ?, fecha_entrega = ? WHERE id = ?",
      [nombre, estatus, fecha_entrega, id]
    );
  }

  static async delete(id) {
    await pool.query("DELETE FROM tareas WHERE id = ?", [id]);
  }
}
