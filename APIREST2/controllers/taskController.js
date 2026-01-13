import pool from "../db.js";

export const getTasks = async (req, res) => {
  try {
    // ← FILTRAR POR USUARIO DEL TOKEN
    const userId = req.user.id;  // Viene del middleware de autenticación
    
    const [rows] = await pool.query(
      "SELECT * FROM task WHERE userId = ?",
      [userId]
    );
    
    // Convertir status de 0/1 a false/true
    const tasks = rows.map(task => ({
      ...task,
      status: task.status === 1
    }));
    
    console.log(`✅ Tareas obtenidas para usuario ${userId}: ${tasks.length}`);
    res.json(tasks);
  } catch (error) {
    console.error("Error en getTasks:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await pool.query(
      "SELECT * FROM task WHERE id = ? AND userId = ?", 
      [req.params.id, userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    
    const task = { ...rows[0], status: rows[0].status === 1 };
    res.json(task);
  } catch (error) {
    console.error("Error en getTask:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { name, deadline, status, userId } = req.body;
    
    // ← VALIDAR que el userId coincida con el usuario autenticado
    if (userId !== req.user.id) {
      return res.status(403).json({ 
        message: "No puedes crear tareas para otro usuario" 
      });
    }
    
    const [result] = await pool.query(
      "INSERT INTO task (name, deadline, status, userId) VALUES (?, ?, ?, ?)",
      [name, deadline || null, status ? 1 : 0, userId]
    );
    
    console.log(`✅ Tarea creada para usuario ${userId}: ${name}`);
    
    res.status(201).json({
      id: result.insertId,
      name,
      deadline: deadline || null,
      status,
      userId
    });
  } catch (error) {
    console.error("Error en createTask:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { name, deadline, status, userId } = req.body;
    
    // ← VERIFICAR que la tarea pertenece al usuario
    const [existing] = await pool.query(
      "SELECT * FROM task WHERE id = ? AND userId = ?",
      [req.params.id, req.user.id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    
    await pool.query(
      "UPDATE task SET name = ?, deadline = ?, status = ? WHERE id = ? AND userId = ?",
      [name, deadline || null, status ? 1 : 0, req.params.id, req.user.id]
    );
    
    console.log(`✅ Tarea ${req.params.id} actualizada por usuario ${req.user.id}`);
    
    res.json({ 
      message: "Tarea actualizada exitosamente",
      id: req.params.id
    });
  } catch (error) {
    console.error("Error en updateTask:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    // ← VERIFICAR que la tarea pertenece al usuario
    const [result] = await pool.query(
      "DELETE FROM task WHERE id = ? AND userId = ?", 
      [req.params.id, req.user.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    
    console.log(`✅ Tarea ${req.params.id} eliminada por usuario ${req.user.id}`);
    
    res.json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    console.error("Error en deleteTask:", error);
    res.status(500).json({ message: error.message });
  }
};