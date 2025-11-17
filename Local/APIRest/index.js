import dotenv from "dotenv";
import express from "express";
import taskRoutes from "./routes/tasks.js";

dotenv.config();
const app = express();

app.use(express.json());

// Rutas
app.use("/api/tasks", taskRoutes);

// Ruta de prueba
app.get("/", (req, res) => res.send("API Tasks funcionando ✅"));

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
