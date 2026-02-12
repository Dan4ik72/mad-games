/**
 * Генерация sitemap.xml из games.json при сборке.
 * Запуск: node scripts/generate-sitemap.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SITE_URL = "https://mad-games.ru";

// Читаем список игр
const gamesPath = join(ROOT, "src", "data", "games.json");
const games = JSON.parse(readFileSync(gamesPath, "utf-8"));

// Статические страницы
const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
];

// Динамические страницы из игр
const gamePages = games
    .filter((g) => g.isPublished)
    .map((g) => ({
        loc: `/game/${g.slug}`,
        priority: "0.8",
        changefreq: "monthly",
    }));

const allPages = [...staticPages, ...gamePages];

const today = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
        .map(
            (page) => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
        )
        .join("\n")}
</urlset>
`;

const outPath = join(ROOT, "public", "sitemap.xml");
writeFileSync(outPath, sitemap, "utf-8");
console.log(`✅ sitemap.xml generated with ${allPages.length} URLs → ${outPath}`);
