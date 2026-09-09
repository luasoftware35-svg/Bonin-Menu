import type { Category, Product } from "@/lib/types";

export const FEATURED_PRODUCT_NAME = "Çilekli Magnolya";

export function findFeaturedProduct(
  categories: Category[],
): { product: Product; categoryName: string } | null {
  for (const category of categories) {
    const product = category.products.find(
      (entry) => entry.name === FEATURED_PRODUCT_NAME,
    );
    if (product) {
      return { product, categoryName: category.name };
    }
  }

  const firstCategory = categories[0];
  const firstProduct = firstCategory?.products[0];
  if (!firstProduct || !firstCategory) return null;

  return { product: firstProduct, categoryName: firstCategory.name };
}
