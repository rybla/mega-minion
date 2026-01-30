import * as path from "node:path";
import { serve } from "bun";
import index from "./index.html";

const assetsDir = path.join(import.meta.dir, "..", "assets");

function isPathSafe(filename: string): boolean {
  const decoded = decodeURIComponent(filename);
  return !decoded.includes("..") && !decoded.includes("/") && !decoded.includes("\\");
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/assets/:productName": {
      async GET(req) {
        const productName = req.params.productName;
        if (!productName || !isPathSafe(productName)) {
          return new Response("Bad request", { status: 400 });
        }
        const filePath = path.join(assetsDir, `${decodeURIComponent(productName)}.json`);
        const file = Bun.file(filePath);
        if (!(await file.exists())) {
          return new Response("Not found", { status: 404 });
        }
        return new Response(file, {
          headers: { "Content-Type": "application/json" },
        });
      },
    },

    "/assets/:filename": {
      async GET(req) {
        const filename = req.params.filename;
        if (!filename || !isPathSafe(filename)) {
          return new Response("Bad request", { status: 400 });
        }
        const decoded = decodeURIComponent(filename);
        const filePath = path.join(assetsDir, decoded);
        const file = Bun.file(filePath);
        if (!(await file.exists())) {
          return new Response("Not found", { status: 404 });
        }
        const ext = path.extname(decoded).toLowerCase();
        const contentType =
          ext === ".png" ? "image/png" : ext === ".mp3" ? "audio/mpeg" : "application/octet-stream";
        return new Response(file, {
          headers: { "Content-Type": contentType },
        });
      },
    },

    "/api/hello": {
      async GET() {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT() {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
