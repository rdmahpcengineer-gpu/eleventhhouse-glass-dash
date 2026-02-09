
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartSupportResponse = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an EHCX.ai support AI assistant, part of Eleventh House AI. Answer this query professionally and concisely: ${query}`,
      config: {
        systemInstruction: "You are the face of EHCX.ai (Eleventh House AI), the autonomous AI contact center that runs itself. You focus on efficiency, technical autonomy (no IT team required), and high-end human-like voice interaction.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to the EHCX network right now. Our autonomous systems are performing self-maintenance. Please try again shortly.";
  }
};
