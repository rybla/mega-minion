import * as readline from "node:readline";
import { generateProductImageDescriptions } from "../src/generate_product_image_descriptions";
import { generateImage } from "../src/generate_image";
import { generateVoiceover } from "../src/generate_voiceover";
import { generateProductImageVoiceoverText } from "../src/generate_product_image_voiceover";

function prompt(question: string): Promise<string> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

export async function workflow(productName: string, productDescription: string): Promise<void> {
    console.log("[workflow] Starting product image workflow");

    console.log("[workflow] Product:", productName);

    console.log("[workflow] Generating product image descriptions...");
    const labeledDescriptions = await generateProductImageDescriptions(productName, productDescription);
    console.log(`[workflow] Got ${labeledDescriptions.length} image description(s)`);

    for (const labeledDescription of labeledDescriptions) {
        const [label, description] = labeledDescription.split(":");
        if (!label || !description) {
            console.warn(`[workflow] Skipping malformed description: ${labeledDescription}`);
            continue;
        }
        console.log(`[workflow] Processing image: ${label.trim()}`);
        await generateImage(description.trim(), label.trim());
        console.log(`[workflow] Generating voiceover text for: ${label.trim()}`);
        const voiceoverText = await generateProductImageVoiceoverText(productName, description.trim());
        await generateVoiceover(voiceoverText, label.trim());
    }
    console.log("[workflow] Done");
}

// for testing
// eslint-disable-next-line no-constant-condition
if (false) {
    const productName = await prompt("Product name: ");
    const productDescription = await prompt("Product description: ");
    await workflow(productName, productDescription);
} else {
    await workflow("Fruit Basket", "A basket of fruit that is fresh and delicious.");
}