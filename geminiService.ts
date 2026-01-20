import { GoogleGenAI, Type, Modality } from "@google/genai";

// Always use named parameter for apiKey and obtain it exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-pro-preview for complex analysis and search grounding
const PRO_MODEL = "gemini-3-pro-preview";
// Using gemini-3-flash-preview for fast multi-modal chat
const FLASH_MODEL = "gemini-3-flash-preview";
// Using tts model for audio generation
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

// Manual base64 decode implementation as per guidelines
export function decodeBase64Manual(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Manual PCM audio decoding logic as per guidelines
export async function decodeAudioDataManual(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export async function analyzeCropImage(base64Image: string, language: string = 'English') {
  const prompt = `
    You are a world-class plant pathologist. Analyze this leaf/crop image.
    1. Identify the crop and the specific disease (if any).
    2. Provide a structured response in JSON format.
    3. IMPORTANT: Provide ALL text descriptions (diseaseName, symptoms, causes, treatment, prevention, economicImpact) in ${language}.
    4. Include: 
       - diseaseName: string
       - confidence: number (0-1)
       - symptoms: string[]
       - causes: string[] (What caused this infection?)
       - treatment: string[] (Cure/pesticides)
       - prevention: string[] (How to stop it next time?)
       - yieldLossPercentage: string (Estimated % loss it causes)
       - economicImpact: string (Financial loss per acre in local currency or equivalent value)
    Use the PlantVillage dataset names if applicable but translate the name to ${language}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseaseName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            causes: { type: Type.ARRAY, items: { type: Type.STRING } },
            treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
            yieldLossPercentage: { type: Type.STRING },
            economicImpact: { type: Type.STRING },
          },
          required: ["diseaseName", "confidence", "symptoms", "causes", "treatment", "prevention", "yieldLossPercentage", "economicImpact"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty diagnostic response. The image may be too blurry or contains non-agricultural content.");
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", text);
      throw new Error("The AI terminal returned an invalid data format. Please initiate a new scan.");
    }

  } catch (error: any) {
    console.error("Gemini Analysis Critical Failure:", error);
    throw error;
  }
}

export async function getMarketIntelligence(cropName: string, language: string = 'English') {
  const prompt = `
  You are a Market Analyst specializing in Agriculture. 
  Fetch and summarize the absolute latest trade rates (Price per Quintal) for ${cropName} from major relevant mandis and market hubs.
  
  Format instructions:
  1. Use ${language} for the entire response.
  2. Start with a "Sentiment Pulse": Is it an "Uptrend", "Stable", or "Correction" phase?
  3. Provide a breakdown of current prices.
  4. Mention Government MSP or relevant policy news.
  5. Conclude with a "Strategy Note" for the farmer (e.g., Hold or Sell).
  6. Return a highly professional, data-heavy summary.
  `;

  const response = await ai.models.generateContent({
    model: PRO_MODEL,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text,
    sources: sources,
    timestamp: Date.now()
  };
}

export async function speakText(text: string) {
  const response = await ai.models.generateContent({
    model: TTS_MODEL,
    contents: [{ parts: [{ text: `Say clearly and helpfully: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return null;

  return base64Audio;
}

export async function getAgriAdvice(logs: string, cropName: string, language: string = 'English') {
  const prompt = `
    You are an Agricultural Expert Advisor.
    User's Crop: ${cropName}
    Recent History of Logs: ${logs}
    
    IMPORTANT: Provide all advice specifically in ${language}.
    Provide specific, actionable advice for the farmer based on this history.
    Suggest tasks for the next week, potential risks based on current health status, and nutrient advice.
    Keep the tone encouraging and professional. Use markdown.
  `;

  const response = await ai.models.generateContent({
    model: PRO_MODEL,
    contents: prompt
  });

  return response.text;
}

export async function sendMultiModalMessage(
  history: any[],
  text: string,
  image?: { data: string; mimeType: string },
  audio?: { data: string; mimeType: string },
  systemInstruction?: string
) {
  const parts: any[] = [{ text }];
  if (image) {
    parts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
  }
  if (audio) {
    parts.push({ inlineData: { data: audio.data, mimeType: audio.mimeType } });
  }

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: [
      ...history,
      { role: 'user', parts }
    ],
    config: {
      systemInstruction: systemInstruction || "You are a helpful agricultural assistant."
    }
  });

  return response.text;
}