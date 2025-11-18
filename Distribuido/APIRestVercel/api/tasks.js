// api/tasks.js → handler para Vercel

import express from "express";
import dotenv from "dotenv";
import taskRoutes from "../routes/tasks.js";

dotenv.config();

const app = express();
app.use(express.json());

// IMPORTANTE: sin prefijo "/api/tasks" aquí
// Porque Vercel ya monta este handler en "/api/tasks"
app.use(taskRoutes);

// Express app es una función (req, res), la exportamos tal cual
export default app;
