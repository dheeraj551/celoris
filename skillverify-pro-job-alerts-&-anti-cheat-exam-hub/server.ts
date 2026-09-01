import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy Gemini AI initialization
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI {
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || "",
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Exam Generator
  app.post("/api/exam/generate", async (req, res) => {
    try {
      const { skillName, industry, difficulty = "Intermediate" } = req.body;
      const ai = getAI();

      const prompt = `Generate a rigorous, anti-cheat certification exam for the skill: "${skillName}" in the "${industry}" industry at "${difficulty}" difficulty level.
Include 4 challenging multiple choice questions (with 4 distinct options, exactly 1 correct answer index 0-3, and in-depth explanation) and 1 practical coding/architectural scenario question with evaluation criteria.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              timeLimitMinutes: { type: Type.INTEGER },
              passingScorePercent: { type: Type.INTEGER },
              xpReward: { type: Type.INTEGER },
              badgeTitle: { type: Type.STRING },
              badgeColor: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING, description: "mcq or scenario" },
                    question: { type: Type.STRING },
                    codeSnippet: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                  },
                  required: ["id", "type", "question", "options", "correctAnswerIndex", "explanation"],
                },
              },
            },
            required: ["title", "description", "timeLimitMinutes", "passingScorePercent", "xpReward", "badgeTitle", "questions"],
          },
        },
      });

      const examData = JSON.parse(response.text || "{}");
      res.json({ success: true, exam: examData });
    } catch (error: any) {
      console.error("Exam generation error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate exam with AI",
      });
    }
  });

  // AI Exam Answer Evaluation for open-ended / scenario questions
  app.post("/api/exam/evaluate", async (req, res) => {
    try {
      const { question, userAnswer, expectedTopic, skillName } = req.body;
      const ai = getAI();

      const prompt = `You are a strict anti-cheat certification exam proctor and senior technical examiner.
Evaluate this candidate's response for the skill "${skillName}".
Exam Question: "${question}"
Candidate's Response: "${userAnswer}"
Expected Subject Mastery: "${expectedTopic || skillName}"

Evaluate technical depth, correctness, anti-cheat realism (whether it looks authentic or hallucinated), and assign a score out of 100 with actionable feedback.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              passed: { type: Type.BOOLEAN },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              proctorNote: { type: Type.STRING },
              verifiedFeedback: { type: Type.STRING },
            },
            required: ["score", "passed", "strengths", "improvements", "proctorNote", "verifiedFeedback"],
          },
        },
      });

      const evaluation = JSON.parse(response.text || "{}");
      res.json({ success: true, evaluation });
    } catch (error: any) {
      console.error("Exam evaluation error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to evaluate exam submission",
      });
    }
  });

  // AI Job Match & Pitch Generator
  app.post("/api/jobs/match", async (req, res) => {
    try {
      const { jobTitle, jobCompany, requiredSkills, userSkills, userLevel, userBadges } = req.body;
      const ai = getAI();

      const prompt = `Analyze the match between a candidate and a job opening.
Job: ${jobTitle} at ${jobCompany}
Job Required Skills: ${JSON.stringify(requiredSkills)}
Candidate Profile:
- Skills: ${JSON.stringify(userSkills)}
- Verified Progression Level: ${userLevel}
- Verified Badges: ${JSON.stringify(userBadges)}

Provide a match score percentage (0-100), key matching strengths, missing/recommended skills to learn or test for, and a 2-sentence tailored application pitch highlighting their verified credentials.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchPercentage: { type: Type.INTEGER },
              matchRating: { type: Type.STRING },
              matchingStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              tailoredPitch: { type: Type.STRING },
              recommendedCertifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["matchPercentage", "matchRating", "matchingStrengths", "missingSkills", "tailoredPitch", "recommendedCertifications"],
          },
        },
      });

      const matchData = JSON.parse(response.text || "{}");
      res.json({ success: true, match: matchData });
    } catch (error: any) {
      console.error("Job match error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to calculate job match",
      });
    }
  });

  // Vite middleware for development vs static build for production
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
    console.log(`SkillVerify server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
