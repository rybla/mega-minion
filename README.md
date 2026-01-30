# mega-minion

To install dependencies: `bun install`.

To start a development server: `bun dev`.

## Development

To run validation script: `bun run validate`. This validation must pass before changes can be submitted.

---

## Inspiration

We wanted to turn a single product description into a full set of ad-ready assets—images and voiceovers—without manual copywriting, design, or recording. The goal was an automated "advert bot" that could showcase any product in multiple angles and with catchy spoken hooks, so creators and small teams could ship professional-style spots quickly.

## What it does

Given a product name and description, the workflow:

1. **Generates ad concepts** — AI produces several image prompts (e.g. close-up, lifestyle, overhead) with short labels.
2. **Creates product images** — Each prompt is sent to Google Gemini to generate a 4:3 product image, saved as PNG.
3. **Writes voiceover copy** — For each image, AI generates a one-sentence, catchy voiceover line.
4. **Synthesizes voiceover audio** — ElevenLabs turns that text into MP3 using a consistent voice.

A React frontend serves as an **ad viewer**: you pass `?product_name=YourProduct` in the URL, and it loads the product’s JSON manifest, then cycles through each ad image while playing its voiceover. When one voiceover ends, it advances to the next ad.

## How we built it

- **Runtime & tooling**: Bun and TypeScript for the CLI workflow and the dev server.
- **Image generation**: Google Gemini (`@google/genai`) with the image-capable model to generate PNGs from text prompts.
- **Voiceover text**: Cursor agent invoked via `bun spawnSync` to generate ad copy and image descriptions in a controlled format.
- **Text-to-speech**: ElevenLabs API (`@elevenlabs/elevenlabs-js`) for high-quality, consistent voiceover MP3s.
- **Frontend**: React 19 with a minimal ad-viewer UI; Bun’s built-in server serves the app and exposes `/api/assets/:productName` and `/assets/:filename` for the generated JSON and media files.
- **Orchestration**: A single workflow script in `script/workflow.ts` runs the pipeline (descriptions → images → voiceover text → voiceover audio) and writes everything under `assets/`.

## Challenges we ran into

- **Structured output from the agent**: Getting the agent to return only the requested format (e.g. `label: description` per line, or a single voiceover sentence) required clear, strict prompts and parsing to avoid malformed entries.
- **Asset naming and consistency**: Keeping labels safe for filenames and in sync across PNGs, MP3s, and the product JSON meant enforcing rules (no path traversal, consistent encoding) in both the workflow and the server.
- **Coordinating multiple APIs**: Tying together Gemini (images), ElevenLabs (audio), and the agent (text) in one pipeline meant handling env vars, errors, and ordering so each step had the right inputs (e.g. voiceover text derived from the same description used for the image).

## Accomplishments that we're proud of

- **End-to-end automation**: From one product description to multiple ready-to-use ad spots (image + voice) with a single workflow run.
- **Reusable pipeline**: The same flow works for any product; you only change the product name and description.
- **Simple viewer**: The frontend is minimal but effective—auto-advancing through ads with synced voiceover makes it easy to preview the full set without extra UI.
- **Single stack**: Using Bun for both the CLI and the server keeps the project simple and fast to run and validate.

## What we learned

- How to drive Google Gemini’s image generation from TypeScript and persist base64 image responses to the filesystem.
- How to integrate ElevenLabs text-to-speech with a fixed voice and format for consistent ad narration.
- How to use Bun’s `spawnSync` to call an external agent and parse its stdout for structured content in a script.
- How to serve a React SPA and dynamic asset routes (JSON + PNG + MP3) from the same Bun server with safe path handling.

## What's next for advert-bot

- **Write the product JSON from the workflow**: Have the workflow script emit `assets/<product_name>.json` (label + description per ad) so the viewer can load new products without manual manifest creation.
- **More voices and styles**: Let users pick voice or tone (e.g. energetic, calm) and pass that into the voiceover generator and ElevenLabs.
- **Video export**: Stitch each image + voiceover into a short video (e.g. MP4) for direct use on social or in ads.
- **Batch and CLI UX**: Accept product name/description via CLI flags or a config file, and support running the workflow for multiple products in one go.
