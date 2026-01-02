
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeNews = async (fact: string): Promise<AnalysisResponse> => {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [{
      parts: [{
        text: `Actúa como "Noticias Cruzadas", un asistente educativo experto en Análisis Crítico del Discurso.
        Recibe este HECHO BASE: "${fact}"
        
        Tu tarea es reescribirlo desde tres perfiles editoriales y realizar un análisis didáctico.
        Para cada perfil, genera:
        1. Titular (Headline)
        2. Bajada (SubHeadline) - 1-2 frases.
        3. Cuerpo (Body) - Un párrafo de unas 60-80 palabras desarrollando la noticia según el sesgo.
        4. Epígrafe (Epigraph) - Un texto corto para una foto que capture la esencia del sesgo.
        
        PERFILES:
        1. SENSACIONALISTA (El Grito): Impacto emocional, morbo, exclamaciones, adjetivos extremos.
        2. OFICIALISTA (La Gaceta Oficial): Minimiza negativos, usa Voz Pasiva, eufemismos, resalta "logros".
        3. OPOSITOR (La Voz Crítica): Maximiza responsabilidad gubernamental, usa Voz Activa agresiva, denuncia incompetencia.
        
        REGLA DE SEGURIDAD: Si el tema es inapropiado u ofensivo, genera una respuesta que indique: "Por favor, ingresa un hecho noticioso para analizar." dentro del campo baseFact y deja el resto vacío.
        `
      }]
    }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          baseFact: { type: Type.STRING },
          sensationalist: {
            type: Type.OBJECT,
            properties: {
              newspaper: { type: Type.STRING },
              headline: { type: Type.STRING },
              subHeadline: { type: Type.STRING },
              body: { type: Type.STRING },
              epigraph: { type: Type.STRING }
            },
            required: ["newspaper", "headline", "subHeadline", "body", "epigraph"]
          },
          officialist: {
            type: Type.OBJECT,
            properties: {
              newspaper: { type: Type.STRING },
              headline: { type: Type.STRING },
              subHeadline: { type: Type.STRING },
              body: { type: Type.STRING },
              epigraph: { type: Type.STRING }
            },
            required: ["newspaper", "headline", "subHeadline", "body", "epigraph"]
          },
          oppositional: {
            type: Type.OBJECT,
            properties: {
              newspaper: { type: Type.STRING },
              headline: { type: Type.STRING },
              subHeadline: { type: Type.STRING },
              body: { type: Type.STRING },
              epigraph: { type: Type.STRING }
            },
            required: ["newspaper", "headline", "subHeadline", "body", "epigraph"]
          },
          educationalAnalysis: {
            type: Type.OBJECT,
            properties: {
              voiceUsage: { type: Type.STRING },
              lexicalComparison: { type: Type.STRING },
              intentionality: { type: Type.STRING }
            },
            required: ["voiceUsage", "lexicalComparison", "intentionality"]
          }
        },
        required: ["baseFact", "sensationalist", "officialist", "oppositional", "educationalAnalysis"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as AnalysisResponse;
};

export const generateNewsImage = async (prompt: string, style: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  const fullPrompt = `A journalistic press photograph for a news article. Style: ${style}. Subject: ${prompt}. Realist, high quality, professional news agency style.`;
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [{ text: fullPrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to generate image");
};
