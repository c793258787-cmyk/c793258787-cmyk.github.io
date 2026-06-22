"use client";

import Link from "next/link";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import type { SearchResult } from "@/lib/services/search.service";

const emptyResults: SearchResult = { monsters: [], items: [] };

type SearchBarProps = {
  variant?: "hero" | "nav";
};

export function SearchBar({ variant = "hero" }: SearchBarProps) {
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>(emptyResults);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [error, setError] = useState("");
  const isNav = variant === "nav";

  useEffect(() => {
    if (!isNav) return;

    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsPanelOpen(false);
    }

    window.addEventListener("keydown", focusSearch);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      window.removeEventListener("keydown", focusSearch);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [isNav]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim();
    setHasSearched(true);
    setError("");
    if (isNav) setIsPanelOpen(false);

    if (!normalizedQuery) {
      setResults(emptyResults);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(normalizedQuery)}`);
      if (!response.ok) throw new Error("Search request failed");
      setResults((await response.json()) as SearchResult);
      if (isNav) setIsPanelOpen(true);
    } catch {
      setResults(emptyResults);
      setError("搜索暂时不可用，请稍后再试。");
      if (isNav) setIsPanelOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  const hasResults = results.monsters.length > 0;
  const showPanel = hasSearched || hasResults || Boolean(error);
  const panelVisible = showPanel && (!isNav || isPanelOpen);

  return (
    <div
      ref={containerRef}
      className={isNav ? "relative w-full lg:w-80" : "relative w-full max-w-2xl"}
      onBlur={(event) => {
        if (isNav && !event.currentTarget.contains(event.relatedTarget)) setIsPanelOpen(false);
      }}
    >
      <div className={isNav ? undefined : "search-focus-shell"}>
        <form onSubmit={handleSubmit} role="search" className="search-focus-inner relative">
          <label htmlFor={inputId} className="sr-only">搜索怪物</label>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => {
              if (isNav && showPanel) setIsPanelOpen(true);
            }}
            onClick={() => {
              if (isNav && showPanel) setIsPanelOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && isNav) {
                setIsPanelOpen(false);
                event.currentTarget.blur();
              }
            }}
            placeholder="搜索怪物 (支持拼音简写...)"
            autoComplete="off"
            className={`search-focus-input ${isNav ? "h-9 pr-14 text-sm" : "h-12 pr-20 text-sm sm:text-base"} w-full rounded-md border border-zinc-800/60 bg-zinc-900 px-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none`}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded border border-zinc-700/80 bg-zinc-800 font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-100 disabled:opacity-50 ${isNav ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"}`}
            aria-label="搜索"
          >
            {isLoading ? "..." : isNav ? "⌘K" : "搜索"}
          </button>
        </form>
      </div>

      <div
        aria-live="polite"
        aria-busy={isLoading}
        className={panelVisible ? "absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-zinc-800/60 bg-panel p-3 shadow-2xl shadow-black/30" : "hidden"}
      >
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        {hasSearched && !isLoading && !error && !hasResults ? <p className="text-sm text-zinc-400">没有找到匹配结果。</p> : null}
        {hasResults ? (
          <div className="grid gap-3 text-left">
            <ResultGroup title="怪物">
              {results.monsters.map((monster) => (
                <Link key={monster.id} href={`/monsters/${monster.slug}`} onClick={() => setIsPanelOpen(false)} className="flex items-center justify-between gap-3 rounded px-2 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-800/70">
                  <span className="font-medium">{monster.name}</span>
                  <span className="shrink-0 text-amber-400">{monster.level} 级</span>
                </Link>
              ))}
            </ResultGroup>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="px-2 pb-1 text-xs font-medium text-zinc-500">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
