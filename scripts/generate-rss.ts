import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const configJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "site.config.json"), "utf8")
);

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return String(result);
}

async function main() {
  const postsDir = path.join(process.cwd(), "content", "posts");
  if (!fs.existsSync(postsDir)) {
    console.log("No posts directory found, skipping RSS generation.");
    return;
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const posts = await Promise.all(
    files.map(async (f) => {
      const raw = fs.readFileSync(path.join(postsDir, f), "utf8");
      const { data, content } = matter(raw);
      const slug = f.replace(/\.md$/, "");
      const html = await markdownToHtml(content);
      return {
        slug,
        title: (data.title as string) || slug,
        date: new Date(String(data.date)),
        html,
      };
    })
  );

  posts.sort((a, b) => b.date.getTime() - a.date.getTime());

  const rssItems = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${configJson.url}/posts/${p.slug}/</link>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description><![CDATA[${p.html}]]></description>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(configJson.siteTitle)}</title>
    <link>${configJson.url}</link>
    <description>${escapeXml(configJson.siteTitle)}</description>
${rssItems}
  </channel>
</rss>`;

  const outDir = path.join(process.cwd(), "out");
  fs.writeFileSync(path.join(outDir, "feed.xml"), rss);
  console.log(`Generated RSS feed with ${posts.length} posts → out/feed.xml`);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

main().catch(console.error);
