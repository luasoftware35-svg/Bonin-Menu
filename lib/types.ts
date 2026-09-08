export type Tenant = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  slogan: string | null;
  logoUrl: string | null;
  address: string;
  hours: string;
  instagram: string | null;
  mapsUrl: string | null;
  currency: string;
  locale: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number | null;
  imageUrl: string | null;
  allergens: string[];
  energyKcal: number | null;
  portionNote: string | null;
  ingredientsNote: string | null;
  isAvailable: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  products: Product[];
};

export type MenuData = {
  tenant: Tenant;
  categories: Category[];
};
