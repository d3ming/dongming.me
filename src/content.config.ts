import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "./consts";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    author: z.string().default(SITE.author),
    pubDatetime: z.coerce.date(),
    modDatetime: z.date().optional().nullable(),
    title: z.string(),
    featured: z.boolean().optional(),
    status: z.enum(["draft", "published", "unlisted"]).default("draft"),
    pinned: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    description: z.string(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { blog };
