import express from "express";
import path from "path";

const app = express();
const port = process.env.PORT || 8080;

// Serve the built frontend (we'll build into "build" folder)
const staticPath = path.join(__dirname, "build");
app.use(express.static(staticPath));

// Fallback to index.html for SPA routing
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
