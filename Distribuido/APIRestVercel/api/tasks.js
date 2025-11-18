// api/tasks.js → handler para Vercel

import dotenv from "dotenv";
import express from "express";
import taskRoutes from "../routes/tasks.js";

dotenv.config();
const app = express();

app.use(express.json());

// 👇 IGUAL que en index.js
app.use("/api/tasks", taskRoutes);

// 👇 SIN app.listen, solo exportamos la app
export default app;
