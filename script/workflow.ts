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

    const entries: Array<{ label: string; description: string }> = [];

    for (const labeledDescription of labeledDescriptions) {
        const [label, description] = labeledDescription.split(":");
        if (!label || !description) {
            console.warn(`[workflow] Skipping malformed description: ${labeledDescription}`);
            continue;
        }
        const labelTrimmed = label.trim();
        const descriptionTrimmed = description.trim();
        entries.push({ label: labelTrimmed, description: descriptionTrimmed });

        console.log(`[workflow] Processing image: ${labelTrimmed}`);
        await generateImage(descriptionTrimmed, labelTrimmed);
        console.log(`[workflow] Generating voiceover text for: ${labelTrimmed}`);
        const voiceoverText = await generateProductImageVoiceoverText(productName, descriptionTrimmed);
        await generateVoiceover(voiceoverText, labelTrimmed);
    }

    const jsonPath = `assets/${productName}.json`;
    await Bun.write(jsonPath, JSON.stringify(entries, null, 2) + "\n");
    console.log(`[workflow] Wrote ${entries.length} entries to ${jsonPath}`);

    console.log("[workflow] Done");
}

// for testing
// eslint-disable-next-line no-constant-condition
if (false) {
    const productName = await prompt("Product name: ");
    const productDescription = await prompt("Product description: ");
    await workflow(productName, productDescription);
} else {
    await workflow(
        "Decanter",
        "The Aether-Glass Decanter is a delicate, crystalline vessel that does not hold wine, but rather distilled memories harvested from the dreams of sleeping giants. When poured into a goblet, the liquid shimmers with the exact sensory experience of the memory, allowing the drinker to feel the wind of ancient mountain peaks or the warmth of a sun that set centuries ago. However, the decanter replenishes itself only when left in total darkness, absorbing the ambient silence of the room to brew new draughts of forgotten history. It is a prized artifact for historians and thrill-seekers alike, offering a literal taste of the past that is as intoxicating as it is educational."
    );
}