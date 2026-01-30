import { spawnSync } from "bun";

export async function generateProductImageVoiceoverText(productName: string, productImageDescription: string): Promise<string> {
    console.log(`[generateProductImageVoiceoverText] Generating voiceover text for product "${productName}"`);
    const voiceover = spawnSync(["agent", "-p", `Generate a 1-sentence and super catchy voiceover for an ad featuring a product image with the given description. The product name is: "${productName}". The product image description is: "${productImageDescription}". Respond with JUST the voiceover text`]);
    const text = voiceover.stdout.toString().trim();
    console.log(`[generateProductImageVoiceoverText] Got ${text.length} chars of voiceover text`);
    return text;
}