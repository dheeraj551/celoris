import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Shared Gemini client setup
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API route for health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API route for streaming Gemini completion
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, model = "gemini-3.7-flash", systemInstruction, contextType } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured in server environment.",
        });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const defaultInstruction = `You are the Google Gemini AI Agent builder. 
You help users design, architect, and generate apps, integrations, and intelligent automated workflows.
When a user describes an idea, app, or tool:
1. Provide a concise, clear breakdown of the proposed architecture / solution.
2. Provide interactive code snippets or blueprint components where helpful.
3. Suggest 2-3 instant follow-up next steps or action items.
Format with clean, modern Markdown (with bullet points, bold highlights, formatted code blocks).
Be direct, helpful, and concise.`;

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || defaultInstruction,
          temperature: 0.7,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Failed to generate AI response" });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message || "Streaming error" })}\n\n`);
        res.end();
      }
    }
  });

  // API route for "I'm feeling lucky" random inspired app ideas
  app.get("/api/lucky-ideas", (req, res) => {
    const ideas = [
      "A real-time voice translator app for travelers that auto-detects language and speaks translated responses",
      "An automated meeting summarizer that syncs action items to Google Calendar and tasks to Google Sheets",
      "A smart Android habit tracker with animated streak rings, widgets, and local notification reminders",
      "An intelligent Gmail triage assistant that drafts replies and categorizes customer feedback",
      "A Google Drive document analyzer that indexes PDFs and answers questions with citation links",
      "A real-time collaborative canvas with interactive diagramming and AI wireframe generation",
      "A personal fitness companion app that generates dynamic workout routines and tracks progressive overload",
      "A smart budgeting and expense tracker that scans receipts from Google Drive and updates Google Sheets"
    ];
    const randomIndex = Math.floor(Math.random() * ideas.length);
    res.json({ idea: ideas[randomIndex] });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
