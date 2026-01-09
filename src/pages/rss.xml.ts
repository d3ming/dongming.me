import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE } from "@/consts";

export async function GET(context: any) {
  const posts = await getCollection("blog");
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
