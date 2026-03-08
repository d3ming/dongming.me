import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import embeds from "astro-embed/integration";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";


export default defineConfig({
  site: "https://dongming.me",
  trailingSlash: "never",
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [
    embeds(),
    mdx({
      remarkPlugins: [remarkReadingTime],
    }),
    sitemap()
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
