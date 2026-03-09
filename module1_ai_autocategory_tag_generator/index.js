import express from "express";
import { analyzeProduct } from "./gemini.js";
import { saveToCatalog } from "./database.js";
const app = express();
app.use(express.json());
app.post("/analyze", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "Product 'description' is required." });
    }
    const aiResult = await analyzeProduct(description.trim());
    //now  saving the full record including the original input, not just AI output
    const productRecord = {
      id: Date.now(),
      name: name?.trim() || "Unnamed Product",
      description: description.trim(),
      ...aiResult,
      created_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };
    saveToCatalog(productRecord);
    res.json(productRecord);
  } catch (error) {
    console.error("Error in /analyze:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//adding a health check endpoint (just to make sure server is up)
app.get("/", (req, res) => {
  res.json({ status: "ok", module: "AI Auto-Category & Tag Generator" });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
