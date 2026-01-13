import "dotenv/config";
import app from "./api/index.js";

const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ API corriendo en http://localhost:${PORT}`);
});
