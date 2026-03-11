import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY || "" });

export async function generateTexture(prompt: string, imageBase64?: string, imageMimeType?: string): Promise<string> {
  try {
    const parts: any[] = [];
    
    if (imageBase64 && imageMimeType) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      });
    }
    
    parts.push({
      text: `A seamless, flat, high-resolution texture of ${prompt || 'the provided image'}. Material texture, perfectly tileable, uniform lighting, no shadows, 8k resolution.`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      } as any,
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating texture:", error);
    throw error;
  }
}
