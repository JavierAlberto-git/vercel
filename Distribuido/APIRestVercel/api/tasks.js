// api/tasks.js → handler para Vercel

import express from "express";
import dotenv from "dotenv";
import taskRoutes from "../routes/tasks.js";

dotenv.config();

const app = express();
app.use(express.json());

// Montamos el router directamente en la raíz del handler
// Vercel ya monta este archivo en /api/tasks
app.use("/", taskRoutes);

// Exportamos la app de Express como handler
export default app;
