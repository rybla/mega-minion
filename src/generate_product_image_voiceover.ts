import { spawnSync } from "bun";

export async function generateProductImageVoiceoverText(productName: string, productImageDescription: string): Promise<string> {
    const voiceover = spawnSync(["agent", "-p", `Generate a voiceover for a product image description. The product name is: "${productName}". The product image description is: "${productImageDescription}". Respond with JUST the voiceover text.`]);
    return voiceover.stdout.toString().trim();
}