/**
 * This file demonstrates how to use the ElevenLabs API to convert text to speech using TypeScript.
 * It uses the official '@elevenlabs/elevenlabs-js' npm package.
 *
 * Organization:
 * 1. Imports: 'fs' for file writing and 'ElevenLabsClient' from the SDK.
 * 2. Configuration: Setup for the API client, Voice ID (Rachel), and Model ID (Multilingual v2).
 * 3. 'generateAudio' Function: An async function that creates a stream from the API and pipes it to a file.
 * 4. Execution: Runs the function to generate "Hello world" into 'output.mp3'.
 */

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
const generateAudio = async () => {
  const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  const voiceId = "hqFZL8ZnNxQK2qFcuxRL";
  const modelId = "eleven_multilingual_v2";

  try {
    const audioStream = await client.textToSpeech.convert(voiceId, {
      text: "Hello world",
      modelId: modelId,
      outputFormat: "mp3_44100_128",
    });

    const outputPath = "output.mp3";
    const buffer = await new Response(audioStream).arrayBuffer();
    await Bun.write(outputPath, buffer);

    console.log("Audio generated successfully: output.mp3");
  } catch (error) {
    console.error("Error generating audio:", error);
  }
};

generateAudio();