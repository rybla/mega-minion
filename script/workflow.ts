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

export async function workflow(): Promise<void> {
    const productName = await prompt("Product name: ");
    const productDescription = await prompt("Product description: ");

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