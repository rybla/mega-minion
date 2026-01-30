import { generateProductImageDescriptions } from "../src/generate_product_image_descriptions";
import { generateImage } from "../src/generate_image";
import { generateVoiceover } from "../src/generate_voiceover";

export async function workflow(productName: string, productDescription: string): Promise<void> {
    const labeledDescriptions = await generateProductImageDescriptions(productName, productDescription);
    labeledDescriptions.forEach(async (labeledDescription) => {
        const [label, description] = labeledDescription.split(":");
        await generateImage(description, label);
        await generateVoiceover(description, label);
    })
}