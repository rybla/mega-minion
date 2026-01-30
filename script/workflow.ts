import { generateProductImageDescriptions } from "../src/generate_product_image_descriptions";
import { generateImage } from "../src/generate_image";
import { generateVoiceover } from "../src/generate_voiceover";
import { generateProductImageVoiceoverText } from "../src/generate_product_image_voiceover";

export async function workflow(productName: string, productDescription: string): Promise<void> {
    const labeledDescriptions = await generateProductImageDescriptions(productName, productDescription);
    labeledDescriptions.forEach(async (labeledDescription) => {
        const [label, description] = labeledDescription.split(":");
        if (!label || !description) {
            console.warn(`Skipping malformed description: ${labeledDescription}`);
            return;
        }
        await generateImage(description.trim(), label.trim());
        const voiceoverText = await generateProductImageVoiceoverText(productName, description.trim());
        await generateVoiceover(voiceoverText, label.trim());
    })
}