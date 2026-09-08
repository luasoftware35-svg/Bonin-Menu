"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuFooter } from "@/components/menu/MenuFooter";
import { GenuaPartner } from "@/components/menu/GenuaPartner";
import { MenuHero } from "@/components/menu/MenuHero";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { ProductCard } from "@/components/menu/ProductCard";
import { normalizeSearchQuery, searchMenuProducts } from "@/lib/search";
import type { MenuData, Product } from "@/lib/types";

const ProductSheet = dynamic(
  () =>
    import("@/components/menu/ProductSheet").then((mod) => mod.ProductSheet),
  { ssr: false },
);

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.04 },
  },
};

export function MenuView({ menu }: { menu: MenuData }) {
  const categories = menu.categories.filter(
    (category) => category.products.length > 0,
  );
  const firstId = categories[0]?.id ?? "";
  const [activeId, setActiveId] = useState(firstId);
  const [selected, setSelected] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const isSearching = normalizeSearchQuery(searchQuery).length > 0;

  const searchResults = useMemo(
    () => searchMenuProducts(categories, searchQuery),
    [categories, searchQuery],
  );

  function handleCategorySelect(id: string) {
    setSearchQuery("");
    setActiveId(id);
  }

  return (
    <div className="menu-canvas">
      <div className="mx-auto min-h-dvh w-full max-w-menu pb-[max(1rem,env(safe-area-inset-bottom))]">
        <MenuHero
          tenant={menu.tenant}
          ticker={categories.map((category) => category.name)}
        />
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
                  className="grid grid-cols-2 gap-2 sm:gap-2.5"
                  variants={gridVariants}
                  initial="hidden"
                  animate="show"
                >
                  {searchResults.map(({ product, categoryName }) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      categoryName={categoryName}
                      currency={menu.tenant.currency}
                      locale={menu.tenant.locale}
                      onOpen={setSelected}
                    />
                  ))}
                </motion.div>
              ) : (
                <p className="rounded-[1.25rem] bg-white/80 px-4 py-5 text-center text-sm text-mute ring-1 ring-black/5">
                  Aradığın ürün bulunamadı. Kategorilere göz atmayı dene.
                </p>
              )}
            </motion.section>
          ) : active ? (
            <motion.section
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
                    onOpen={setSelected}
                  />
                ))}
              </motion.div>
            </motion.section>
          ) : null}
        </main>
        <MenuFooter tenant={menu.tenant} />
        <GenuaPartner />
        <ProductSheet
          product={selected}
          currency={menu.tenant.currency}
          locale={menu.tenant.locale}
          onClose={() => setSelected(null)}
        />
      </div>
    </div>
  );
}
