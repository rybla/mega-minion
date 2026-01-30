import { spawnSync } from "bun";

export async function improveDescription(description: string): Promise<string> {
    console.log(`[improveDescription] Improving description: "${description}"`);
    const improvedDescription = spawnSync(["agent", "-p", `Improve the following description by making it more descriptive and engaging especially including visual details and details that would be useful for an image generator and how that product is used (be creative and come up with your own ideas): "${description}". Respond with JUST the improved description as 1 paragraph.`]);
    const result = improvedDescription.stdout.toString().trim();
    console.log(`[improveDescription] Improved description: "${result}"`);
    return result;
}