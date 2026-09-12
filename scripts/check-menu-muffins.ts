import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getMenuBySlug } from "../lib/menu";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]!.trim();
    }
  } catch {
    /* ignore */
  }
}

loadEnvLocal();

async function main() {
  const menu = await getMenuBySlug("bonin");
  if (!menu) {
    console.log("Menü yok");
    process.exit(1);
  }
  const muffins = menu.categories
    .flatMap((c) => c.products)
    .filter((p) => p.name.toLocaleLowerCase("tr").includes("muffin"));
  console.log(JSON.stringify(muffins.map((p) => ({ name: p.name, id: p.id })), null, 2));
}

main();
