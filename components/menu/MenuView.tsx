"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { CompactHeader } from "@/components/menu/CompactHeader";
import { EmptySearchState } from "@/components/menu/EmptySearchState";
import { FeaturedCarousel } from "@/components/menu/FeaturedCarousel";
import { MenuFooter } from "@/components/menu/MenuFooter";
import { GenuaPartner } from "@/components/menu/GenuaPartner";
import { MenuHero } from "@/components/menu/MenuHero";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { ProductCard } from "@/components/menu/ProductCard";
import { ProductSheet } from "@/components/menu/ProductSheet";
import { getDailyFeaturedProducts } from "@/lib/featured";
import { categorySlideVariants } from "@/lib/motion";
import { normalizeSearchQuery, searchMenuProducts } from "@/lib/search";
import { useScrollCompact } from "@/lib/useScrollCompact";
import type { MenuData, Product } from "@/lib/types";

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

export function MenuView({ menu }: { menu: MenuData }) {
  const categories = menu.categories.filter(
    (category) => category.products.length > 0,
  );
  const firstId = categories[0]?.id ?? "";
  const [activeId, setActiveId] = useState(firstId);
  const [selected, setSelected] = useState<Product | null>(null);
  const [photoSource, setPhotoSource] = useState<"featured" | "grid" | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const directionRef = useRef(0);
  const { progress: scrollProgress, compact } = useScrollCompact();

  const navItems = useMemo(
    () =>
      categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        name: category.name,
        cover: category.products[0]?.imageUrl ?? null,
      })),
    [categories],
  );

  const active = useMemo(
    () => categories.find((category) => category.id === activeId) ?? categories[0],
    [activeId, categories],
  );

  const dailyFeatured = useMemo(
    () => getDailyFeaturedProducts(categories),
    [categories],
  );

  const featuredIds = useMemo(
    () => new Set(dailyFeatured.map((entry) => entry.product.id)),
    [dailyFeatured],
  );

  const isSearching = normalizeSearchQuery(searchQuery).length > 0;

  const searchResults = useMemo(
    () => searchMenuProducts(categories, searchQuery),
    [categories, searchQuery],
  );

  function handleCategorySelect(id: string) {
    const nextIndex = categories.findIndex((category) => category.id === id);
    const currentIndex = categories.findIndex(
      (category) => category.id === activeId,
    );
    directionRef.current =
      nextIndex === currentIndex ? 0 : nextIndex > currentIndex ? 1 : -1;
    setSearchQuery("");
    setActiveId(id);
  }

  function openProduct(product: Product, source: "featured" | "grid") {
    setPhotoSource(source);
    setSelected(product);
  }

  function closeProduct() {
    setSelected(null);
    setPhotoSource(null);
  }

  return (
    <LayoutGroup id="bonin-menu">
      <div className="menu-canvas">
        <CompactHeader tenant={menu.tenant} visible={compact} />
        <div className="mx-auto min-h-dvh w-full max-w-menu pb-[max(1rem,env(safe-area-inset-bottom))]">
          <MenuHero
            tenant={menu.tenant}
            ticker={categories.map((category) => category.name)}
            scrollProgress={scrollProgress}
          />
          {dailyFeatured.length > 0 && !isSearching ? (
            <FeaturedCarousel
              items={dailyFeatured}
              currency={menu.tenant.currency}
              locale={menu.tenant.locale}
              selectedId={selected?.id ?? null}
              photoSource={photoSource}
              onOpen={(product) => openProduct(product, "featured")}
            />
          ) : null}
          <CategoryNav
            categories={navItems}
            activeId={activeId}
            onSelect={handleCategorySelect}
          />
          <div className="pt-3">
            <MenuSearch
              value={searchQuery}
              onChange={setSearchQuery}
              resultCount={isSearching ? searchResults.length : null}
            />
          </div>
          <main className="px-3 pb-4 pt-3 sm:px-4 sm:pt-4">
            {isSearching ? (
              <motion.section
                key="search-results"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                aria-labelledby="search-results-title"
              >
                <div className="mb-4 flex items-end justify-between">
                  <h2
                    id="search-results-title"
                    className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-cocoa"
                  >
                    Arama
                  </h2>
                  <p className="text-[11px] text-mute">
                    {searchResults.length} ürün
                  </p>
                </div>
                {searchResults.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-2 gap-2 sm:gap-2.5"
                  >
                    <AnimatePresence mode="popLayout">
                      {searchResults.map(({ product, categoryName }) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          categoryName={categoryName}
                          currency={menu.tenant.currency}
                          locale={menu.tenant.locale}
                          onOpen={(product) => openProduct(product, "grid")}
                          layout
                          liveFilter
                          sharedPhoto={
                            (!selected || selected.id !== product.id) &&
                            !featuredIds.has(product.id)
                          }
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <EmptySearchState />
                )}
              </motion.section>
            ) : active ? (
              <AnimatePresence mode="wait" custom={directionRef.current}>
                <motion.section
                  key={active.id}
                  custom={directionRef.current}
                  variants={categorySlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  aria-labelledby={`cat-${active.id}`}
                >
                  <div className="mb-4 flex items-end justify-between">
                    <h2
                      id={`cat-${active.id}`}
                      className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-cocoa"
                    >
                      {active.name}
                    </h2>
                    <p className="text-[11px] text-mute">
                      {active.products.length} ürün
                    </p>
                  </div>
                  <motion.div
                    className="grid grid-cols-2 gap-2 sm:gap-2.5"
                    variants={gridVariants}
                    initial="hidden"
                    animate="show"
                  >
                    {active.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        currency={menu.tenant.currency}
                        locale={menu.tenant.locale}
                        onOpen={(product) => openProduct(product, "grid")}
                        sharedPhoto={
                          (!selected ||
                            (selected.id === product.id &&
                              photoSource === "grid")) &&
                          !featuredIds.has(product.id)
                        }
                      />
                    ))}
                  </motion.div>
                </motion.section>
              </AnimatePresence>
            ) : null}
          </main>
          <MenuFooter tenant={menu.tenant} />
          <GenuaPartner />
          <ProductSheet
            product={selected}
            currency={menu.tenant.currency}
            locale={menu.tenant.locale}
            onClose={closeProduct}
          />
        </div>
      </div>
    </LayoutGroup>
  );
}
