import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "@/consts";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  if (!context.site) {
    throw new Error("Site URL is not configured in astro.config.mjs");
  }
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDatetime,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
  });
}
