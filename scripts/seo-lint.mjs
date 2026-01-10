#!/usr/bin/env node

/**
 * SEO Content Linter
 * Validates blog post frontmatter for SEO best practices
 */

import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BLOG_DIR = join(__dirname, "..", "src", "content", "blog");

// SEO Rules
const RULES = {
    TITLE_MIN_LENGTH: 10,
    TITLE_MAX_LENGTH: 60,
    DESCRIPTION_MIN_LENGTH: 120,
    DESCRIPTION_MAX_LENGTH: 160,
};

let hasErrors = false;
let hasWarnings = false;

function error(postId, message) {
    console.error(`❌ ERROR [${postId}]: ${message}`);
    hasErrors = true;
}

function warn(postId, message) {
    console.warn(`⚠️  WARN [${postId}]: ${message}`);
    hasWarnings = true;
}

function success(postId, message) {
    console.log(`✅ [${postId}]: ${message}`);
}

function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return null;
    }

    const frontmatter = {};
    const lines = match[1].split("\n");

    for (const line of lines) {
        const colonIndex = line.indexOf(":");
        if (colonIndex === -1) continue;

        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        // Parse booleans
        if (value === "true") value = true;
        if (value === "false") value = false;

        frontmatter[key] = value;
    }

    return frontmatter;
}

async function getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = join(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return files.flat();
}

async function lintContent() {
    console.log("🔍 Running SEO content linter...\n");

    try {
        const allFiles = await getFiles(BLOG_DIR);
        const mdFiles = allFiles.filter(f => f.endsWith(".md") || f.endsWith(".mdx"));

        if (mdFiles.length === 0) {
            console.log("ℹ️  No blog posts found to lint.");
            return;
        }

        console.log(`Found ${mdFiles.length} post(s) to validate.\n`);

        for (const filePath of mdFiles) {
            const fileName = filePath.replace(BLOG_DIR + "/", "");
            const postId = fileName.replace(/\.(md|mdx)$/, "");
            const content = await readFile(filePath, "utf-8");
            const data = parseFrontmatter(content);

            if (!data) {
                error(postId, "No frontmatter found");
                console.log("");
                continue;
            }

            // Skip drafts
            if (data.draft === true) {
                console.log(`⏭️  [${postId}]: Skipping draft\n`);
                continue;
            }

            console.log(`📝 Checking: ${postId}`);

            // Check title
            if (!data.title) {
                error(postId, "Missing title");
            } else {
                const titleLength = data.title.length;
                if (titleLength < RULES.TITLE_MIN_LENGTH) {
                    warn(postId, `Title too short (${titleLength} chars, min: ${RULES.TITLE_MIN_LENGTH})`);
                } else if (titleLength > RULES.TITLE_MAX_LENGTH) {
                    warn(postId, `Title too long (${titleLength} chars, max: ${RULES.TITLE_MAX_LENGTH}). May be truncated in search results.`);
                } else {
                    success(postId, `Title length OK (${titleLength} chars)`);
                }
            }

            // Check description
            if (!data.description) {
                error(postId, "Missing description");
            } else {
                const descLength = data.description.length;
                if (descLength < RULES.DESCRIPTION_MIN_LENGTH) {
                    warn(postId, `Description too short (${descLength} chars, min: ${RULES.DESCRIPTION_MIN_LENGTH})`);
                } else if (descLength > RULES.DESCRIPTION_MAX_LENGTH) {
                    warn(postId, `Description too long (${descLength} chars, max: ${RULES.DESCRIPTION_MAX_LENGTH}). May be truncated in search results.`);
                } else {
                    success(postId, `Description length OK (${descLength} chars)`);
                }
            }

            // Check publication date
            if (!data.pubDatetime) {
                error(postId, "Missing pubDatetime");
            } else {
                success(postId, "Publication date present");
            }

            // Check author
            if (!data.author) {
                warn(postId, "Missing author (will default to site author)");
            } else {
                success(postId, `Author: ${data.author}`);
            }

            // Check tags
            if (!data.tags) {
                warn(postId, "No tags specified (consider adding for better organization)");
            }

            console.log(""); // Blank line between posts
        }

        // Summary
        console.log("━".repeat(60));
        if (hasErrors) {
            console.error("\n❌ SEO linting failed with errors.");
            console.error("Fix the errors above before publishing.\n");
            process.exit(1);
        } else if (hasWarnings) {
            console.warn("\n⚠️  SEO linting completed with warnings.");
            console.warn("Consider addressing warnings for optimal SEO.\n");
            process.exit(0); // Don't fail on warnings
        } else {
            console.log("\n✅ All posts pass SEO validation!\n");
            process.exit(0);
        }
    } catch (err) {
        console.error("❌ Error running SEO linter:", err.message);
        process.exit(1);
    }
}

lintContent();
