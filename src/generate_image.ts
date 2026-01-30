import { type GenerateContentParameters, GoogleGenAI } from "@google/genai";

const genAi = new GoogleGenAI({
    apiKey: process.env.GENAI_API_KEY,
});

export async function generateImage(prompt: string, label: string): Promise<void> {
    const genArgs: GenerateContentParameters = {
        model: "gemini-3-pro-image-preview",
        config: {
            responseModalities: ["IMAGE", "TEXT"],
            imageConfig: {
                imageSize: "1K",
                aspectRatio: "3:4",
            },
            systemInstruction: "You are a helpful assistant that generates product images based on a prompt.",
        },
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };
    const response = await genAi.models.generateContent(genArgs);
    const candidate = response.candidates?.[0];
    for (const part of candidate?.content?.parts ?? []) {
        if (part.inlineData?.data !== undefined)
            await Bun.write(`assets/${label}.png`, Buffer.from(part.inlineData.data, "base64"));
    }
    throw new Error("Invalid response: " + JSON.stringify(response, null, 4));
}