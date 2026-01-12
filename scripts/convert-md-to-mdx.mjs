import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.resolve(__dirname, '../src/content/blog');
const moves = [];

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath);
        } else if (entry.name.endsWith('.md')) {
            const newName = entry.name.replace(/\.md$/, '.mdx');
            const newPath = path.join(dir, newName);
            moves.push({ from: fullPath, to: newPath });
        }
    }
}

walk(BLOG_DIR);

if (moves.length === 0) {
    console.log('No .md files found to convert.');
    process.exit(0);
}

console.log('The following files will be renamed from .md to .mdx:');
moves.forEach(m => {
    console.log(`${path.relative(BLOG_DIR, m.from)} -> ${path.relative(BLOG_DIR, m.to)}`);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('\nDo you want to proceed? (y/N) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
        moves.forEach(m => {
            fs.renameSync(m.from, m.to);
            console.log(`Renamed: ${path.basename(m.from)}`);
        });
        console.log('Conversion complete.');
    } else {
        console.log('Operation cancelled.');
    }
    rl.close();
});
