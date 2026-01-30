import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
    // Global ignores
    { ignores: ["dist","node_modules"] },

    // Base JS recommendations
    js.configs.recommended,

    // TypeScript recommendations
    ...tseslint.configs.recommended,

    // React recommendations (including JSX runtime support for React 17+)
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"],

    // React version must be set in a config that applies to all files the plugin runs on.
    // The flat configs above have no `files` filter, so they apply everywhere; without this
    // block, files outside `src/` get the plugin but no settings.react → warning.
    {
        settings: {
            react: {
                version: "detect", // use "detect" to read from node_modules
            },
        },
    },

    // Project-specific settings
    {
        files: ["src/**/*.ts", "src/**/*.tsx"],
        languageOptions: {
            globals: globals.browser,
        },
    }
);
