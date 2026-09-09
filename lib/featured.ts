import type { Category, Product } from "@/lib/types";

export type FeaturedEntry = {
  product: Product;
  categoryName: string;
};

function daySeed(date = new Date()) {
  return (
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate()
  );
}

function seededShuffle<T>(items: T[], seed: number) {
  const list = [...items];
  let state = seed >>> 0;

  for (let i = list.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [list[i], list[j]] = [list[j], list[i]];
  }

  return list;
}

export function getDailyFeaturedProducts(
  categories: Category[],
  min = 3,
  max = 5,
): FeaturedEntry[] {
  const pool = categories.flatMap((category) =>
    category.products.map((product) => ({
      product,
      categoryName: category.name,
    })),
  );

  if (pool.length === 0) return [];

  const seed = daySeed();
  const count = Math.min(
    pool.length,
    min + (seed % (max - min + 1)),
  );
  return seededShuffle(pool, seed).slice(0, count);
}
