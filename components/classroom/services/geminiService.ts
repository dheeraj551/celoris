import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_FLASH } from "../constants";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const generateLessonPlan = async (topic: string, duration: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: `Create a structured ${duration} lesson plan for a class about "${topic}". 
      Include:
      1. Learning Objectives
      2. Key Concepts
      3. A 5-minute activity
      4. Discussion questions.
      Format in clear Markdown.`,
    });
    return response.text || "Failed to generate lesson plan.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API Key configuration.";
  }
};

export const generateQuizFromNotes = async (notes: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: `Based on the following class notes, generate 3 multiple-choice questions with the correct answer indicated.
      
      NOTES:
      ${notes}
      `,
    });
    return response.text || "Failed to generate quiz.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating quiz. Please check your API Key.";
  }
};

export const analyzeStudentEngagement = async (attendanceData: string): Promise<string> => {
   try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: `Analyze this anonymous class engagement data and provide 3 suggestions to improve participation: ${attendanceData}`,
    });
    return response.text || "Analysis unavailable.";
  } catch (error) {
    return "Error running analysis.";
  }
}