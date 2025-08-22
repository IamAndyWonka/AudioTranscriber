
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function buildPrompt(language: string, identifySpeakers: boolean): string {
    let prompt = `Tu tarea es transcribir este audio a texto de forma precisa.

Instrucciones:
1. Idioma de Transcripción: Transcribe el audio en ${language}.
2. Formato: Entrega el texto completo y sin censura, manteniendo la puntuación y el flujo natural de la conversación. No incluyas marcas de tiempo, etiquetas de ruido (como [música] o [risa]), ni resúmenes.
`;

    if (identifySpeakers) {
        prompt += `3. Identificación de Oradores: El audio es una conversación. Usa una etiqueta genérica como "Orador 1:" y "Orador 2:" al comienzo de cada intervención para diferenciar a los participantes.`;
    }

    return prompt;
}

export const transcribeAudio = async (
    audioBase64: string,
    mimeType: string,
    language: string,
    identifySpeakers: boolean
): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';

        const audioPart = {
            inlineData: {
                data: audioBase64,
                mimeType: mimeType,
            },
        };

        const textPart = {
            text: buildPrompt(language, identifySpeakers),
        };

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [audioPart, textPart] }
        });

        if (response.text) {
            return response.text;
        } else {
            throw new Error('La respuesta de la API no contiene texto. Puede que el contenido haya sido bloqueado.');
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Error en la API de Gemini: ${error.message}`);
        }
        throw new Error("Un error desconocido ocurrió al contactar la API de Gemini.");
    }
};
