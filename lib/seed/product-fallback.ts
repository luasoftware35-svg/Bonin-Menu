import { boninMenu } from "@/lib/seed/bonin";

type SeedMeta = { energyKcal: number; portionNote: string };

const byName = new Map<string, SeedMeta>();

for (const category of boninMenu.categories) {
  for (const product of category.products) {
    byName.set(product.name.trim().toLocaleLowerCase("tr"), {
      energyKcal: product.energyKcal ?? 0,
      portionNote: product.portionNote ?? "porsiyon",
    });
  }
}

export function seedMetaForProductName(name: string): SeedMeta | null {
  return byName.get(name.trim().toLocaleLowerCase("tr")) ?? null;
}
