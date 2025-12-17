import { GoogleGenAI, GenerateContentResponse, CountTokensResponse } from "@google/genai";
import { TokenUsage } from "../types";
import { checkUsageLimit, recordUsage } from "./usageService";

const MODEL_NAME = 'gemini-2.5-flash';

// The specific error message requested for UX
const RATE_LIMIT_MESSAGE = "Sorry, your Gemini free-tier limit is reached. Try again once your free-tier credits are replenished in a few hours.";

interface RunPromptParams {
  baseText: string;
  promptText: string;
  apiKey?: string;
}

const getClient = (apiKey?: string) => {
  const key = apiKey || process.env.API_KEY;
  if (!key) throw new Error("API Key is missing. Please set it in Settings.");
  return new GoogleGenAI({ apiKey: key });
};

export const runGeminiPrompt = async ({ baseText, promptText, apiKey }: RunPromptParams): Promise<{ text: string; usage: TokenUsage }> => {
  // 1. Proactive Client-Side Check
  if (!checkUsageLimit()) {
    throw new Error(RATE_LIMIT_MESSAGE);
  }

  try {
    const ai = getClient(apiKey);
    
    // We combine the instruction (prompt) and the data (baseText)
    const combinedPrompt = `
${promptText}

---
DATA:
${baseText}
`;

    // Run generateContent and countTokens in parallel
    // We count baseText and promptText separately to provide the exact breakdown requested by the UI
    // independent of the wrapper formatting (separators, newlines) used in combinedPrompt.
    const [response, baseCountResponse, promptCountResponse] = await Promise.all([
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: combinedPrompt,
      }) as Promise<GenerateContentResponse>,
      ai.models.countTokens({
        model: MODEL_NAME,
        contents: baseText,
      }) as Promise<CountTokensResponse>,
      ai.models.countTokens({
        model: MODEL_NAME,
        contents: promptText,
      }) as Promise<CountTokensResponse>
    ]);

    const text = response.text || "No response generated.";
    
    // Extract token usage
    const usageMetadata = response.usageMetadata;
    const realTotalTokens = usageMetadata?.totalTokenCount || 0;
    
    // Calculate UI-facing metrics
    // We use the explicit counts for Base and Prompt so they match the Input Panel exactly.
    const baseTokens = baseCountResponse.totalTokens || 0;
    const promptPartTokens = promptCountResponse.totalTokens || 0;
    
    // Total Input for UI (sum of parts, excluding hidden wrapper tokens)
    const totalInputTokensUI = baseTokens + promptPartTokens;
    
    const outputTokens = usageMetadata?.candidatesTokenCount || 0;
    
    // Total Tokens for UI (Input + Output)
    const totalTokensUI = totalInputTokensUI + outputTokens;

    const usage: TokenUsage = {
      promptTokens: totalInputTokensUI, // Used for cost calc
      outputTokens,
      totalTokens: totalTokensUI,       // Sum of parts
      baseTokens,
      promptPartTokens                  // Specific prompt text count
    };

    // 2. Record Usage on Success
    // We use the REAL total from the API response for rate limiting accuracy
    recordUsage(realTotalTokens);

    return { text, usage };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // 3. Reactive Server-Side Error Handling
    if (
      error.status === 429 || 
      error.response?.status === 429 ||
      error.message?.includes('429') || 
      error.message?.includes('RESOURCE_EXHAUSTED') ||
      error.message?.includes('quota')
    ) {
      throw new Error(RATE_LIMIT_MESSAGE);
    }

    throw error;
  }
};

export const countGeminiTokens = async (text: string, apiKey?: string): Promise<number> => {
  try {
    // If no key is available yet (app load), return 0 gracefully
    if (!apiKey && !process.env.API_KEY) return 0;
    
    const ai = getClient(apiKey);
    const response: CountTokensResponse = await ai.models.countTokens({
      model: MODEL_NAME,
      contents: text,
    });
    return response.totalTokens || 0;
  } catch (error) {
    console.error("Token Count Error:", error);
    // Fail silently for token counting to avoid UI clutter during typing
    return 0;
  }
};