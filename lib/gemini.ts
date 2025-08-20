// Lightweight Gemini client wrapper for browser usage
// Note: The API key is expected to be provided by the user and stored locally (e.g., localStorage).
// This is client-side and the key will be present in the browser context.
import { GoogleGenerativeAI } from "@google/generative-ai";

export type GeminiModel =
  | "gemini-2.5-flash"
  | "gemini-2.0-flash"
  | "gemini-1.5-flash"
  | "gemini-1.5-pro";

export interface GeminiJSONResult<T = unknown> {
  ok: boolean;
  data?: T;
  text?: string;
  error?: string;
}

export function getGeminiClient(apiKey: string) {
  if (!apiKey) throw new Error("Missing Gemini API key");
  return new GoogleGenerativeAI(apiKey);
}

export async function generateText(
  apiKey: string,
  prompt: string,
  model: GeminiModel = "gemini-2.5-flash"
): Promise<string> {
  const genAI = getGeminiClient(apiKey);
  const m = genAI.getGenerativeModel({ model });
  const res = await m.generateContent(prompt);
  const out = await res.response.text();
  return out.trim();
}

// Ask Gemini to return strict JSON. We'll try to extract a JSON substring if the model adds formatting.
export async function generateJSON<T = unknown>(
  apiKey: string,
  prompt: string,
  model: GeminiModel = "gemini-2.5-flash"
): Promise<GeminiJSONResult<T>> {
  try {
    const text = await generateText(apiKey, prompt +
      "\n\nReturn ONLY valid JSON. Do not include markdown fences or explanations.", model);
    const jsonString = extractFirstJSONObject(text);
    const data = JSON.parse(jsonString) as T;
    return { ok: true, data, text };
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) };
  }
}

function extractFirstJSONObject(text: string): string {
  // Try to grab the first {...} block
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  // Try array form
  const aStart = text.indexOf("[");
  const aEnd = text.lastIndexOf("]");
  if (aStart !== -1 && aEnd !== -1 && aEnd > aStart) {
    return text.slice(aStart, aEnd + 1);
  }
  // Fallback (will throw)
  return text;
}
