import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const BLOG_DIR = path.resolve('src/content/blog');

async function fixEmbeds() {
    console.log(`Scanning ${BLOG_DIR} for broken Beehiiv embeds...`);

    // Find all MDX files
    const files = await glob('**/*.mdx', { cwd: BLOG_DIR, absolute: true });

    let totalFixed = 0;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf-8');
        let originalContent = content;
        let fileFixedCount = 0;

        // Regex to find markdown links to Twitter/X
        // Group 1: The link text/content
        // Group 2: The URL
        const regex = /\[([\s\S]*?)\]\((https?:\/\/(?:twitter\.com|x\.com|www\.twitter\.com|www\.x\.com)\/[a-zA-Z0-9_]+\/status\/\d+[^\)]*)\)/g;

        content = content.replace(regex, (match, linkText, url) => {
            // Only replace if the link text looks "messy" (contains images)
            // Beehiiv embeds usually have images for profile pic, twitter logo, etc.
            if (linkText.includes('![')) {
                fileFixedCount++;
                // Clean the URL (remove query params like utm_source, s=46, etc if meaningful, but astro-embed handles them usually.
                // Let's keep it simple and just use the full URL but maybe strip beehiiv tracking params if we want to be clean.)
                // Actually, let's strip query params for cleaner look, but keep ID.
                try {
                    const urlObj = new URL(url);
                    // minimal cleanup: just keep the base status path
                    // pattern: /user/status/id
                    return `\n\n${urlObj.origin}${urlObj.pathname}\n\n`;
                } catch (e) {
                    return `\n\n${url}\n\n`;
                }
            }
            return match;
        });

        if (content !== originalContent) {
            fs.writeFileSync(file, content, 'utf-8');
            console.log(`Fixed ${fileFixedCount} embeds in ${path.relative(BLOG_DIR, file)}`);
            totalFixed += fileFixedCount;
        }
    }

    console.log(`\nDone! Fixed ${totalFixed} embeds across ${files.length} files.`);
}

fixEmbeds().catch(console.error);
