import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbs } from "@/lib/breadcrumbs";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <Breadcrumbs items={breadcrumbs({ label: "页面不存在" })} className="mb-8" />
      <div className="text-center">
        <p className="text-sm font-semibold text-rose-500">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-100">页面不存在</h1>
        <p className="mt-3 text-zinc-400">找不到这个页面，可能链接已失效或内容尚未收录。</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:border-zinc-600"
        >
          返回首页
        </Link>
      </div>
    </section>
  );
}
