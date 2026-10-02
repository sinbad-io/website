import { InteractiveListPreview } from "@/kit/interactive-list-preview";
import type { CSSProperties, ReactNode } from "react";
import { Arrow, Colophon, Roll } from "./chrome";
import { ABOUT, ENTRIES, LINKEDIN, NAME, period, type Entry } from "./profile";
import { formatDate, type Post } from "./writing";

function Tile({ plate }: { plate: string }) {
  return (
    <img
      className="plate-tile"
      src={`/tiles/${plate}.webp`}
      alt=""
      draggable={false}
    />
  );
}

/** Logos share one optical area, so a long wordmark sits as heavy as a short one. */
const LOGO_AREA = 312;

/** A work's plate: its role and months along the top, its logo or its name set large at the foot. */
function Plate({ entry }: { entry: Entry }) {
  const logo = entry.logo;
  return (
    <>
      <Tile plate={entry.plate} />
      <span className="plate-top">
        <span>{entry.title}</span>
        <span>{period(entry)}</span>
      </span>
      {logo ? (
        <span
          className="plate-logo"
          role="img"
          aria-label={entry.name}
          style={
            {
              width: `${Math.sqrt(LOGO_AREA * logo.aspect).toFixed(1)}cqw`,
              aspectRatio: logo.aspect,
              "--mark": `url(${logo.src})`,
            } as CSSProperties
          }
        >
          <span />
        </span>
      ) : (
        <span className="plate-name">{entry.name}</span>
      )}
    </>
  );
}

/** A post's plate: the post itself, a sheet on its tile running off the foot. */
export function PostPlate({ post }: { post: Post }) {
  return (
    <span className="plate plate-post">
      <Tile plate={post.plate} />
      <span className="sheet">
        <span className="sheet-top">
          <span>{formatDate(post.date)}</span>
          <span>{post.minutes} min read</span>
        </span>
        <span className="sheet-title">{post.title}</span>
        {post.opening.map((p) => (
          <span key={p} className="sheet-p">
            {p}
          </span>
        ))}
      </span>
    </span>
  );
}

/** The owner's name in running text: a photograph under the pointer, the About page on a click. */
export function Person({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="work person"
      commandfor="about"
      command="show-modal"
    >
      {children}
      <span className="peek photo" aria-hidden="true">
        <img src="/oscar.jpg" alt="" draggable={false} />
      </span>
    </button>
  );
}

/** A company in running text: its plate under the pointer, its page on a click. */
export function Name({
  entry,
  children,
}: {
  entry: Entry;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      className="work"
      commandfor={entry.id}
      command="show-modal"
    >
      {children ?? entry.name}
      <span className="peek plate" aria-hidden="true">
        <Plate entry={entry} />
      </span>
    </button>
  );
}

function Page({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <dialog
      id={id}
      className="case"
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
    >
      <div className="case-page">
        <div className="case-bar">
          <Colophon />
          <button
            type="button"
            className="close"
            commandfor={id}
            command="close"
          >
            <Roll>Close</Roll>
          </button>
        </div>
        <h2 id={`${id}-title`} className="hidden-title">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}

function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="press" href={href} target="_blank" rel="noreferrer">
      {children}
      <Arrow />
    </a>
  );
}

export function Case({ entry }: { entry: Entry }) {
  return (
    <Page
      id={entry.id}
      title={`${entry.name}, ${entry.title}, ${period(entry)}`}
    >
      <div className="case-hero plate" data-hero="">
        <Plate entry={entry} />
      </div>
      {entry.art ? (
        <div className="case-art">
          {entry.art.map((a) => (
            <div key={a.src} className="plate">
              <Tile plate={entry.plate} />
              <img className="plate-art" src={a.src} alt={a.alt} />
            </div>
          ))}
        </div>
      ) : null}
      <div className="case-text">
        <ul className="tags" aria-label="Practice">
          {entry.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="case-main">
          <p className="case-body">{entry.body}</p>
          {entry.site || entry.press ? (
            <div className="case-links">
              {entry.site ? (
                <Out href={entry.site}>
                  {entry.site.replace(/^https?:\/\//, "")}
                </Out>
              ) : null}
              {entry.press ? (
                <Out href={entry.press.href}>{entry.press.title}</Out>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Page>
  );
}

export function About() {
  return (
    <Page id="about" title={`About ${NAME}`}>
      <div className="about">
        <div className="about-photo" data-hero="">
          <img src="/oscar.jpg" alt={NAME} draggable={false} />
        </div>
        <div className="about-text">
          {ABOUT.map((p) => (
            <p key={p} className="case-body">
              {p}
            </p>
          ))}
          <div className="case-links">
            <Out href={LINKEDIN}>LinkedIn</Out>
          </div>
        </div>
      </div>
    </Page>
  );
}

/** Every role, newest first: its plate under the pointer, its page on a click. */
function Work() {
  return (
    <Page id="work" title="Work">
      <div className="work-page">
        <p className="shead">Work</p>
        <InteractiveListPreview
          className="roles overflow-visible bg-transparent"
          variant="index"
          previewScale={0.9}
          previewClassName="left-[44%]"
          aria-label="Work"
          items={ENTRIES.map((e) => ({
            id: e.id,
            label: (
              <button
                type="button"
                className="row-open"
                commandfor={e.id}
                command="show-modal"
              >
                {e.name}
              </button>
            ),
            meta: period(e),
            description: e.title,
            preview: (
              <span className="plate">
                <Plate entry={e} />
              </span>
            ),
          }))}
        />
      </div>
    </Page>
  );
}

/** The pages every screen can open: the owner, the work, and each role. */
export function Dialogs() {
  return (
    <>
      <About />
      <Work />
      {ENTRIES.map((e) => (
        <Case key={e.id} entry={e} />
      ))}
    </>
  );
}
