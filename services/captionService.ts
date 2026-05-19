import { GoogleGenAI } from "@google/genai";
import { CaptionParams, CaptionType, CaptionTone, CaptionPlatform, HashtagLevel } from "../types";

const getClient = (customKey?: string) => {
  const apiKey = customKey?.trim() || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please enter your Google Gemini API Key.");
  }
  return new GoogleGenAI({ apiKey });
};

const stripBase64Prefix = (dataUrl: string): string => {
  return dataUrl.split(',')[1] || dataUrl;
};

const getMimeType = (dataUrl: string): string => {
  return dataUrl.split(';')[0].split(':')[1] || 'image/png';
};

const typeInstructions: Record<CaptionType, string> = {
  social: "Keep under 220 characters. Use a hook, body, and call-to-action structure. Conversational and engaging.",
  blog: "Long-form, 2-4 sentences. SEO-friendly with a compelling intro. Encourage clicks and reading.",
  product: "Highlight benefits and features. Include a clear call to action. Persuasive and benefit-driven.",
  seo: "Naturally include relevant keywords. Write in meta-description style. Optimized for search visibility.",
  creative: "Poetic, abstract, or storytelling style. Expressive and artistic. Evokes emotion or curiosity.",
};

const toneInstructions: Record<CaptionTone, string> = {
  professional: "Formal language. No slang, no emoji. Authoritative and polished tone.",
  casual: "Conversational. Can use contractions and emoji. Friendly and approachable.",
  funny: "Witty and humorous. Use puns, wordplay, and light-hearted jokes. Entertaining.",
  inspirational: "Motivational and uplifting. Use aspirational language. Inspire action or reflection.",
};

const platformInstructions: Record<CaptionPlatform, string> = {
  instagram: "Visual-first. Use line breaks for readability. Include relevant hashtags. Hashtags are important here.",
  twitter: "Under 280 characters. Punchy and direct. Can thread if longer form.",
  linkedin: "Professional tone. Industry-relevant. End with a question or discussion prompt.",
  tiktok: "Short, punchy, trend-aware. Hook in first 2 seconds. Use emoji and casual language.",
  general: "Versatile. Works across platforms. Clean and universal.",
};

const hashtagInstructions: Record<HashtagLevel, string> = {
  none: "Do NOT include any hashtags.",
  few: "Include 3-5 relevant hashtags at the end.",
  many: "Include 8-12 relevant hashtags at the end.",
};

export const generateCaptions = async (params: CaptionParams, apiKey?: string): Promise<string[]> => {
  const ai = getClient(apiKey);

  let text = params.text || "Describe a general scene or concept.";
  const typeInfo = typeInstructions[params.captionType];
  const toneInfo = toneInstructions[params.tone];
  const platformInfo = platformInstructions[params.platform];
  const hashtagInfo = hashtagInstructions[params.hashtags];

  const systemPrompt = `You are a professional copywriter and social media strategist.

Generate EXACTLY ${params.count} unique, distinct caption${params.count > 1 ? 's' : ''} for the given content.

--- TYPE ---
${typeInfo}

--- TONE ---
${toneInfo}

--- PLATFORM ---
${platformInfo}

--- HASHTAGS ---
${hashtagInfo}

--- FORMAT ---
Return a valid JSON array of strings. Example: ["Caption one", "Caption two", "Caption three"]
Each caption should be unique in style and approach.
Do NOT number the captions. Just return the array.`;

  try {
    const parts: any[] = [{ text: systemPrompt }, { text: `Content to caption: ${text}` }];

    if (params.imageBase64) {
      const cleanBase64 = stripBase64Prefix(params.imageBase64);
      const mimeType = getMimeType(params.imageBase64);
      parts.push({
        inlineData: { data: cleanBase64, mimeType: mimeType },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: { responseMimeType: "application/json" },
    });

    if (response.text) {
      const captions = JSON.parse(response.text);
      if (Array.isArray(captions)) {
        return captions.map((c: any) => String(c).trim()).filter(Boolean);
      }
      return [String(captions)];
    }
    throw new Error("No response from Gemini.");
  } catch (error) {
    console.error("Caption generation error:", error);
    throw error;
  }
};

export const regenerateSingleCaption = async (
  params: CaptionParams,
  existingCaptions: string[],
  apiKey?: string
): Promise<string> => {
  const ai = getClient(apiKey);

  const text = params.text || "Describe a general scene or concept.";
  const typeInfo = typeInstructions[params.captionType];
  const toneInfo = toneInstructions[params.tone];
  const platformInfo = platformInstructions[params.platform];
  const hashtagInfo = hashtagInstructions[params.hashtags];

  const systemPrompt = `You are a professional copywriter. Generate ONE new caption that is DIFFERENT from the existing ones.

--- TYPE ---
${typeInfo}

--- TONE ---
${toneInfo}

--- PLATFORM ---
${platformInfo}

--- HASHTAGS ---
${hashtagInfo}

Existing captions (DO NOT repeat these):
${existingCaptions.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Return only the caption text as a plain string. No JSON.`;

  try {
    const parts: any[] = [{ text: systemPrompt }, { text: `Content: ${text}` }];

    if (params.imageBase64) {
      const cleanBase64 = stripBase64Prefix(params.imageBase64);
      const mimeType = getMimeType(params.imageBase64);
      parts.push({
        inlineData: { data: cleanBase64, mimeType: mimeType },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
    });

    return response.text?.trim() || "Could not generate caption.";
  } catch (error) {
    console.error("Regenerate error:", error);
    throw error;
  }
};
