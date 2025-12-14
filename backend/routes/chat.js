import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Validate API key presence for Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment");
      return res.status(500).json({ reply: "Server misconfigured: missing GEMINI_API_KEY. Add it to .env and restart the server." });
    }

    // Initialize Gemini client
    const ai = new GoogleGenAI({ apiKey });

    // System prompt: makes AI behave like a motor rental assistant
    const systemPrompt = `
      You are OntheGo, a friendly and helpful motor rental assistant.
      You answer questions about motorcycles, rental costs, booking steps, and rental rules.
      - Recommend the best motor based on user needs (city, long trips, style).
      - Calculate total rental costs.
      - Explain rules in a clear, polite, and friendly way.
      - Never give answers unrelated to motor rentals.
      - Be concise but professional.
    `;

    // Combine system prompt with user message
    const contents = `${systemPrompt}\n\nUser: ${userMessage}`;

    // Generate content
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    const aiText = response.text;

    res.json({ reply: aiText });

  } catch (error) {
    console.error("Gemini API error:", error?.message || error);
    const userMessage = (error && error.message && error.message.includes("API_KEY_INVALID"))
      ? "AI API error: API key invalid. Check your GEMINI_API_KEY and that the Generative Language API is enabled in Google Cloud."
      : "AI failed to respond";
    res.status(500).json({ reply: userMessage });
  }
});

export default router;