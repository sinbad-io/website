import {
  cpSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The static export as a claude.ai Artifact: the CSS inlined, site.js inlined
 * and no other script, every root path made relative and every page addressed
 * as its index.html.
 * The home page is written without its document wrapper, which the publisher
 * adds, so its body is held in the root's `dark` class; the other pages stay
 * whole documents.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
const dest = join(root, "artifact");

function pages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory())
      return entry.name === "_next" ||
        entry.name === "404" ||
        entry.name.startsWith("_")
        ? []
        : pages(path);
    return entry.name === "index.html" ? [path] : [];
  });
}

const site = readFileSync(join(out, "site.js"), "utf8").replace(
  /<\/script/gi,
  "<\\/script",
);

const css = (html) =>
  [
    ...html.matchAll(
      /<link rel="stylesheet" href="(\/_next\/[^"]+\.css)"[^>]*>/g,
    ),
  ]
    .map((m) => readFileSync(join(out, m[1]), "utf8"))
    .join("\n");

/** Without React the list cannot follow the pointer; the row under it lights beneath the previews and opens its own. */
function hover(html) {
  const count = (html.match(/group\/row/g) || []).length;
  const list = '[data-slot="interactive-list-preview"]';
  const rows = Array.from(
    { length: count },
    (_, i) =>
      `${list}:has(li:nth-child(${i + 1}):hover)>div:nth-child(2)>div:nth-child(${i + 1}){visibility:visible!important;clip-path:inset(0)!important}`,
  );
  return [
    `${list}>ul{z-index:auto}`,
    `${list} li::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--white);opacity:0;transition:opacity .35s}`,
    `${list} li:hover::before{opacity:1}`,
    `${list} li,${list} li>span{transition:color .35s}`,
    `${list} li:hover,${list} li:hover>span{color:var(--night-lo)}`,
    `${list}>div:nth-child(2)>div{transition:clip-path .6s cubic-bezier(.45,0,.55,1)}`,
    ...rows,
  ].join("\n");
}

function rewrite(html, page) {
  const self = "/" + relative(out, page).split("\\").join("/");
  const from = posix.dirname(self);
  const local = (url) => {
    const [path, hash = ""] = url.split("#");
    let target = path === "" ? "/" : path;
    if (target.endsWith("/")) target += "index.html";
    if (target === self && hash) return `#${hash}`;
    let rel = posix.relative(from, target);
    if (rel === "") rel = posix.basename(target);
    return rel + (hash ? `#${hash}` : "");
  };
  return html
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/g, (_, open) =>
      open.includes("data-keep") ? `<script>${site}</script>` : "",
    )
    .replace(/<link rel="stylesheet" href="\/_next\/[^"]+"[^>]*>/g, "")
    .replace(/<link[^>]+href="\/_next\/[^"]*"[^>]*>/g, "")
    .replace(/<link rel="preload"[^>]*as="script"[^>]*>/g, "")
    .replace(/<meta name="next-size-adjust"[^>]*>/g, "")
    .replace(/ (href|src)="\/(?!\/)([^"]*)"/g, (_, attr, rest) => {
      return ` ${attr}="${local("/" + rest)}"`;
    });
}

rmSync(dest, { recursive: true, force: true });
const written = [];
for (const page of pages(out)) {
  const html = readFileSync(page, "utf8");
  const style = `<style>${css(html)}\n${hover(html)}</style>`;
  let body = rewrite(html, page);
  const rel = relative(out, page);
  if (rel === "index.html") {
    const head = body.slice(
      body.indexOf("<head>") + 6,
      body.indexOf("</head>"),
    );
    const keep = [
      ...head.matchAll(
        /<title>[\s\S]*?<\/title>|<meta name="description"[^>]*>|<link rel="(?:preconnect|stylesheet)" href="https:\/\/fonts[^>]*>/g,
      ),
    ].map((m) => m[0]);
    const inner = body.slice(
      body.indexOf(">", body.indexOf("<body")) + 1,
      body.lastIndexOf("</body>"),
    );
    body = [
      '<meta charset="utf-8">',
      ...keep,
      style,
      `<div class="dark">${inner}</div>`,
      "",
    ].join("\n");
  } else {
    body = body.replace("</head>", `${style}</head>`);
  }
  const target = join(dest, rel);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, body);
  written.push(`${rel} ${(body.length / 1024).toFixed(0)} KB`);
}
for (const entry of readdirSync(join(root, "public")))
  if (entry !== "site.js")
    cpSync(join(out, entry), join(dest, entry), { recursive: true });
console.log(written.join("\n"));
