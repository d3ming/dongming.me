
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

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath);
            // Clean up empty directories
            if (fs.readdirSync(fullPath).length === 0) {
                fs.rmdirSync(fullPath);
            }
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
            reorganizeFile(fullPath, entry.name);
        }
    }
}

function reorganizeFile(filePath, fileName) {
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
    if (!fs.existsSync(yearDir)) {
        fs.mkdirSync(yearDir, { recursive: true });
    }

    let newName = fileName;
    if (dateObj && !isNaN(dateObj.getTime())) {
        const yyyy = dateObj.getUTCFullYear();
        const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getUTCDate()).padStart(2, '0');

        let slug = fm.slug || fileName.replace(/\.mdx?$/, '');
        slug = slug.replace(/^(\d{4}-\d{2}-\d{2})-?/, '').replace(/^(\d{8})-?/, '');

        newName = `${yyyy}-${mm}-${dd}-${slug}.md`;
    }

    const newPath = path.join(yearDir, newName);

    if (filePath !== newPath) {
        console.log(`Moving ${path.relative(BLOG_DIR, filePath)} -> ${year}/${newName}`);
        fs.renameSync(filePath, newPath);
    }
}

walk(BLOG_DIR);
console.log('Reorganization complete.');
