# mega-minion

This project implements an AI workflow for generating useful assets for showcasing a new product. The workflow is implemented as a TypeScript script, which produces a final JSON result and a collection of asset files that can be loaded by the frontend which is implemented in `src.App.tsx`.

The workflow has these steps:
1. Ask the user for a simple description of their product and a label for their product, <product_name>.
2. Generate some descriptions that will be used as prompts for generating images of the product to be used in advertisements. Each one gets a label, <ad_label> that will be used as the base of the filename of assets relating to this ad image.
3. Generate the images based on these descriptions. Save each to `assets/<ad_label>.png`.
6. Based on these descriptions, also generate a voiceover for each image that will be read while showing the image as an advertisement. Save each to `assets/<ad_label>.mp3`
5. Write a resulting JSON file that includes a list of the label and description for each image to `assets/<product_name>.json`

The frontend is simply a viewer for these assets. The frontend does the following:
- Load the JSON for a product, which is specified by a URL search parameter for `product_name`, which loads all the ad labels.
- Show one ad image for the product at a time and plays the associated voiceover. When the voiceover finishes, shows the next ad image.

## Implemenation Ntoes

Use `generateImage` from `src/generate_image.ts` to generate images.

Use `generateVoiceover` from `src/generate_voiceover` to generate voiceovers.

Store all assets in `assets/`.

Add GET endpoints to `index.ts` for fetching the generated assets.

