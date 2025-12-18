import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Serve the built frontend from "dist" folder (Vite default)
const staticPath = path.join(__dirname, "dist");
app.use(express.static(staticPath));

// Fallback to index.html for SPA routing
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});