import { HeroSwiper } from "./HeroSwiper";
import { CategorySection } from "./CategorySection";
import { FeaturedProducts } from "./FeaturedProducts";
import { CatalogHighlights } from "./CatalogHighlights";
import { BestSellers } from "./BestSellers";

export const HomePage = () => {
  return (
    <>
      <HeroSwiper />
      <CategorySection />
      <FeaturedProducts />
      <CatalogHighlights />
      <BestSellers />
    </>
  );
};
