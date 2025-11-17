-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gestor_tareas;
USE gestor_tareas;

-- Crear tabla de tareas
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    estatus BOOLEAN NOT NULL DEFAULT 0,  -- 0 = no hecha, 1 = hecha
    fecha_entrega DATE NOT NULL
);







