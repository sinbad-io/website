import type { Metadata } from "next";
import { Footer, Header } from "@/chrome";
import { formatDate, post, posts, slugs } from "@/writing";

export const dynamicParams = false;

export function generateStaticParams() {
  return slugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post: p } = await post((await params).slug);
  return { title: p.title, description: p.summary };
}

export default async function Piece({ params }: Props) {
  const { slug } = await params;
  const { post: p, Content } = await post(slug);
  const all = await posts();
  const at = all.findIndex((x) => x.slug === slug);
  const newer = all[at - 1];
  const older = all[at + 1];
  return (
    <div className="page">
      <Header />
      <main>
        <article className="piece">
          <div className="piece-meta label">
            <a href="/#writing">← Writing</a>
            <time dateTime={p.date}>{formatDate(p.date)}</time>
          </div>
          <header className="piece-head">
            <h1>{p.title}</h1>
            <p>{p.summary}</p>
          </header>
          <div className="prose">
            <Content />
          </div>
          {newer || older ? (
            <nav className="turn" aria-label="More writing">
              {older ? (
                <a href={`/writing/${older.slug}/`}>
                  <span className="label">Earlier</span>
                  <span className="row-title">{older.title}</span>
                </a>
              ) : null}
              {newer ? (
                <a href={`/writing/${newer.slug}/`} className="next">
                  <span className="label">Later</span>
                  <span className="row-title">{newer.title}</span>
                </a>
              ) : null}
            </nav>
          ) : null}
        </article>
      </main>
      <Footer />
    </div>
  );
}
