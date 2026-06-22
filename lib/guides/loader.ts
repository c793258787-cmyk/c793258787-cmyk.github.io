import fs from "fs";
import path from "path";
import { guideCategories, type GuideCategory, type GuidePost, type GuidePostMeta } from "@/lib/guides/types";

const guidesDirectory = path.join(process.cwd(), "content/guides");

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw.trim() };
  }

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    meta[key] = value;
  }

  return { meta, body: match[2].trim() };
}

function assertCategory(value: string): GuideCategory {
  return (guideCategories as readonly string[]).includes(value) ? (value as GuideCategory) : "综合";
}

function toGuidePost(meta: Record<string, string>, body: string): GuidePost | null {
  if (!meta.slug || !meta.title || !meta.excerpt || !meta.publishedAt) {
    return null;
  }

  return {
    slug: meta.slug,
    title: meta.title,
    excerpt: meta.excerpt,
    category: assertCategory(meta.category ?? "综合"),
    tags: meta.tags ? meta.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
    publishedAt: meta.publishedAt,
    author: meta.author ?? "像素观察员",
    cover: meta.cover || undefined,
    douyinUrl: meta.douyinUrl || undefined,
    body
  };
}

function readGuideFile(fileName: string): GuidePost | null {
  const filePath = path.join(guidesDirectory, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontmatter(raw);
  return toGuidePost(meta, body);
}

export function getGuides(): GuidePost[] {
  if (!fs.existsSync(guidesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(guidesDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readGuideFile)
    .filter((post): post is GuidePost => post !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getGuide(slug: string): GuidePost | null {
  return getGuides().find((post) => post.slug === slug) ?? null;
}

export function getGuideMetas(): GuidePostMeta[] {
  return getGuides().map(({ body: _body, ...meta }) => meta);
}

export function getGuidesByCategory(category?: GuideCategory): GuidePost[] {
  const guides = getGuides();
  if (!category) return guides;
  return guides.filter((post) => post.category === category);
}
