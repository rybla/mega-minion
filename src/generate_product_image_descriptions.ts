import { spawnSync } from "bun";

export async function generateProductImageDescriptions(productName: string, productDescription: string): Promise<string[]> {
    console.log(`[generateProductImageDescriptions] Generating descriptions for product "${productName}"`);
    const descriptions = spawnSync(["agent", "-p", `Write a list of 3 product image descriptions for a product called "${productName}". The product description is: "${productDescription}". The descriptions should be in the following format: "<label>: <description>". Respond with JUST the product descriptions separated by newlines.`]);
    const result = descriptions.stdout.toString().split("\n").map(description => description.trim()).filter(description => description !== "");
    console.log(`[generateProductImageDescriptions] Got ${result.length} description(s):`, result.map((d) => d.split(":")[0]));
    return result;
}
