import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Путь к статике Vite-билда
const staticPath = path.join(__dirname, "..", "dist");
app.use(express.static(staticPath));

// Fallback для SPA
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
