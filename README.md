# Ahnik

Arti, stuti and kirtan lyrics with the Gujarati line on top and its transliteration beneath, each page paired with a YouTube recording to sing along with.

## Pages

| Page | Sections | Recording |
| --- | --- | --- |
| Morning Arti | Arti, Stuti Ashtak | [YouTube](https://youtu.be/U5xYAEqDMlc) |
| Evening Arti (સંધ્યા આરતી) | Arti, Dhun, Swaminarayan Ashtak, Prarthana, Stuti Ashtak | [YouTube](https://youtu.be/6QZZ2ZkgVuU) |
| Arti (આરતી) | Arti | [YouTube](https://youtu.be/6q9MD8R146c) |
| Godi (ગોડી) | Pad 1–4, Sadguru Brahmanand Swami | [YouTube](https://youtu.be/E6gqZSIC9ik) |

Live: https://teejpaddle.github.io/ahnik/ — each lyric has its own link, such as https://teejpaddle.github.io/ahnik/arti/

## How it's built

A static site with no build step: `index.html`, `assets/css/styles.css`, `assets/js/data.js` (all lyrics) and `assets/js/app.js` (hash routing, section tabs, text size). The look follows the warm-black, saffron design system: Instrument Serif titles, SF Pro (`assets/fonts/SF-Pro.ttf`) for UI and transliteration, Noto Sans Gujarati for Gujarati.

Run it locally with any static server, for example:

```bash
python3 -m http.server 8000
```

### Adding a kirtan

Add an entry to `window.AHNIK_ITEMS` in `assets/js/data.js`:

```js
{
  id: "my-kirtan",            // used in the URL: #/my-kirtan
  category: "kirtan",          // "arti" or "kirtan"
  gu: "ગુજરાતી નામ",
  en: "English name",
  video: { id: "YOUTUBE_ID", url: "https://youtu.be/YOUTUBE_ID" },
  sections: [
    {
      id: "pad-1", gu: "પદ - ૧", en: "Pad - 1",
      verses: [
        { refrain: true, lines: [["ગુજરાતી ટેક…", "Transliterated refrain…"]] },
        { n: 1, lines: [["ગુજરાતી પંક્તિ", "Transliterated line"]] },
      ],
    },
  ],
}
```

Then generate its page (and refresh the others) so it gets a clean URL like `/ahnik/my-kirtan/`:

```bash
node tools/build-pages.mjs
```

## Hosting

Works as-is on GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.
