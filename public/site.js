// Plates that follow the pointer, a page that grows out of its plate,
// and the gradient playground. The page works without this file: dialogs open
// by invoker commands and a plate shows over its name on hover.
(() => {
  const html = document.documentElement;
  html.classList.add("js");
  try {
    if (localStorage.getItem("drafts") === "1") html.classList.add("drafts");
  } catch {}
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");

  /* --- plates: over the line under the pointer, eased toward it --- */

  let over = null;
  let px = 0;
  let py = 0;
  let cx = 0;
  let ct = 0;
  let frame = 0;

  function lineAt(el, y) {
    const lines = [...el.getClientRects()];
    return (
      lines.find((r) => y >= r.top && y <= r.bottom) ||
      lines[0] ||
      el.getBoundingClientRect()
    );
  }

  function place(snap) {
    const peek = over && over.querySelector(".peek");
    if (!peek) {
      frame = 0;
      return;
    }
    const w = peek.offsetWidth;
    const h = peek.offsetHeight;
    const line = lineAt(over, py);
    let top = line.top - h - 14;
    if (top < 16) top = line.bottom + 14;
    if (snap || still.matches) {
      cx = px;
      ct = top;
    } else {
      cx += (px - cx) * 0.16;
      ct += (top - ct) * 0.16;
    }
    const left = Math.min(Math.max(16, cx - w / 2), innerWidth - w - 16);
    peek.style.setProperty("--x", `${left}px`);
    peek.style.setProperty("--y", `${ct}px`);
    const moving =
      !snap &&
      !still.matches &&
      (Math.abs(px - cx) > 0.3 || Math.abs(top - ct) > 0.3);
    frame = moving ? requestAnimationFrame(() => place(false)) : 0;
  }

  function show(work, x, y) {
    if (over && over !== work) delete over.dataset.peek;
    over = work;
    px = x;
    py = y;
    place(true);
    work.dataset.peek = "";
  }
  function hide() {
    if (over) delete over.dataset.peek;
    over = null;
  }
  function showAt(work) {
    const r = work.getClientRects()[0] || work.getBoundingClientRect();
    show(work, r.left + r.width / 2, r.top + r.height / 2);
  }

  document.addEventListener("pointerover", (event) => {
    if (!fine.matches) return;
    const work = event.target.closest?.(".work");
    if (work && work !== over) show(work, event.clientX, event.clientY);
  });
  document.addEventListener("pointermove", (event) => {
    if (!over) return;
    px = event.clientX;
    py = event.clientY;
    if (!frame) frame = requestAnimationFrame(() => place(false));
  });
  addEventListener(
    "scroll",
    () => {
      if (!over) return;
      if (!fine.matches) hide();
      else if (!frame) frame = requestAnimationFrame(() => place(false));
    },
    { passive: true },
  );
  document.addEventListener("pointerout", (event) => {
    if (!fine.matches || !over || over.contains(event.relatedTarget)) return;
    if (event.target.closest?.(".work") === over) hide();
  });
  document.addEventListener("focusin", (event) => {
    const work = event.target.closest?.(".work");
    if (work && work !== over && work.matches(":focus-visible")) showAt(work);
  });
  document.addEventListener("focusout", (event) => {
    if (over && event.target === over) hide();
  });

  /* --- pages: a plate grows into its page, and the page shrinks back --- */

  const morphs = () =>
    typeof document.startViewTransition === "function" && !still.matches;
  const openers = new WeakMap();

  function morph(change, from, to) {
    if (!morphs()) return change();
    if (from) from.style.viewTransitionName = "work";
    html.dataset.morph = "";
    const t = document.startViewTransition(() => {
      if (from) from.style.viewTransitionName = "";
      if (to) to.style.viewTransitionName = "work";
      change();
    });
    t.finished.finally(() => {
      if (to) to.style.viewTransitionName = "";
      delete html.dataset.morph;
    });
  }

  /** The preview a list row is showing, when the opener sits in one. */
  function framed(opener) {
    const row = opener && opener.closest("li");
    const list = row && row.closest('[data-slot="interactive-list-preview"]');
    if (!list) return null;
    const frame =
      list.children[1]?.children[[...row.parentElement.children].indexOf(row)];
    return frame && getComputedStyle(frame).visibility === "visible"
      ? frame
      : null;
  }

  function open(dialog, opener, push) {
    if (dialog.open || !dialog.isConnected) return;
    const hero = dialog.querySelector("[data-hero]");
    const peek =
      opener &&
      opener.dataset.peek !== undefined &&
      opener.querySelector(".peek");
    openers.set(dialog, opener || null);
    morph(
      () => {
        if (opener) delete opener.dataset.peek;
        if (over === opener) over = null;
        if (!dialog.isConnected || dialog.open) return;
        dialog.showModal();
        if (!opener) dialog.focus();
        dialog.scrollTop = 0;
        if (push) history.pushState({ work: dialog.id }, "", `#${dialog.id}`);
      },
      hero ? peek || framed(opener) || opener : null,
      hero,
    );
  }

  function shut(dialog) {
    if (!dialog.open) return;
    const hero =
      dialog.scrollTop < innerHeight / 2
        ? dialog.querySelector("[data-hero]")
        : null;
    morph(() => dialog.close(), hero, openers.get(dialog));
  }

  document.addEventListener(
    "command",
    (event) => {
      const dialog = event.target;
      if (
        !(dialog instanceof HTMLDialogElement) ||
        !dialog.classList.contains("case")
      )
        return;
      if (event.command === "show-modal") {
        event.preventDefault();
        open(dialog, event.source, true);
      } else if (
        event.command === "close" ||
        event.command === "request-close"
      ) {
        event.preventDefault();
        shut(dialog);
      }
    },
    true,
  );

  if (!("command" in HTMLButtonElement.prototype)) {
    document.addEventListener("click", (event) => {
      const button = event.target.closest?.("button[commandfor]");
      const dialog =
        button && document.getElementById(button.getAttribute("commandfor"));
      if (!(dialog instanceof HTMLDialogElement)) return;
      if (button.getAttribute("command") === "show-modal")
        open(dialog, button, true);
      else shut(dialog);
    });
  }

  document.addEventListener(
    "cancel",
    (event) => {
      const dialog = event.target;
      if (
        !(dialog instanceof HTMLDialogElement) ||
        !dialog.classList.contains("case")
      )
        return;
      event.preventDefault();
      shut(dialog);
    },
    true,
  );

  document.addEventListener(
    "close",
    (event) => {
      const dialog = event.target;
      if (!(dialog instanceof HTMLDialogElement)) return;
      if (history.state && history.state.work === dialog.id) history.back();
      else if (location.hash === `#${dialog.id}`)
        history.replaceState(null, "", location.pathname + location.search);
    },
    true,
  );

  function follow() {
    const id = decodeURIComponent(location.hash.slice(1));
    for (const dialog of document.querySelectorAll("dialog.case[open]"))
      if (dialog.id !== id) shut(dialog);
    const target = id && document.getElementById(id);
    if (
      target instanceof HTMLDialogElement &&
      target.classList.contains("case")
    )
      open(target, null, false);
  }
  addEventListener("popstate", follow);
  follow();

  /* --- the playground: a seed, a palette, a mood and a shape pick a tile --- */

  function mulberry32(seed) {
    let t = seed | 0;
    return () => {
      t = (t + 0x6d2b79f5) | 0;
      let x = Math.imul(t ^ (t >>> 15), 1 | t);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pickTile(tiles, seed, mood, palette) {
    let pool = tiles;
    if (mood) pool = pool.filter((t) => t.mood === mood);
    if (palette) pool = pool.filter((t) => t.palette === palette);
    if (pool.length === 0) pool = tiles;
    const n = pool.length;
    if (!mood && !palette) return pool[(((seed - 1) % n) + n) % n];
    const next = mulberry32(seed >>> 0);
    next();
    next();
    next();
    return pool[Math.floor(next() * n)];
  }

  const SHAPES = { wide: "2 / 1", square: "1 / 1", tall: "4 / 5" };

  const labs = new WeakMap();

  function labState(lab) {
    if (!labs.has(lab))
      labs.set(lab, {
        tiles: JSON.parse(lab.dataset.tiles).map(
          ([id, mood, palette, tone]) => ({
            id,
            mood,
            palette,
            tone,
          }),
        ),
        seed: 42,
        palette: "",
        mood: "",
        shape: "wide",
        shown: "",
      });
    return labs.get(lab);
  }

  const fits = (tiles, mood, palette) =>
    tiles.some(
      (t) => (!mood || t.mood === mood) && (!palette || t.palette === palette),
    );

  function renderLab(lab, state) {
    const $ = (name) => lab.querySelector(`[data-lab-${name}]`);
    const img = $("img");
    const tile = pickTile(state.tiles, state.seed, state.mood, state.palette);
    const src = new URL(`${tile.id}.webp`, img.src).href;
    lab.querySelector(".lab-plate").style.backgroundColor = tile.tone;
    if (src !== (state.shown || img.src)) {
      state.shown = src;
      img.style.opacity = "0";
      const next = new Image();
      next.src = src;
      next
        .decode()
        .catch(() => {})
        .then(() => {
          if (state.shown !== src) return;
          img.src = src;
          img.style.opacity = "1";
        });
    }
    $("seed").textContent = state.seed;
    $("seedline").textContent = `Seed ${state.seed}`;
    $("id").textContent = tile.id;
    lab.querySelector(".lab-stage").dataset.shape = state.shape;
    for (const chip of lab.querySelectorAll("[data-lab-set]")) {
      const group = chip.dataset.labSet;
      chip.setAttribute("aria-pressed", String(state[group] === chip.value));
      const empty =
        (group === "mood" && !fits(state.tiles, chip.value, state.palette)) ||
        (group === "palette" && !fits(state.tiles, state.mood, chip.value));
      chip.toggleAttribute("data-empty", empty);
    }
    const attrs = [`seed={${state.seed}}`];
    if (state.palette) attrs.push(`palette="${state.palette}"`);
    if (state.mood) attrs.push(`mood="${state.mood}"`);
    attrs.push(`style={{ aspectRatio: "${SHAPES[state.shape]}" }}`);
    $("code").textContent = `<Gradient ${attrs.join(" ")} />`;
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-lab] button");
    if (!button) return;
    const lab = button.closest("[data-lab]");
    const state = labState(lab);
    const group = button.dataset.labSet;
    if (group) {
      state[group] = button.value;
      if (!fits(state.tiles, state.mood, state.palette))
        state[group === "palette" ? "mood" : "palette"] = "";
    } else if (button.dataset.labStep) {
      state.seed = Math.max(1, state.seed + Number(button.dataset.labStep));
    } else if (button.dataset.labShuffle !== undefined) {
      state.seed = 1 + Math.floor(Math.random() * 9999);
    }
    renderLab(lab, state);
  });

  document.addEventListener("input", (event) => {
    if (!event.target.matches?.("[data-lab-text]")) return;
    const name = event.target
      .closest("[data-lab]")
      .querySelector("[data-lab-name]");
    name.textContent = event.target.value;
    name.hidden = !event.target.value;
  });
})();
