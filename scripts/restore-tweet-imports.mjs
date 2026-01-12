import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.resolve(__dirname, '../src/content/blog');

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath);
        } else if (entry.name.endsWith('.mdx')) {
            fixImports(fullPath);
        }
    }
}

function fixImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if file uses <Tweet but lacks import
    if (content.includes('<Tweet') && !content.includes("import { Tweet } from 'astro-embed';")) {
        console.log(`Fixing missing Tweet import in: ${path.basename(filePath)}`);

        // Insert import after frontmatter
        content = content.replace(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/, (match) => {
            return `${match}\nimport { Tweet } from 'astro-embed';\n\n`;
        });

        fs.writeFileSync(filePath, content);
    }
}

console.log('Scanning for missing Tweet imports...');
walk(BLOG_DIR);
console.log('Scan complete.');
