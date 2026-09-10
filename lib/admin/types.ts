export type AdminTenant = {
  id: string;
  slug: string;
  name: string;
  defaultLocale: string;
};

export type AdminCategory = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
};

export type AdminProductListItem = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
};

export type AdminProductDetail = AdminProductListItem & {
  description: string;
  portionNote: string | null;
};
