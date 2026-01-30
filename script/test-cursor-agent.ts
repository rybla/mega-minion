import { spawnSync } from "bun";

const productName = "Fruit Basket";
const productDescription = "A basket of fruit that is fresh and delicious.";

const descriptions = spawnSync(["agent", "-p", `Write a list of 3 product image descriptions for a product called "${productName}". The product description is: "${productDescription}". The descriptions should be in the following format: "<label>: <description>". Respond with JUST the product descriptions separated by newlines.`]);

console.log(descriptions.stdout.toString());