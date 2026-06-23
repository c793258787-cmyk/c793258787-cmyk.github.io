import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: string | null;
  imageAlt?: string;
  compact?: boolean;
  breadcrumbs?: BreadcrumbItem[];
};

export function PageHeader({ eyebrow, title, description, image, imageAlt, compact = false, breadcrumbs }: PageHeaderProps) {
  return (
    <section className="border-b border-zinc-800/50 bg-canvas">
      <div className={`mx-auto grid max-w-7xl items-center gap-8 px-4 lg:px-8 ${compact ? "py-8 sm:grid-cols-[minmax(0,1fr)_auto]" : "py-10 sm:grid-cols-[minmax(0,1fr)_10rem]"}`}>
        <div>
          {breadcrumbs?.length ? (
            <div className="mb-3">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          ) : null}
          {eyebrow ? <p className="text-sm font-medium text-rose-500">{eyebrow}</p> : null}
          <h1 className={`max-w-4xl font-semibold tracking-normal text-zinc-100 ${compact ? "mt-1 text-2xl sm:text-3xl" : "mt-2 text-4xl sm:text-5xl"}`}>{title}</h1>
          <p className={`max-w-3xl text-zinc-400 ${compact ? "mt-2 text-sm leading-6" : "mt-4 text-lg leading-8"}`}>{description}</p>
        </div>
        {image ? (
          <div className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40" data-monster-image>
            <Image
              src={image}
              alt={imageAlt || title}
              fill
              sizes="(min-width: 640px) 160px, 128px"
              className="object-contain [image-rendering:pixelated]"
              priority
              unoptimized
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
