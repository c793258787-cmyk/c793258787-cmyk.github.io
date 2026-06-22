export type MonsterListView = "card" | "list";
export type MonsterSortField = "level" | "exp";
export type MonsterSortOrder = "asc" | "desc";

export type MonsterListFilters = {
  q: string;
  levelMin: number | null;
  levelMax: number | null;
  view: MonsterListView;
  sort: MonsterSortField | null;
  order: MonsterSortOrder;
};

export type FilterableMonster = {
  name: string;
  slug: string;
  mapName: string;
  level: number;
  exp: number;
};

function parseParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parseLevel(value: string) {
  if (!value.trim()) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseSortField(value: string): MonsterSortField | null {
  return value === "level" || value === "exp" ? value : null;
}

function parseSortOrder(value: string): MonsterSortOrder {
  return value === "desc" ? "desc" : "asc";
}

export function parseMonsterListFilters(searchParams?: Record<string, string | string[] | undefined>): MonsterListFilters {
  const levelMin = parseLevel(parseParam(searchParams?.levelMin));
  const levelMax = parseLevel(parseParam(searchParams?.levelMax));
  const view = parseParam(searchParams?.view) === "list" ? "list" : "card";
  const sort = parseSortField(parseParam(searchParams?.sort));

  return {
    q: parseParam(searchParams?.q).trim(),
    levelMin: levelMin !== null && levelMax !== null && levelMin > levelMax ? levelMax : levelMin,
    levelMax: levelMin !== null && levelMax !== null && levelMin > levelMax ? levelMin : levelMax,
    view,
    sort,
    order: sort ? parseSortOrder(parseParam(searchParams?.order)) : "asc"
  };
}

export function filterMonsters<T extends FilterableMonster>(monsters: T[], filters: MonsterListFilters) {
  const query = filters.q.toLowerCase();

  return monsters.filter((monster) => {
    if (query) {
      const matched =
        monster.name.toLowerCase().includes(query) ||
        monster.slug.toLowerCase().includes(query) ||
        monster.mapName.toLowerCase().includes(query);
      if (!matched) return false;
    }

    if (filters.levelMin !== null && monster.level < filters.levelMin) return false;
    if (filters.levelMax !== null && monster.level > filters.levelMax) return false;

    return true;
  });
}

export function sortMonsters<T extends FilterableMonster>(monsters: T[], filters: MonsterListFilters) {
  const sort = filters.sort ?? "level";
  const order = filters.sort ? filters.order : "asc";
  const direction = order === "desc" ? -1 : 1;

  return [...monsters].sort((left, right) => {
    const diff = left[sort] - right[sort];
    if (diff !== 0) return diff * direction;
    return left.name.localeCompare(right.name, "zh-CN");
  });
}

export function monsterListQuery(filters: MonsterListFilters, page?: number) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.levelMin !== null) params.set("levelMin", String(filters.levelMin));
  if (filters.levelMax !== null) params.set("levelMax", String(filters.levelMax));
  if (filters.view === "list") params.set("view", "list");
  if (filters.sort) {
    params.set("sort", filters.sort);
    params.set("order", filters.order);
  }
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getEffectiveSort(filters: MonsterListFilters) {
  return filters.sort ?? "level";
}

export function getEffectiveOrder(filters: MonsterListFilters): MonsterSortOrder {
  return filters.sort ? filters.order : "asc";
}

export function monsterSortHref(filters: MonsterListFilters, field: MonsterSortField) {
  const currentSort = getEffectiveSort(filters);
  const currentOrder = getEffectiveOrder(filters);
  const order: MonsterSortOrder =
    currentSort === field ? (currentOrder === "asc" ? "desc" : "asc") : "asc";

  return `/monsters${monsterListQuery({ ...filters, sort: field, order })}`;
}

export function monsterListHref(filters: MonsterListFilters, view: MonsterListView) {
  return `/monsters${monsterListQuery({ ...filters, view })}`;
}

export function hasActiveMonsterFilters(filters: MonsterListFilters) {
  return Boolean(filters.q || filters.levelMin !== null || filters.levelMax !== null);
}
