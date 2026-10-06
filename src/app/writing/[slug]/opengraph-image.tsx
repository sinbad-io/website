import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { formatDate, post, slugs } from "@/writing";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "A page of writing on its light-through-paper tile";

export function generateStaticParams() {
  return slugs().map((slug) => ({ slug }));
}

const font = (file: string) => readFile(join(process.cwd(), "src/og", file));

/** The post as it previews on the site: its sheet on its tile, running off the foot. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { post: p } = await post((await params).slug);
  const tile = await sharp(
    join(process.cwd(), "public/tiles", `${p.plate}.webp`),
  )
    .resize(size.width, size.height, { fit: "cover" })
    .png()
    .toBuffer();
  const [regular, medium, mono] = await Promise.all([
    font("Geist-Regular.ttf"),
    font("Geist-Medium.ttf"),
    font("GeistMono-Regular.ttf"),
  ]);
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <img
        src={`data:image/png;base64,${tile.toString("base64")}`}
        width={size.width}
        height={size.height}
        style={{ position: "absolute", inset: 0 }}
      />
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 150,
          right: 150,
          bottom: -40,
          display: "flex",
          flexDirection: "column",
          padding: "56px 72px",
          background: "#f3f1ec",
          color: "#0a0a0a",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 18px 48px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Geist Mono",
            fontSize: 22,
            opacity: 0.55,
          }}
        >
          <span>{formatDate(p.date)}</span>
          <span>{p.minutes} min read</span>
        </div>
        <div
          style={{
            marginTop: 44,
            fontFamily: "Geist",
            fontWeight: 500,
            fontSize: 76,
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          {p.title}
        </div>
        <div
          style={{
            marginTop: 52,
            fontFamily: "Geist",
            fontSize: 26,
            lineHeight: 1.5,
            opacity: 0.62,
          }}
        >
          {p.opening[0]}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
