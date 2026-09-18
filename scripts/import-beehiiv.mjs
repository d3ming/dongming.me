/**
 * Import Beehiiv posts to Astro Content Collection
 *
 * Usage:
 * 1. Install dependencies: npm install -D csv-parse turndown cheerio
 * 2. Run: node scripts/import-beehiiv.mjs
 */
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import TurndownService from 'turndown';
import * as cheerio from 'cheerio';

const CSV_PATH = path.resolve('imports/beehiiv/Posts Export Jan 11 2026.csv');
const BLOG_DIR = path.resolve('src/content/blog');

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

async function importBeehiiv() {
    if (!fs.existsSync(CSV_PATH)) {
        console.error(`CSV file not found at ${CSV_PATH}`);
        return;
    }

    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    });

    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    });

    turndownService.keep(['iframe']);

    let count = 0;

    for (const record of records) {
        if (record.status !== 'confirmed') {
            console.log(`Skipping draft/unconfirmed post: ${record.web_title}`);
            continue;
        }

        const title = record.web_title.trim();
        const dateStr = record.created_at;
        // Format date: YYYY-MM-DD using UTC to match the timestamp
        const date = new Date(dateStr);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        // Add time for pubDatetime
        const pubDatetime = date.toISOString();

        let slug = '';
        if (record.url) {
            const match = record.url.match(/\/p\/([^\/?]+)/);
            if (match) {
                slug = match[1];
            }
        }
        if (!slug) {
            slug = slugify(title);
        }

        const outputDir = path.join(BLOG_DIR, year.toString());
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Use .mdx extension
        const filename = `${formattedDate}-${slug}.mdx`;
        const filePath = path.join(outputDir, filename);

        const tags = record.content_tags
            ? record.content_tags.split(',').map(t => t.trim()).filter(Boolean)
            : [];

        const description = record.web_subtitle ? record.web_subtitle.trim() : '';
        const heroImage = record.thumbnail_url || '';

        // Clean HTML with Cheerio
        const $ = cheerio.load(record.content_html);

        $('style').remove();
        $('script').remove();
        $('head').remove();

        let content = $('.email-card-body');
        if (content.length === 0) {
            content = $('body');
        }

        content.find('a').each((i, el) => {
            if ($(el).text().trim() === 'Read Online') {
                $(el).closest('div').remove();
                $(el).closest('td').remove();
            }
        });

        content.find('img[alt*="share on"]').each((i, el) => {
            $(el).closest('table').remove();
        });

        content.find('a').each((i, el) => {
            const txt = $(el).text().trim().toLowerCase();
            if (txt.includes('subscribe')) {
                $(el).closest('table').remove();
                $(el).remove();
            }
        });

        content.find('p, div, td').each((i, el) => {
            const txt = $(el).text().trim();
            if (txt.includes('Update your email preferences') ||
                txt.includes('Unsubscribe') ||
                txt.includes('Powered by beehiiv') ||
                txt.includes('228 Park Ave S')
            ) {
                $(el).remove();
            }
        });

        content.find('div:contains("OPEN_TRACKING_PIXEL")').remove();

        // Simplify Twitter/X embeds
        content.find('a').each((i, el) => {
            const href = $(el).attr('href');
            if (!href) return;

            if ((href.includes('twitter.com') || href.includes('x.com')) && href.includes('/status/')) {
                // If it contains images (likely an embed card), replace with placeholder
                if ($(el).find('img').length > 0) {
                    try {
                        const urlObj = new URL(href);
                        const cleanUrl = urlObj.origin + urlObj.pathname;
                        // Placeholder for post-processing - alphanumeric to avoid escaping
                        $(el).replaceWith(`<p>TWEETEMBEDSTART${cleanUrl}TWEETEMBEDEND</p>`);
                    } catch (e) {
                        // ignore
                    }
                }
            }
        });

        let htmlToConvert = content.html() || '';

        let markdown = turndownService.turndown(htmlToConvert);
        markdown = markdown.replace(/\n\n\n+/g, '\n\n');

        // Post-process placeholders
        let hasTweets = false;
        markdown = markdown.replace(/TWEETEMBEDSTART(.*?)TWEETEMBEDEND/g, (match, url) => {
            hasTweets = true;
            return `<Tweet id="${url.trim()}" />`;
        });

        markdown = markdown.trim();

        markdown = markdown.split('\n').filter(line => {
            const l = line.trim().toLowerCase();
            if (l === 'read online' || l === 'subscribe') return false;
            if (l.includes('update your email preferences')) return false;
            if (l.includes('powered by beehiiv')) return false;
            if (l.includes('open_tracking_pixel')) return false;
            return true;
        }).join('\n');


        const frontmatter = [
            '---',
            `title: "${title.replace(/"/g, '\\"')}"`,
            `description: "${description.replace(/"/g, '\\"')}"`,
            `pubDatetime: ${pubDatetime}`,
            `author: "Dong Ming"`,
            `status: draft`,
        ];

        if (heroImage) {
            frontmatter.push(`heroImage: "${heroImage}"`);
        }

        tags.push('import/beehiiv');
        const uniqueTags = [...new Set(tags)];

        frontmatter.push('tags:');
        uniqueTags.forEach(tag => {
            frontmatter.push(`  - ${tag}`);
        });

        frontmatter.push('---');
        frontmatter.push('');

        if (hasTweets) {
            frontmatter.push("import { Tweet } from 'astro-embed';");
            frontmatter.push('');
        }

        frontmatter.push(markdown);

        const result = frontmatter.join('\n');

        fs.writeFileSync(filePath, result);
        console.log(`Imported: ${filePath}`);
        count++;
    }

    console.log(`Successfully imported ${count} posts.`);
}

importBeehiiv().catch(console.error);
