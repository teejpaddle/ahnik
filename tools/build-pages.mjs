// Writes index.html and one <id>/index.html per lyric from assets/js/data.js,
// so every lyric has a clean URL (https://teejpaddle.github.io/ahnik/arti/).
// Run after adding or renaming a lyric:  node tools/build-pages.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const SITE = "https://teejpaddle.github.io/ahnik/";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, "assets/js/data.js"), "utf8"), sandbox);
const items = sandbox.window.AHNIK_ITEMS;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function page({ prefix, title, url }) {
  const description = "Gujarati lyrics with transliteration, and video.";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${esc(title)}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Ahnik" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}assets/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#0a0807" />
    <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Noto+Sans+Gujarati:wght@400;500;600&display=swap"
    />
    <link rel="stylesheet" href="${prefix}assets/css/styles.css" />
  </head>
  <body>
    <a class="skip-link" href="#main" onclick="var m = document.getElementById('main'); if (m) { m.focus(); } return false;">Skip to content</a>
    <div id="app"></div>
    <noscript>
      <p style="padding:24px;color:#cfc3b5">Ahnik needs JavaScript to show the lyrics.</p>
    </noscript>
    <script src="${prefix}assets/js/data.js"></script>
    <script src="${prefix}assets/js/app.js"></script>
  </body>
</html>
`;
}

writeFileSync(join(root, "index.html"), page({ prefix: "", title: "Ahnik", url: SITE }));
console.log(SITE);

for (const item of items) {
  const dir = join(root, item.id);
  mkdirSync(dir, { recursive: true });
  const url = `${SITE}${item.id}/`;
  writeFileSync(join(dir, "index.html"), page({ prefix: "../", title: `${item.en} · Ahnik`, url }));
  console.log(url);
}
