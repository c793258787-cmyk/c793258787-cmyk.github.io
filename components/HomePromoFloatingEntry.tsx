import { HomePromoFloating } from "@/components/HomePromoFloating";
import { getHomePromo } from "@/lib/home-promo";

export function HomePromoFloatingEntry() {
  const promo = getHomePromo();
  if (!promo) return null;
  return <HomePromoFloating promo={promo} />;
}
