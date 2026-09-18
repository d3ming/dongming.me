#!/usr/bin/env node

import { access, readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DIST = join(ROOT, "dist");
const BLOG = join(ROOT, "src", "content", "blog");

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function filesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? filesIn(path) : path;
    }),
  );
  return files.flat();
}

function fail(message) {
  throw new Error(`Public build verification failed: ${message}`);
}

const contentFiles = (await filesIn(BLOG)).filter((path) => /\.(md|mdx)$/.test(path));
const posts = [];

for (const path of contentFiles) {
  const source = await readFile(path, "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? "";
  const status = frontmatter.match(/^status:\s*(draft|published|unlisted)\s*$/mu)?.[1] ?? "draft";
  const slug = frontmatter.match(/^slug:\s*["']([^"']+)["']\s*$/mu)?.[1];
  const id = slug ?? relative(BLOG, path).replace(/\.(md|mdx)$/u, "");
  posts.push({ id, status });
}

for (const post of posts) {
  const page = join(DIST, "posts", ...post.id.split("/"), "index.html");
  const built = await exists(page);

  if (post.status === "draft" && built) {
    fail(`draft ${post.id} has a production page`);
  }
  if (post.status !== "draft" && !built) {
    fail(`${post.status} post ${post.id} has no production page`);
  }
}

const postsJson = JSON.parse(await readFile(join(DIST, "posts.json"), "utf8"));
if (postsJson.some((post) => post.status !== "published")) {
  fail("posts.json exposes a non-published post");
}

const sitemapFiles = (await filesIn(DIST)).filter((path) => /sitemap.*\.xml$/u.test(path));
if (sitemapFiles.length === 0) {
  fail("no sitemap was generated");
}
const sitemap = await Promise.all(sitemapFiles.map((path) => readFile(path, "utf8")));
if (sitemap.some((content) => content.includes("/posts/unlisted/"))) {
  fail("the sitemap exposes an unlisted post");
}

const unlistedPost = posts.find((post) => post.status === "unlisted");
if (unlistedPost) {
  const unlistedPage = join(DIST, "posts", ...unlistedPost.id.split("/"), "index.html");
  const unlistedHtml = await readFile(unlistedPage, "utf8");
  if (!unlistedHtml.includes('content="noindex,nofollow"')) {
    fail(`unlisted post ${unlistedPost.id} is missing noindex metadata`);
  }
  if (unlistedHtml.includes("data-pagefind-body")) {
    fail(`unlisted post ${unlistedPost.id} is searchable`);
  }
}

const publicHtml = await readFile(join(DIST, "index.html"), "utf8");
if (!publicHtml.includes("data-pagefind-body")) {
  fail("public pages are missing the Pagefind body marker");
}

console.log("✅ Public build verification passed.");
