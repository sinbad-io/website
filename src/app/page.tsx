import { InteractiveListPreview } from "@/kit/interactive-list-preview";
import { Cascade } from "@/cascade";
import { Footer, Header } from "@/chrome";
import { ENTRIES } from "@/profile";
import { Name, Person, PostPlate } from "@/work";
import { formatDate, posts } from "@/writing";

const at = (id: string) => {
  const entry = ENTRIES.find((e) => e.id === id);
  if (!entry) throw new Error(`no entry ${id}`);
  return entry;
};

export default async function Home() {
  const writing = await posts();
  return (
    <>
      <div className="page">
        <Header />
        <main>
          <section className="intro" aria-labelledby="intro-title">
            <p className="index" aria-hidden="true">
              <span>(01)</span> About
            </p>
            <h1 id="intro-title" className="statement">
              <Cascade>
                Hi, I’m <Person>Oscar</Person>. I teach machines to work, and
                design for the people beside them.
              </Cascade>
            </h1>
            <p className="sequel">
              <Cascade>
                Now founding a company in{" "}
                <Name entry={at("stealth")}>stealth</Name>. Before that, I led
                Infrastructure and Foundations at <Name entry={at("legora")} />,
                Product at <Name entry={at("beyond-work")} /> and founded{" "}
                <Name entry={at("rig")} /> in my dorm room at 23, while studying
                computer science at <Name entry={at("aarhus")} />.
              </Cascade>
            </p>
            <p className="spec">
              <span>Copenhagen</span>
              <span>55.68° N, 12.57° E</span>
            </p>
          </section>

          <section
            id="writing"
            className="writing"
            aria-labelledby="writing-title"
          >
            <h2 id="writing-title" className="shead">
              <span>(02)</span> Writing
            </h2>
            <InteractiveListPreview
              className="posts overflow-visible bg-transparent"
              variant="statement"
              previewScale={0.9}
              previewClassName="left-[51%]"
              stacked="(pointer: coarse), (max-width: 640px)"
              aria-label="Writing"
              items={writing.map((p) => ({
                id: p.slug,
                label: (
                  <>
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                    {p.draft ? (
                      <span className="draft-mark" data-draft="">
                        Draft
                      </span>
                    ) : null}
                  </>
                ),
                meta: (
                  <a href={`/writing/${p.slug}/`} className="post-link">
                    {p.title}
                  </a>
                ),
                description: p.summary,
                preview: <PostPlate post={p} />,
              }))}
            />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
