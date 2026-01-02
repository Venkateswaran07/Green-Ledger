
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { StageData, TrustAnalysis } from "../types";

// Note: GoogleGenAI is instantiated inside functions to ensure it always uses 
// the most up-to-date configuration and follows SDK usage patterns.

/**
 * Analyzes a specific stage of the supply chain for trust and anomalies.
 */
export const analyzeStageWithGemini = async (
  stageName: string,
  data: StageData
): Promise<TrustAnalysis> => {
  if (!process.env.API_KEY) {
    return {
      trustScore: 85,
      anomalies: ["API Key missing - running in simulation mode."],
      suggestions: ["Configure valid API Key for real-time AI audit."],
      isVerified: true
    };
  }

  // Create a new instance right before the call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are GreenTrust AI, a supply chain auditor. 
    Analyze the following data input from a ${stageName}.
    
    HIERARCHY VALIDATION:
    - Check if the productCode matches the category chainID prefix (e.g. Code 101 must be under Category 100).
    - Detect any logic errors in energy usage or environment scores.
    
    Data: ${JSON.stringify(data)}

    Return a JSON response with:
    - trustScore (0-100 integer)
    - anomalies (array of strings explaining issues)
    - suggestions (array of strings for improvement)
    - isVerified (boolean, true if score > 70)
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trustScore: { type: Type.INTEGER },
            anomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            isVerified: { type: Type.BOOLEAN }
          },
          required: ["trustScore", "anomalies", "suggestions", "isVerified"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as TrustAnalysis;
  } catch (error) {
    console.error("Gemini Audit Error:", error);
    return { trustScore: 50, anomalies: ["Audit Logic Error"], suggestions: ["Retry analysis"], isVerified: false };
  }
};

/**
 * Chatbot service to interact with users about EcoChain data and general sustainability guidance.
 */
export const askChatbot = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[],
  context: { role: string; category: string }
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "EcoAssistant (Simulation): Please configure an API Key to enable my neural response engine. Currently I can only simulate responses.";
  }

  // Create a new instance right before the call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Map application history to the structure expected by the GenAI SDK
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  // Append the current user query
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: `You are EcoAssistant, an expert AI specialized in industrial supply chain sustainability and blockchain transparency.
        Current Context:
        - User Role: ${context.role}
        - Sector: ${context.category}
        Provide professional, concise, and technically accurate advice on carbon footprint reduction and data integrity.`,
      },
    });

    return response.text || "I apologize, but I am unable to formulate a response at this moment.";
  } catch (error) {
    console.error("Gemini Chatbot Error:", error);
    return "My neural pathways are temporarily saturated. Please re-submit your query in a few moments.";
  }
};
