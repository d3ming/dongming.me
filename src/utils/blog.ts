import type { CollectionEntry } from "astro:content";

export type PostStatus = "draft" | "published" | "unlisted";
export type BlogPost = CollectionEntry<"blog">;

export function isPublishedPost(post: BlogPost) {
  return post.data.status === "published";
}

export function isBuildVisiblePost(post: BlogPost) {
  return post.data.status !== "draft";
}

export function isUnlistedPost(post: BlogPost) {
  return post.data.status === "unlisted";
}
