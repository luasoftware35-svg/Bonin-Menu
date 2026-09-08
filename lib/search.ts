import type { Category, Product } from "@/lib/types";

export type SearchResult = {
  product: Product;
  categoryId: string;
  categoryName: string;
};

export function normalizeSearchQuery(query: string) {
  return query.trim().toLocaleLowerCase("tr");
}

export function searchMenuProducts(
  categories: Category[],
  query: string,
): SearchResult[] {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return [];

  const results: SearchResult[] = [];

  for (const category of categories) {
    for (const product of category.products) {
      const haystack = [
        product.name,
        product.description,
        product.ingredientsNote ?? "",
        category.name,
      ]
        .join(" ")
        .toLocaleLowerCase("tr");

      if (haystack.includes(normalized)) {
        results.push({
          product,
          categoryId: category.id,
          categoryName: category.name,
        });
      }
    }
  }

  return results;
}
