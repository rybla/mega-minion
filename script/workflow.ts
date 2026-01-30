import * as readline from "node:readline";
import { generateProductImageDescriptions } from "../src/generate_product_image_descriptions";
import { generateImage } from "../src/generate_image";
import { generateVoiceover } from "../src/generate_voiceover";
import { generateProductImageVoiceoverText } from "../src/generate_product_image_voiceover";
import { improveDescription } from "@/improve_description";

function prompt(question: string): Promise<string> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

export async function workflow(productName: string, productPrompt: string): Promise<void> {
    console.log("[workflow] Starting product image workflow");

    console.log("[workflow] Product:", productName);

    console.log("[workflow] Improving product description...");
    const productDescription = await improveDescription(productPrompt);
    console.log("[workflow] Improved product description:", productDescription);

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
    }

    const promises = entries.map(async ({ label: labelTrimmed, description: descriptionTrimmed }) => {
        console.log(`[workflow] Processing image: ${labelTrimmed}`);
        await generateImage(descriptionTrimmed, labelTrimmed);
        console.log(`[workflow] Generating voiceover text for: ${labelTrimmed}`);
        const voiceoverText = await generateProductImageVoiceoverText(productName, descriptionTrimmed);
        await generateVoiceover(voiceoverText, labelTrimmed);
    });

    await Promise.all(promises);

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
    // await workflow(
    //     "Decanter",
    //     "The Aether-Glass Decanter is a delicate, crystalline vessel that does not hold wine, but rather distilled memories harvested from the dreams of sleeping giants. When poured into a goblet, the liquid shimmers with the exact sensory experience of the memory, allowing the drinker to feel the wind of ancient mountain peaks or the warmth of a sun that set centuries ago. However, the decanter replenishes itself only when left in total darkness, absorbing the ambient silence of the room to brew new draughts of forgotten history. It is a prized artifact for historians and thrill-seekers alike, offering a literal taste of the past that is as intoxicating as it is educational."
    // );
    // await workflow(
    //     "Crystal-blossom-Nectar-Pear",
    //     "Crystal-blossom Nectar-Pear is a translucent, bioluminescent fruit grown only in the frost-tipped orchards of the Ethereal Highlands. When sliced open, the core releases a swirling mist that tastes of forgotten childhood memories and chilled elderflower wine. The skin is composed of delicate, edible sugar-crystals that hum a soft, resonant frequency as they dissolve on your tongue. Consuming the fruit grants the eater a temporary ability to see the shimmering ley lines of magic woven into the natural world."
    // );
    // await workflow(
    //     "football-boot",
    //     "A football boot with a unique design"
    // );
    // await workflow(
    //     "lawn-chair",
    //     "A lawn chair made from a magical wooden material"
    // )
    await workflow(
        "office-chair",
        "an office chair that is perfectly aligned to the user's body"
    )
}