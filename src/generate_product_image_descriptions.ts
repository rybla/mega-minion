import { spawnSync } from "bun";

export async function generateProductImageDescriptions(productName: string, productDescription: string): Promise<string[]> {
    const descriptions = spawnSync(["agent", "-p", `Write a list of 3 product image descriptions for a product called "${productName}". The product description is: "${productDescription}". The descriptions should be in the following format: "<label>: <description>". Respond with JUST the product descriptions separated by newlines.`]);
    return descriptions.stdout.toString().split("\n").map(description => description.trim()).filter(description => description !== "");
}
