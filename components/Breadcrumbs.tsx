import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";
import { absoluteUrl } from "@/lib/seo";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {})
    }))
  };

  const rootClassName = className ? `breadcrumbs ${className}` : "breadcrumbs";

  return (
    <nav aria-label="面包屑" className={rootClassName}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-zinc-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex min-w-0 items-center gap-1.5">
              {index > 0 ? (
                <span aria-hidden="true" className="text-zinc-600">
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link href={item.href} className="truncate transition-colors hover:text-zinc-200">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={`truncate ${isLast ? "text-zinc-300" : ""}`}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
