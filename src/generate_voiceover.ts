import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
});

const voiceId = "hqFZL8ZnNxQK2qFcuxRL";
const modelId = "eleven_multilingual_v2";

export async function generateVoiceover(text: string, label: string): Promise<void> {
    const audioStream = await client.textToSpeech.convert(voiceId, {
        text: text,
        modelId: modelId,
        outputFormat: "mp3_44100_128",
    });
    const buffer = await new Response(audioStream).arrayBuffer();
    await Bun.write(`assets/${label}.mp3`, buffer);
}