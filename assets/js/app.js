(function () {
  "use strict";

  const ITEMS = window.AHNIK_ITEMS || [];
  const CATEGORIES = window.AHNIK_CATEGORIES || [];
  const app = document.getElementById("app");
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Helpers ---------- */

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Gujarati text: escape, then lift the alternate-reading dagger into a superscript.
  const guText = (s) => esc(s).replace(/†/g, '<sup aria-label="see note">†</sup>');

  const icon = (paths, cls = "icon") =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths
      .map((d) => `<path d="${d}"/>`)
      .join("")}</svg>`;

  const ICONS = {
    arrowRight: icon(["M5 12h14", "m12 5 7 7-7 7"]),
    chevronLeft: icon(["m15 18-6-6 6-6"]),
    external: icon([
      "M15 3h6v6",
      "M10 14 21 3",
      "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
    ]),
  };

  const FLAME = `<svg class="wordmark__flame" viewBox="0 0 14 20" aria-hidden="true" focusable="false">
    <defs><linearGradient id="flame-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f8b868"/><stop offset="1" stop-color="#e08a24"/>
    </linearGradient></defs>
    <path fill="url(#flame-g)" d="M7 .8C7 .8 13.2 7.6 13.2 12.8A6.2 6.2 0 0 1 .8 12.8C.8 7.6 7 .8 7 .8Z"/>
  </svg>`;

  const store = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        /* storage unavailable: setting just won't persist */
      }
    },
  };

  /* ---------- Text size ---------- */

  const SCALES = [0.85, 1, 1.15, 1.3, 1.5, 1.75];
  const SCALE_KEY = "ahnik.textScale";
  let scaleIndex = (() => {
    const saved = parseInt(store.get(SCALE_KEY), 10);
    return Number.isInteger(saved) && saved >= 0 && saved < SCALES.length ? saved : 1;
  })();

  function applyScale() {
    root.style.setProperty("--lyric-scale", String(SCALES[scaleIndex]));
    const down = app.querySelector("[data-size='down']");
    const up = app.querySelector("[data-size='up']");
    const value = app.querySelector("[data-size-value]");
    if (down) down.disabled = scaleIndex === 0;
    if (up) up.disabled = scaleIndex === SCALES.length - 1;
    if (value) value.textContent = Math.round(SCALES[scaleIndex] * 100) + "%";
  }

  function changeScale(delta) {
    const next = Math.min(SCALES.length - 1, Math.max(0, scaleIndex + delta));
    if (next === scaleIndex) return;
    // Keep the line the reader is looking at in place while text grows or shrinks.
    const anchor = findAnchorLine();
    const before = anchor ? anchor.getBoundingClientRect().top : 0;
    scaleIndex = next;
    store.set(SCALE_KEY, String(scaleIndex));
    applyScale();
    if (anchor) window.scrollBy(0, anchor.getBoundingClientRect().top - before);
  }

  function findAnchorLine() {
    const offset = navOffset();
    const lines = app.querySelectorAll(".line");
    for (const line of lines) {
      if (line.getBoundingClientRect().bottom > offset) return line;
    }
    return null;
  }

  /* ---------- Shared chrome ---------- */

  function navOffset() {
    const nav = app.querySelector(".topnav");
    return nav ? nav.getBoundingClientRect().height : 0;
  }

  function footer() {
    return `<footer class="footer">
      <div class="container footer__inner">
        <a class="wordmark" href="#/" style="font-size:20px">${FLAME}Ahnik</a>
        <span>Gujarati lyrics with transliteration. Recordings play from YouTube.</span>
      </div>
    </footer>`;
  }

  function sectionNames(item) {
    return item.sections.map((s) => s.en.replace(/\s*-\s*/, " ")).join(" · ");
  }

  /* ---------- Home ---------- */

  function renderHome() {
    const hour = new Date().getHours();
    const suggested = ITEMS.find((i) => i.id === (hour < 12 ? "morning-arti" : "evening-arti"));

    const groups = CATEGORIES.map((cat) => {
      const items = ITEMS.filter((i) => i.category === cat.id);
      if (!items.length) return "";
      const rows = items
        .map((item) => {
          const titles = item.gu
            ? `<span class="row__gu" lang="gu">${esc(item.gu)}</span><span class="row__en">${esc(item.en)}</span>`
            : `<span class="row__en row__en--lead">${esc(item.en)}</span>`;
          const meta = [];
          if (item.sections.length > 1) meta.push(`<span>${esc(sectionNames(item))}</span>`);
          if (item.author) meta.push(`<span>${esc(item.author.en)}</span>`);
          if (item.video) meta.push(`<span>Recording</span>`);
          return `<li>
            <a class="row" href="#/${esc(item.id)}">
              <span>
                <span class="row__titles">${titles}</span>
                <span class="row__meta">${meta.join("")}</span>
              </span>
              <span class="row__arrow">${ICONS.arrowRight}</span>
            </a>
          </li>`;
        })
        .join("");
      return `<section class="library__group" aria-labelledby="cat-${esc(cat.id)}">
        <div class="library__head">
          <h2 class="library__heading" id="cat-${esc(cat.id)}">${esc(cat.en)} <span lang="gu">${esc(cat.gu)}</span></h2>
          <span class="library__count">${items.length} ${items.length === 1 ? "page" : "pages"}</span>
        </div>
        <ul class="library__list">${rows}</ul>
      </section>`;
    }).join("");

    app.innerHTML = `
      <div class="page">
        <div class="aura" aria-hidden="true"></div>
        <header class="topnav">
          <div class="container topnav__row">
            <a class="wordmark" href="#/" aria-label="Ahnik home">${FLAME}Ahnik</a>
            <span class="topnav__spacer"></span>
            <a class="topnav__back" href="#library" style="margin-left:0">All lyrics</a>
          </div>
        </header>
        <main id="main" tabindex="-1">
          <section class="hero container">
            <p class="overline reveal" style="--i:0"><span lang="gu">આહ્નિક</span> · Daily worship</p>
            <h1 class="hero__title reveal" style="--i:1" tabindex="-1">Ahnik <em>sing along, line by line</em></h1>
            <p class="hero__lede reveal" style="--i:2">Arti, stuti and kirtan with the Gujarati on top and its transliteration beneath, each beside a recording to follow.</p>
            ${
              suggested
                ? `<div class="hero__actions reveal" style="--i:3">
                    <a class="btn btn--primary" href="#/${esc(suggested.id)}">Open ${esc(suggested.en.toLowerCase())}</a>
                    <a class="textlink" href="#library">Browse all lyrics ${ICONS.arrowRight}</a>
                  </div>`
                : ""
            }
          </section>
          <div class="library container" id="library">${groups}</div>
        </main>
        ${footer()}
      </div>`;

    document.title = "Ahnik · Arti and kirtan lyrics";
  }

  /* ---------- Lyrics page ---------- */

  function renderVerse(verse) {
    const classes = ["verse"];
    if (verse.refrain) classes.push("verse--refrain");

    let label = "";
    if (verse.refrain) {
      label = `<p class="overline verse__label"><span lang="gu">ટેક</span><span class="en">Refrain</span></p>`;
    } else if (verse.label) {
      label = `<p class="overline verse__label"><span lang="gu">${esc(verse.label.gu)}</span><span class="en">${esc(verse.label.en)}</span></p>`;
    }

    const heading = verse.heading
      ? `<h3 class="verse__heading"><span class="verse__heading-gu" lang="gu">${esc(verse.heading.gu)}</span><span class="verse__heading-en">${esc(verse.heading.en)}</span></h3>`
      : "";

    const lines = verse.lines
      .map(
        ([gu, tr]) => `<div class="line">
          <p class="line__gu" lang="gu">${guText(gu)}</p>
          <p class="line__tr" lang="gu-Latn">${esc(tr)}</p>
        </div>`
      )
      .join("");

    return `<div class="${classes.join(" ")}">
      <div class="verse__num">${verse.n ? `<span class="visually-hidden">Verse </span>${verse.n}` : ""}</div>
      <div class="verse__body">${label}${heading}${lines}</div>
    </div>`;
  }

  function renderSection(item, section, index) {
    const notes = section.notes
      ? `<div class="notes">${section.notes.map((n) => `<p lang="gu">${esc(n)}</p>`).join("")}</div>`
      : "";
    const overline =
      item.sections.length > 1
        ? `<p class="overline">${index + 1} of ${item.sections.length}${section.ref ? ` · Ref. ${esc(section.ref)}` : ""}</p>`
        : section.ref
          ? `<p class="overline">Ref. ${esc(section.ref)}</p>`
          : "";
    return `<section class="lyrics-section" id="${esc(item.id)}--${esc(section.id)}" data-section="${esc(section.id)}" aria-labelledby="h-${esc(section.id)}-${index}">
      <header class="lyrics-section__head">
        ${overline}
        <h2 class="lyrics-section__title" id="h-${esc(section.id)}-${index}">
          <span lang="gu">${esc(section.gu)}</span><span class="en">${esc(section.en)}</span>
        </h2>
      </header>
      ${section.verses.map(renderVerse).join("")}
      ${notes}
    </section>`;
  }

  function renderItem(item, sectionId) {
    const multi = item.sections.length > 1;
    const tabs = multi
      ? `<nav class="tabs" aria-label="Sections">
          ${item.sections
            .map(
              (s, i) =>
                `<button type="button" class="tab" data-target="${esc(s.id)}" aria-current="${i === 0 ? "true" : "false"}">
                  <span lang="gu">${esc(s.gu)}</span><span class="tab__en">${esc(s.en)}</span>
                </button>`
            )
            .join("")}
        </nav>`
      : "";

    const meta = [];
    const cat = CATEGORIES.find((c) => c.id === item.category);
    if (cat) meta.push(`<span>${esc(cat.en)}</span>`);
    if (item.author) meta.push(`<span>${esc(item.author.en)}</span>`);
    if (item.ref) meta.push(`<span>Ref. ${esc(item.ref)}</span>`);
    if (multi) meta.push(`<span>${item.sections.length} sections</span>`);

    const video = item.video
      ? `<figure class="video">
          <div class="video__frame">
            <iframe
              src="https://www.youtube-nocookie.com/embed/${esc(item.video.id)}?rel=0&playsinline=1"
              title="${esc(item.en)} recording"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen></iframe>
          </div>
          <figcaption class="video__caption">
            <span>Recording</span>
            <a href="${esc(item.video.url)}" target="_blank" rel="noopener">Watch on YouTube ${ICONS.external}<span class="visually-hidden"> (opens in a new tab)</span></a>
          </figcaption>
        </figure>`
      : "";

    app.innerHTML = `
      <div class="page">
        <div class="aura aura--soft" aria-hidden="true"></div>
        <header class="topnav">
          <div class="container">
            <div class="topnav__row">
              <a class="topnav__back" href="#/">${ICONS.chevronLeft}<span>All lyrics</span></a>
              <span class="topnav__title" aria-hidden="true">${esc(item.en)}</span>
              <div class="textsize" role="group" aria-label="Lyrics text size">
                <button type="button" class="textsize__btn textsize__btn--down" data-size="down" aria-label="Smaller text">A</button>
                <span class="textsize__value" data-size-value aria-live="polite"></span>
                <button type="button" class="textsize__btn textsize__btn--up" data-size="up" aria-label="Larger text">A</button>
              </div>
            </div>
            ${tabs}
          </div>
        </header>
        <main id="main" class="container" tabindex="-1">
          <header class="item-head">
            <p class="overline reveal" style="--i:0">${item.author ? `<span lang="gu">${esc(item.author.gu)}</span>` : esc(cat ? cat.en : "")}</p>
            <h1 class="item-head__title reveal" style="--i:1" tabindex="-1">
              ${item.gu ? `<span class="item-head__gu" lang="gu">${esc(item.gu)}</span>` : ""}
              <span class="item-head__en">${esc(item.en)}</span>
            </h1>
            <p class="item-head__meta reveal" style="--i:2">${meta.join("")}</p>
          </header>
          <div class="item-layout">
            <aside class="item-layout__media reveal" style="--i:3" aria-label="Recording">${video}</aside>
            <article class="item-layout__lyrics reveal" style="--i:4">
              ${item.sections.map((s, i) => renderSection(item, s, i)).join("")}
            </article>
          </div>
        </main>
        ${footer()}
      </div>`;

    document.title = `${item.en} · Ahnik`;
    applyScale();
    wireItem(item, sectionId);
  }

  /* ---------- Lyrics page behaviour ---------- */

  let cleanup = [];

  function wireItem(item, sectionId) {
    const nav = app.querySelector(".topnav");
    const navTitle = app.querySelector(".topnav__title");
    const h1 = app.querySelector("h1");
    const tabs = Array.from(app.querySelectorAll(".tab"));
    const tabStrip = app.querySelector(".tabs");
    const sections = Array.from(app.querySelectorAll(".lyrics-section"));

    // Expose tab-row height so sticky video and section anchors clear the nav.
    const setTabsHeight = () => {
      const h = Math.max(0, nav.getBoundingClientRect().height - 64);
      root.style.setProperty("--tabs-h", h + "px");
    };
    setTabsHeight();
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(setTabsHeight);
      ro.observe(nav);
      cleanup.push(() => ro.disconnect());
    }

    // Show the item name in the nav once the page title scrolls away.
    if ("IntersectionObserver" in window && h1) {
      const io = new IntersectionObserver(
        ([entry]) => navTitle.classList.toggle("is-visible", !entry.isIntersecting),
        { rootMargin: "-64px 0px 0px 0px" }
      );
      io.observe(h1);
      cleanup.push(() => io.disconnect());
    }

    // Text size
    app.querySelector("[data-size='down']").addEventListener("click", () => changeScale(-1));
    app.querySelector("[data-size='up']").addEventListener("click", () => changeScale(1));

    if (!tabs.length) return;

    const setActive = (id) => {
      tabs.forEach((t) => {
        const on = t.dataset.target === id;
        t.setAttribute("aria-current", on ? "true" : "false");
        if (on && tabStrip) {
          const left = t.offsetLeft - tabStrip.clientWidth / 2 + t.clientWidth / 2;
          tabStrip.scrollTo({ left, behavior: reducedMotion.matches ? "auto" : "smooth" });
        }
      });
    };

    const goTo = (id, smooth) => {
      const target = sections.find((s) => s.dataset.section === id);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset() - 16;
      window.scrollTo({ top, behavior: smooth && !reducedMotion.matches ? "smooth" : "auto" });
      setActive(id);
      history.replaceState(null, "", `#/${item.id}/${id}`);
    };

    tabs.forEach((t) =>
      t.addEventListener("click", () => {
        goTo(t.dataset.target, true);
      })
    );

    // Scroll spy
    let ticking = false;
    let current = null;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const line = navOffset() + 24;
        let active = sections[0];
        for (const s of sections) {
          if (s.getBoundingClientRect().top <= line) active = s;
        }
        // At the very bottom, the last section is the one being read.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
          active = sections[sections.length - 1];
        }
        const id = active.dataset.section;
        if (id !== current) {
          current = id;
          setActive(id);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanup.push(() => window.removeEventListener("scroll", onScroll));

    if (sectionId) {
      // Wait a frame so layout (and fonts, where cached) settle before jumping.
      requestAnimationFrame(() => goTo(sectionId, false));
    }
  }

  /* ---------- Router ---------- */

  let currentKey = null;

  function parseHash() {
    const hash = window.location.hash || "";
    if (!hash.startsWith("#/")) return { view: "home", anchor: hash.slice(1) || null };
    const [id, section] = hash.slice(2).split("/");
    const item = ITEMS.find((i) => i.id === id);
    if (!item) return { view: "home" };
    return { view: "item", item, section: section || null };
  }

  function route() {
    const r = parseHash();
    const key = r.view === "item" ? "item:" + r.item.id : "home";

    // In-page anchor on the home page (e.g. #library): let the browser scroll.
    if (key === currentKey && r.view === "home") return;
    if (key === currentKey && r.view === "item") return;

    cleanup.forEach((fn) => fn());
    cleanup = [];
    currentKey = key;

    if (r.view === "item") {
      renderItem(r.item, r.section);
      if (!r.section) window.scrollTo(0, 0);
    } else {
      root.style.setProperty("--tabs-h", "0px");
      renderHome();
      if (r.anchor) {
        const el = document.getElementById(r.anchor);
        if (el) requestAnimationFrame(() => el.scrollIntoView());
      } else {
        window.scrollTo(0, 0);
      }
    }

    const h1 = app.querySelector("h1");
    if (h1 && document.readyState === "complete") h1.focus({ preventScroll: true });
  }

  window.addEventListener("hashchange", route);
  applyScale();
  route();
})();
