# website

Oscar Antonio Borlund Orellana's site: one statement and the writing under it. The name in the statement shows a
photograph under the pointer and opens the About page; each company shows its plate (a light-through-paper tile under
grain, the role and months along the top and the logo or the name set large at the foot, every word in glass) and a
click grows the plate into a full-screen page about the work. The header's Work tab opens every role as the kit's
`InteractiveListPreview`, each row opening its page. Next.js 16 (App Router, static export) and MDX. The look is dark
only, Geist and Geist Mono, the diagonal ground, mono labels, square plates. The header keeps the time in Copenhagen and
San Francisco, with the sun or the moon as it is there.

- `npm ci`, then `npm run dev` serves it on :3150.
- `npm run check` is the lane: format, build (`out/`), types.
- `npm run artifact` builds and writes `artifact/`: the export with its CSS and `site.js` inlined, no other script and
  relative links, ready to publish as a claude.ai Artifact (the home page without its document wrapper, the publisher
  adds it).

## Deploying

Vercel builds it as it stands: import the repository, keep the detected Next.js settings, and add the domain,
oscaraborellana.com. The build is the static export in `out/`.

## How the pages work

The About, Work and company pages are native `<dialog>`s in the root layout, so every page can open them, opened by HTML
invoker commands (`commandfor`, `command="show-modal"`): they open, trap focus and close on Escape with no script at all,
and the published artifact has none of Next's. `public/site.js` is the one script, framework-free so the artifact keeps
it, and it listens on the document, so a React re-render never loses it. It keeps the clocks current (the sun's altitude
at each city decides sun or moon), places a plate or the photograph over the line under the pointer (or on keyboard
focus), morphs the plate, the photograph or a Work row's preview into the page's hero and back with a view transition,
gives each page an address (`/#rig`) that opens it and that Back closes, and runs the gradient playground.

## Writing

A post is one file in `writing/`, named by its address: `writing/<slug>.mdx` is `/writing/<slug>/`. All posts list on the
home page, newest first, in the kit's `InteractiveListPreview`: the white bar follows the pointer and each row reveals
the post itself, its opening paragraphs on a sheet laid on its tile. Without React (the artifact) the row under the
pointer lights and opens its sheet in CSS. A post opens with frontmatter and the build refuses one without the first
three fields; `plate` names its tile and defaults to one picked by the slug:

```mdx
---
title: Light through paper
date: 2026-10-02
summary: One sentence for the list and the page's description.
plate: fan-periwinkle-5
---

Markdown and JSX from here.
```

A link to another site opens in a new tab and `<Playground />` sets the gradient playground (`src/mdx-components.tsx`). A
post's images live in `public/media/<slug>/` and are set as `<figure>`s with a caption.

## Content

`src/profile.ts` holds the colophon, the About page's paragraphs, and the entries the statement and the Work page name
(newest first): each one's title, months (`from`, `to`), tags, paragraph, tile, logo, site and press link. A logo is a
trimmed image in `public/logos/` with its aspect; only its alpha is drawn, in glass, and every logo gets the same optical
area. The photograph is `public/oscar.jpg`. `public/tiles/` is the whole light-through-paper library and `src/tiles.ts`
its seed order, both copied from [sinbad-io/gradient](https://github.com/sinbad-io/gradient). `src/kit/` is the slice of
the Chapterhouse UI kit the site uses: `InteractiveListPreview`, the `cn` helper, the reduced-motion hook and the four
colour tokens it draws with.
