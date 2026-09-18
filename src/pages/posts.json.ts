import { getCollection } from "astro:content";
import { isPublishedPost } from "@/utils/blog";

export async function GET() {
  const allPosts = await getCollection("blog");

  const posts = allPosts
    .filter((post) => {
      // PROD: Include only published posts.
      // DEV: Include everything.
      if (import.meta.env.DEV) return true;
      return isPublishedPost(post);
    })
    .sort((a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime())
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      pubDatetime: post.data.pubDatetime,
      formattedDate: post.data.pubDatetime.toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      tags: post.data.tags,
      status: post.data.status,
    }));

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
