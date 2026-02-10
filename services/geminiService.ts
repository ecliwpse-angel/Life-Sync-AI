
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, UserRole } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiResponse = async (prompt: string, role: UserRole) => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `You are an expert ${role === UserRole.STUDENT ? 'Education Consultant and Tutor' : 'Health and Life Assistant'}. 
  Provide clear, concise information. When asked for topics, always include 3-5 relevant practice questions at the end in a clear format.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
    },
  });

  return response.text;
};

export const generateStudySchedule = async (subject: string, topics: string[], timeLimitHours: number, isExamTomorrow: boolean) => {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: `Create a detailed study schedule for the subject "${subject}". 
    Topics to cover: ${topics.join(', ')}. 
    Total time available: ${timeLimitHours} hours. 
    Is it for an exam tomorrow? ${isExamTomorrow ? 'YES' : 'NO'}.
    Provide a JSON array of objects with 'name' (topic name), 'startTime', 'endTime', and 'priority'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
                priority: { type: Type.STRING }
              },
              required: ["name", "startTime", "endTime", "priority"]
            }
          }
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data.schedule || [];
  } catch (e) {
    console.error("Failed to parse schedule JSON", e);
    return [];
  }
};
