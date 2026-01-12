
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.resolve(__dirname, '../src/content/blog');

function getFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return {};
    const yaml = match[1];
    const obj = {};
    yaml.split('\n').forEach(line => {
        const [key, ...val] = line.split(':');
        if (key && val.length > 0) {
            obj[key.trim()] = val.join(':').trim().replace(/^['"]|['"]$/g, '');
        }
    });
    return obj;
}

import readline from 'node:readline';

const moves = [];

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath);
            // We'll clean up empty directories after moving files, in a second pass if needed,
            // but for safety let's skip directory deletion in the dry run/planning phase
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
            planReorganizeFile(fullPath, entry.name);
        }
    }
}

function planReorganizeFile(filePath, fileName) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = getFrontmatter(content);

    let year = 'misc';
    let dateObj = null;

    if (fm.pubDatetime) {
        dateObj = new Date(fm.pubDatetime);
        if (!isNaN(dateObj.getTime())) {
            year = dateObj.getUTCFullYear().toString();
        }
    }

    if (year === 'misc') {
        const match = fileName.match(/^(\d{4})/);
        if (match) year = match[1];
    }

    const yearDir = path.join(BLOG_DIR, year);
    // Don't create dir yet

    let newName = fileName;
    if (dateObj && !isNaN(dateObj.getTime())) {
        const yyyy = dateObj.getUTCFullYear();
        const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getUTCDate()).padStart(2, '0');

        let slug = fm.slug || fileName.replace(/\.mdx?$/, '');
        slug = slug.replace(/^(\d{4}-\d{2}-\d{2})-?/, '').replace(/^(\d{8})-?/, '');

        const ext = path.extname(fileName);
        newName = `${yyyy}-${mm}-${dd}-${slug}${ext}`;
    }

    const newPath = path.join(yearDir, newName);

    if (filePath !== newPath) {
        moves.push({ from: filePath, to: newPath, destDir: yearDir });
    }
}

walk(BLOG_DIR);

if (moves.length === 0) {
    console.log('No posts need safe reorganizing.');
    process.exit(0);
}

console.log('The following changes will be made:');
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
            if (!fs.existsSync(m.destDir)) {
                fs.mkdirSync(m.destDir, { recursive: true });
            }
            fs.renameSync(m.from, m.to);
            console.log(`Moved: ${path.basename(m.from)}`);
        });

        // Cleanup empty dirs pass
        // Simple implementation: check original dirs of moved files
        const originalDirs = [...new Set(moves.map(m => path.dirname(m.from)))];
        originalDirs.forEach(dir => {
            try {
                if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
                    fs.rmdirSync(dir);
                    console.log(`Removed empty dir: ${path.relative(BLOG_DIR, dir)}`);
                }
            } catch (e) {
                // ignore
            }
        });

        console.log('Reorganization complete.');
    } else {
        console.log('Operation cancelled.');
    }
    rl.close();
});
