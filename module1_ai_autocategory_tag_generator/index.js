import express from "express";
import { analyzeProduct } from "./gemini.js";

const app = express();
app.use(express.json());
app.post("/analyze", async (req, res) => {
  const { description } = req.body;

  const result = await analyzeProduct(description);

  res.json(result);
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
