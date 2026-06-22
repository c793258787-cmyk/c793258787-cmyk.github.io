import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-semibold text-rose-500">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-100">页面不存在</h1>
      <p className="mt-3 text-zinc-400">你访问的工具页面暂时还没有收录。</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:border-zinc-600"
      >
        返回首页
      </Link>
    </section>
  );
}
