import { type GenerateContentParameters, GoogleGenAI } from "@google/genai";

const genAi = new GoogleGenAI({
    apiKey: process.env.GENAI_API_KEY,
});

export async function generateImage(prompt: string, label: string): Promise<void> {
    console.log(`[generateImage] Generating image for label "${label}"`);
    const genArgs: GenerateContentParameters = {
        model: "gemini-3-pro-image-preview",
        config: {
            responseModalities: ["IMAGE", "TEXT"],
            imageConfig: {
                imageSize: "1K",
                aspectRatio: "4:3",
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
    console.log(`[generateImage] Calling Gemini API for "${label}"...`);
    const response = await genAi.models.generateContent(genArgs);
    const candidate = response.candidates?.[0];
    for (const part of candidate?.content?.parts ?? []) {
        if (part.inlineData?.data !== undefined) {
            const path = `assets/${label}.png`;
            await Bun.write(path, Buffer.from(part.inlineData.data, "base64"));
            console.log(`[generateImage] Saved image to ${path}`);
            return;
        }
    }
    console.error("[generateImage] No image data in response");
    throw new Error("Invalid response: " + JSON.stringify(response, null, 4));
}