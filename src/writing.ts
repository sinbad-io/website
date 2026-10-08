import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";

export interface Post {
  readonly slug: string;
  readonly title: string;
  /** YYYY-MM-DD */
  readonly date: string;
  readonly summary: string;
  /** A tile of the light-through-paper library, in public/tiles/. */
  readonly plate: string;
  readonly minutes: number;
  /** The body's first paragraphs as plain text. */
  readonly opening: readonly string[];
  /** Built and reachable by its address, but listed only when drafts are shown. */
  readonly draft: boolean;
}

const DIR = join(process.cwd(), "writing");

const PLATES = ["wind-blue-1", "bloom-cyan-4", "wall-pink-4", "surf-lime-4"];

function plateFor(slug: string): string {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PLATES[h % PLATES.length]!;
}

function paragraphs(slug: string): string[] {
  return readFileSync(join(DIR, `${slug}.mdx`), "utf8")
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n\s*\n/)
    .filter((p) => !/^\s*(#|<|import |export )/.test(p))
    .map((p) =>
      p
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/<[^>]+>|[*_`>]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

function text(slug: string, field: string, value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value !== "string" || value.trim() === "")
    throw new Error(`writing/${slug}.mdx: frontmatter needs a ${field}`);
  return value.trim();
}

async function load(slug: string) {
  const mod: { default: ComponentType; frontmatter?: Record<string, unknown> } =
    await import(`../writing/${slug}.mdx`);
  const front = mod.frontmatter ?? {};
  const body = paragraphs(slug);
  const post: Post = {
    slug,
    title: text(slug, "title", front.title),
    date: text(slug, "date", front.date),
    summary: text(slug, "summary", front.summary),
    plate:
      typeof front.plate === "string" && front.plate
        ? front.plate
        : plateFor(slug),
    minutes: Math.max(1, Math.round(body.join(" ").split(" ").length / 220)),
    opening: body.slice(0, 3),
    draft: front.draft === true,
  };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date))
    throw new Error(`writing/${slug}.mdx: date is not YYYY-MM-DD`);
  return { post, Content: mod.default };
}

export function slugs(): string[] {
  return readdirSync(DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length));
}

export async function posts(): Promise<Post[]> {
  const all = await Promise.all(slugs().map(async (s) => (await load(s)).post));
  return all.sort((a, b) => b.date.localeCompare(a.date));
}

export const post = load;

const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(date: string): string {
  return DAY.format(new Date(`${date}T00:00:00Z`));
}
