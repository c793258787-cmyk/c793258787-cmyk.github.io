import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getGuides } from "@/lib/guides/loader";
import { getSitemapRecords } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { monsters } = await getSitemapRecords();
  const guides = getGuides();

  return [
    { url: absoluteUrl("/"), lastModified: new Date() },
    { url: absoluteUrl("/monsters"), lastModified: new Date() },
    { url: absoluteUrl("/level-guide"), lastModified: new Date() },
    { url: absoluteUrl("/quiz"), lastModified: new Date() },
    { url: absoluteUrl("/community"), lastModified: new Date() },
    ...monsters.map((monster) => ({
      url: absoluteUrl(`/monsters/${monster.slug}`),
      lastModified: monster.updatedAt
    })),
    ...guides.map((guide) => ({
      url: absoluteUrl(`/level-guide/${guide.slug}`),
      lastModified: new Date(guide.publishedAt)
    }))
  ];
}
