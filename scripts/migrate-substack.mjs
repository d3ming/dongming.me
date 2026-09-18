
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMPORT_DIR = path.resolve(__dirname, '../imports/substack/Mingdom Moment');
const POSTS_DIR = path.join(IMPORT_DIR, 'posts');
const CSV_FILE = path.join(IMPORT_DIR, 'posts.csv');
const OUT_DIR = path.resolve(__dirname, '../src/content/blog');
const SUBSTACK_DOMAIN = 'https://mingdom.substack.com';

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Simple CSV parser
function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const headers = lines[0].split(',').map(h => h.trim().replace(/^\ufeff/, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const row = {};
        let cursor = 0;

        for (const header of headers) {
            if (cursor >= line.length) {
                row[header] = '';
                continue;
            }

            let value = '';
            if (line[cursor] === '"') {
                const match = line.substring(cursor).match(/^"((?:[^"]|"")*)"/);
                if (match) {
                    value = match[1].replace(/""/g, '"');
                    cursor += match[0].length + 1; // +1 for comma
                }
            } else {
                const nextComma = line.indexOf(',', cursor);
                if (nextComma === -1) {
                    value = line.substring(cursor);
                    cursor = line.length;
                } else {
                    value = line.substring(cursor, nextComma);
                    cursor = nextComma + 1;
                }
            }
            row[header] = value;
        }
        rows.push(row);
    }
    return rows;
}

function htmlToMarkdown(html) {
    let md = html;

    md = md.replace(/<div class="subscription-widget-wrap-editor".*?<\/div>(\s*<div.*<\/div>)?/gs, '');
    md = md.replace(/<div class="digest-post-embed".*?data-attrs="([^"]+)".*?><\/div>/gs, (match, dataAttrsAttr) => {
        try {
            const data = JSON.parse(dataAttrsAttr.replace(/&quot;/g, '"'));
            return `> [Embedded Post: ${data.title}](${data.canonical_url})\n\n`;
        } catch (e) {
            return '';
        }
    });

    md = md.replace(/<div class="captioned-image-container">.*?<img\s+src="([^"]+)".*?>.*?<figcaption\s+class="image-caption">(.*?)<\/figcaption>.*?<\/div>/gs, '\n\n![$2]($1)\n\n');
    md = md.replace(/<img\s+src="([^"]+)".*?>/g, '\n\n![]($1)\n\n');
    md = md.replace(/<picture>.*?<\/picture>/gs, '');

    md = md.replace(/<h1.*?>(.*?)<\/h1>/gs, '\n# $1\n\n');
    md = md.replace(/<h2.*?>(.*?)<\/h2>/gs, '\n## $1\n\n');
    md = md.replace(/<h3.*?>(.*?)<\/h3>/gs, '\n### $1\n\n');
    md = md.replace(/<h4.*?>(.*?)<\/h4>/gs, '\n#### $1\n\n');

    md = md.replace(/<a\s+href="([^"]+)".*?>(.*?)<\/a>/gs, '[$2]($1)');

    md = md.replace(/<strong>(.*?)<\/strong>/gs, '**$1**');
    md = md.replace(/<b>(.*?)<\/b>/gs, '**$1**');
    md = md.replace(/<em>(.*?)<\/em>/gs, '*$1*');
    md = md.replace(/<i>(.*?)<\/i>/gs, '*$1*');

    md = md.replace(/<li>\s*<p>(.*?)<\/p>\s*<\/li>/gs, '<li>$1</li>');

    md = md.replace(/<ul.*?>(.*?)<\/ul>/gs, (match, content) => {
        return content.replace(/<li>(.*?)<\/li>/gs, (m, p1) => `- ${p1}\n`) + '\n';
    });

    md = md.replace(/<ol.*?>(.*?)<\/ol>/gs, (match, content) => {
        let index = 1;
        return content.replace(/<li>(.*?)<\/li>/gs, (m, p1) => `${index++}. ${p1}\n`) + '\n';
    });

    md = md.replace(/<blockquote.*?>(.*?)<\/blockquote>/gs, (match, content) => {
        const cleanContent = content.replace(/<p>(.*?)<\/p>/gs, '$1\n\n');
        return '> ' + cleanContent.replace(/\n/g, '\n> ') + '\n\n';
    });

    md = md.replace(/<p.*?>(.*?)<\/p>/gs, '$1\n\n');
    md = md.replace(/<[^>]+>/g, '');

    md = md.replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#39;/g, "'");

    return md.trim();
}

function toTitleCase(slug) {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function extractDateFromSlug(slug) {
    // Matches YYYYMMDD at start of slug
    const match = slug.match(/^(\d{4})(\d{2})(\d{2})/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}T12:00:00.000Z`;
    }
    return null;
}

const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
const posts = parseCSV(csvContent);

let successCount = 0;

console.log(`Found ${posts.length} posts in CSV.`);

for (const post of posts) {
    if (!post.post_id) continue;

    const files = fs.readdirSync(POSTS_DIR);
    const htmlFile = files.find(f => f.startsWith(post.post_id + '.'));

    if (!htmlFile) {
        console.warn(`HTML file not found for post ${post.post_id} (${post.title})`);
        continue;
    }

    const htmlContent = fs.readFileSync(path.join(POSTS_DIR, htmlFile), 'utf-8');
    let markdownBody = htmlToMarkdown(htmlContent);

    const parts = htmlFile.split('.');
    const slug = parts.slice(1, parts.length - 1).join('.');

    let title = post.title;
    if (!title) {
        title = toTitleCase(slug);
    }

    const description = post.subtitle || '';

    // DATE LOGIC
    let dateStr = post.post_date;
    if (!dateStr) {
        dateStr = extractDateFromSlug(slug);
    }
    if (!dateStr) {
        dateStr = post.email_sent_at; // Try email sent date
    }
    if (!dateStr) {
        // If absolutely no date found, default to a past date to avoid cluttering specific feeds
        // Using 2000-01-01
        dateStr = '2000-01-01T00:00:00.000Z';
    }

    const date = new Date(dateStr).toISOString();

    const originalUrl = `${SUBSTACK_DOMAIN}/p/${slug}`;

    markdownBody = `> This post was originally published on [Substack](${originalUrl}).\n\n` + markdownBody;

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
pubDatetime: ${date}
author: "Dong Ming"
tags: ["substack", "mingdom-moment"]
status: draft
slug: "${slug}"
canonicalURL: "${originalUrl}"
---

`;

    const finalContent = frontmatter + markdownBody;

    const outFile = path.join(OUT_DIR, `${slug}.md`);
    fs.writeFileSync(outFile, finalContent);
    console.log(`Imported: ${outFile}`);
    successCount++;
}

console.log(`Successfully migrated ${successCount} posts.`);
