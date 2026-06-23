export type BreadcrumbItem = {
  label: string;
  href?: string;
};

/** 首页 + 路径段；最后一段为当前页（不可点击） */
export function breadcrumbs(...trail: BreadcrumbItem[]): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: "首页", href: "/" }];

  trail.forEach((item, index) => {
    const isLast = index === trail.length - 1;
    items.push(isLast ? { label: item.label } : item);
  });

  return items;
}

export function homeBreadcrumbs(): BreadcrumbItem[] {
  return [{ label: "首页" }];
}
