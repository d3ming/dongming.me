import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export function remarkReadingTime() {
  return (tree, { data }) => {
    const textOnPage = mdastToString(tree);
    const readingTime = getReadingTime(textOnPage);
    // readingTime.text will be like '1 min read'
    // readingTime.minutes will be the number
    data.astro.frontmatter.readingTime = readingTime.text;
    data.astro.frontmatter.readingTimeMinutes = Math.ceil(readingTime.minutes);
  };
}
