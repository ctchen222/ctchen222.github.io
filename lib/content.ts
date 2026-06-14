import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

const contentDir = path.join(process.cwd(), "content");

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  body: string;
  html: string;
  excerpt: string;
}

export interface Letter {
  slug: string;
  title: string;
  date: string;
  body: string;
  html: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return String(result);
}

function getExcerpt(body: string, maxLen = 200): string {
  const text = body
    .replace(/^#+\s+.*/gm, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (!text) return "";
  return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
}

function parseTags(tags: unknown): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String);
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function formatDate(date: unknown): string {
  if (!date) return "";
  const d = new Date(String(date));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(d)
    .replace(",", "");
}

export async function getAllPosts(): Promise<Post[]> {
  const dir = path.join(contentDir, "posts");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const posts = await Promise.all(
    files.map(async (f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      const slug = f.replace(/\.md$/, "");
      const html = await markdownToHtml(content);
      return {
        slug,
        title: (data.title as string) || slug,
        date: formatDate(data.date),
        tags: parseTags(data.tags),
        body: content,
        html,
        excerpt: getExcerpt(content),
      };
    })
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(contentDir, "posts", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const html = await markdownToHtml(content);

  return {
    slug,
    title: (data.title as string) || slug,
    date: formatDate(data.date),
    tags: parseTags(data.tags),
    body: content,
    html,
    excerpt: getExcerpt(content),
  };
}

export async function getAllLetters(): Promise<Letter[]> {
  const dir = path.join(contentDir, "letters");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const letters = await Promise.all(
    files.map(async (f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      const slug = f.replace(/\.md$/, "");
      const html = await markdownToHtml(content);
      return {
        slug,
        title: (data.title as string) || slug,
        date: formatDate(data.date),
        body: content,
        html,
      };
    })
  );

  return letters.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getLetterBySlug(slug: string): Promise<Letter | null> {
  const filePath = path.join(contentDir, "letters", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const html = await markdownToHtml(content);

  return {
    slug,
    title: (data.title as string) || slug,
    date: formatDate(data.date),
    body: content,
    html,
  };
}

export function getAboutContent(): string {
  const filePath = path.join(contentDir, "pages", "about.html");
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8");
}
