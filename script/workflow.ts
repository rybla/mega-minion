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
        "Flask",
        "The Flask of Bottled Momentum is a heavy, alchemical vial designed to capture and store the kinetic energy of any object that comes to a sudden halt against its glass surface. A user can swing the flask wildly through the air or catch a falling stone with it, trapping that force inside the vessel as a swirling, pressurized vapor. When the wax seal is finally broken, the stored motion erupts outward in an invisible, directed blast, capable of shattering iron locks or launching arrows without a bow. Thieves and duelists prize it highly, though they must handle it with care, as a cracked flask will violently unleash weeks of stored impact in a single, catastrophic instant."
    );
}