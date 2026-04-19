import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

export const geminiService = {
  async generateQuiz(subject: string, topic: string, content: string): Promise<QuizQuestion[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 multiple choice questions for the subject "${subject}" and topic "${topic}". 
      Base the questions on this content: "${content}". 
      Return the result as a JSON array of questions with keys: id, question, options (array of 4 strings), correctAnswer (index 0-3), and explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.NUMBER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to parse quiz response", e);
      return [];
    }
  },

  async askTutor(subject: string, question: string, history: { role: 'user' | 'model', content: string }[]) {
    const formattedHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: `I am studying "${subject}". Question: ${question}` }] }
      ],
      config: {
        systemInstruction: `You are the GradeOS AI Tutor. You are an expert academic coach. 
        Your goal is to help students understand complex concepts simply. 
        Use analogies, examples, and encourage active recall. 
        Be professional, supportive, and concise.`
      }
    });

    return response.text;
  }
};
