import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get args
const args = process.argv.slice(2);
const titleArg = args.find(arg => arg.startsWith('--title='));
let title = titleArg ? titleArg.split('=')[1] : args[0];

// If no title provided, generate a random draft title
if (!title) {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    title = `Draft ${randomSuffix}`;
    console.log('ℹ️  No title provided. Using default: ' + title);
}

// Helpers
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

// Dates
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const dateString = `${year}-${month}-${day}`;
const isoString = now.toISOString();

// Paths
const slug = slugify(title);
const filename = `${dateString}-${slug}.mdx`;
const dir = path.join(__dirname, `../src/content/blog/${year}`);

// Ensure dir exists
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const fullPath = path.join(dir, filename);

if (fs.existsSync(fullPath)) {
    console.error(`Error: File already exists at ${fullPath}`);
    process.exit(1);
}

// Content Template
const template = `---
title: "${title}"
description: "TODO: Add a description"
pubDatetime: ${isoString}
author: "Dong Ming"
draft: true
tags:
  - others
---

Write your content here...
`;

// Write file
fs.writeFileSync(fullPath, template);

console.log(`✅ Created new post: src/content/blog/${year}/${filename}`);
