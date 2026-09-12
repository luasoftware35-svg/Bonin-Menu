-- Ürün kalori bilgisi (kcal / porsiyon)
alter table public.products
  add column if not exists energy_kcal int check (energy_kcal is null or energy_kcal >= 0);

comment on column public.products.energy_kcal is 'Enerji değeri (kcal), portion_note ile birlikte gösterilir';
