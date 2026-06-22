import Image from "next/image";
import Link from "next/link";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const external = href.startsWith("http");
      if (external) {
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-400 underline decoration-rose-400/40 underline-offset-2 hover:text-rose-300"
          >
            {label}
          </a>
        );
      }

      return (
        <Link key={index} href={href} className="text-rose-400 underline decoration-rose-400/40 underline-offset-2 hover:text-rose-300">
          {label}
        </Link>
      );
    }

    return part;
  });
}

function renderBlock(block: string, index: number) {
  const trimmed = block.trim();
  if (!trimmed) return null;

  const imageMatch = trimmed.match(/^!\[([^\]]*)\]\((\/[^)]+)\)$/);
  if (imageMatch) {
    const [, alt, src] = imageMatch;

    return (
      <figure key={index} className="my-8 overflow-hidden rounded-md border border-zinc-800/60 bg-zinc-950/50">
        <div className="relative aspect-video w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>
        {alt ? <figcaption className="border-t border-zinc-800/60 px-4 py-3 text-center text-xs text-zinc-500">{alt}</figcaption> : null}
      </figure>
    );
  }

  if (trimmed.startsWith("### ")) {
    return (
      <h3 key={index} className="guide-prose-h3">
        {renderInline(trimmed.slice(4))}
      </h3>
    );
  }

  if (trimmed.startsWith("## ")) {
    return (
      <h2 key={index} className="guide-prose-h2">
        {renderInline(trimmed.slice(3))}
      </h2>
    );
  }

  if (trimmed.startsWith("# ")) {
    return (
      <h1 key={index} className="guide-prose-h1">
        {renderInline(trimmed.slice(2))}
      </h1>
    );
  }

  if (/^(-|\d+\.) /m.test(trimmed)) {
    const items = trimmed.split("\n").filter(Boolean);
    const ordered = items.every((item) => /^\d+\./.test(item));

    if (ordered) {
      return (
        <ol key={index} className="guide-prose-ol">
          {items.map((item) => (
            <li key={item}>{renderInline(item.replace(/^\d+\.\s*/, ""))}</li>
          ))}
        </ol>
      );
    }

    return (
      <ul key={index} className="guide-prose-ul">
        {items.map((item) => (
          <li key={item}>{renderInline(item.replace(/^-\s*/, ""))}</li>
        ))}
      </ul>
    );
  }

  return (
    <p key={index} className="guide-prose-p">
      {renderInline(trimmed)}
    </p>
  );
}

export function GuideMarkdown({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return <article className="guide-prose">{blocks.map(renderBlock)}</article>;
}
