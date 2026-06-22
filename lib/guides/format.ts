export function formatGuideDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return `${year} 年 ${month} 月 ${day} 日`;
}

export function categoryAccent(category: string) {
  switch (category) {
    case "练级":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "职业":
      return "text-sky-400 bg-sky-400/10 border-sky-400/20";
    case "装备":
      return "text-violet-400 bg-violet-400/10 border-violet-400/20";
    case "活动":
      return "text-rose-400 bg-rose-400/10 border-rose-400/20";
    default:
      return "text-zinc-300 bg-zinc-400/10 border-zinc-400/20";
  }
}
