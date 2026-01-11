import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";


export default defineConfig({
  site: "https://tbd.ong",
  trailingSlash: "never",
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [
    mdx(), // Keep mdx integration for .mdx support if needed, but remove the plugin from here to avoid double processing or just keep it simple. Actually, if I put it in markdown config, it applies to .md. MDX files use the mdx integration. Let's apply to both or just markdown given the current files are .md.
    // The user has .md files. Astro applies 'markdown' config to .md files.
    // So:

    sitemap()
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
