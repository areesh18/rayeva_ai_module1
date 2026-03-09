import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeProduct = async (productDescription) => {
  const prompt = `
    Analyze this product: "${productDescription}"
    Return a JSON object with these keys: 
    primary_category, sub_category, seo_tags, sustainability_filters.
  `;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};