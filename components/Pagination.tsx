import Link from "next/link";

type PaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  query?: string;
};

function visiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  return Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]))
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

function pageHref(basePath: string, page: number, query?: string) {
  const params = new URLSearchParams(query?.replace(/^\?/, "") ?? "");
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ basePath, currentPage, totalPages, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = visiblePages(currentPage, totalPages);

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="分页导航">
      <PageLink href={pageHref(basePath, Math.max(1, currentPage - 1), query)} disabled={currentPage === 1}>
        上一页
      </PageLink>
      {pages.map((page, index) => (
        <span key={page} className="contents">
          {index > 0 && page - pages[index - 1] > 1 ? <span className="px-1 text-zinc-600">...</span> : null}
          <Link
            href={pageHref(basePath, page, query)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors ${
              page === currentPage
                ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                : "border-zinc-800/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
            }`}
          >
            {page}
          </Link>
        </span>
      ))}
      <PageLink href={pageHref(basePath, Math.min(totalPages, currentPage + 1), query)} disabled={currentPage === totalPages}>
        下一页
      </PageLink>
    </nav>
  );
}

function PageLink({ href, disabled, children }: { href: string; disabled: boolean; children: string }) {
  return disabled ? (
    <span className="rounded-md border border-zinc-800/40 px-3 py-2 text-sm text-zinc-700" aria-disabled="true">
      {children}
    </span>
  ) : (
    <Link href={href} className="rounded-md border border-zinc-800/60 px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100">
      {children}
    </Link>
  );
}
