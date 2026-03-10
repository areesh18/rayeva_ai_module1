import express from "express";
import { analyzeProduct } from "./gemini.js";
import { saveToCatalog } from "./database.js";
import { logInteraction } from "./logger.js";
import cors from "cors";
const app = express();
app.use(cors({origin: process.env.FRONTEND_URL || "http://localhost:5173"}));
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
    const id = Date.now();
    const { result: aiResult, prompt } = await analyzeProduct(
      description.trim(),
    );
    //now  saving the full record including the original input, not just AI output
    const productRecord = {
      id,
      name: name?.trim() || "Unnamed Product",
      description: description.trim(),
      ...aiResult,
      created_at: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    };
    await saveToCatalog(productRecord);
    await logInteraction(prompt, aiResult, id);
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
