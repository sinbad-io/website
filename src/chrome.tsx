import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import type { ReactNode } from "react";
import { DraftsMenu } from "./drafts";
import { COLOPHON, LINKEDIN, NAME, X } from "./profile";

export function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

export function Arrow() {
  return <ArrowUpRightIcon className="arrow" aria-hidden="true" />;
}

function Sun() {
  return (
    <svg className="sun" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="2.6" />
      <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
    </svg>
  );
}

function Moon() {
  return (
    <svg className="moon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M12.8 10.2A5.4 5.4 0 0 1 5.8 3.2a5.4 5.4 0 1 0 7 7Z" />
    </svg>
  );
}

/** Copenhagen's time and whether its sun is up; site.js keeps both current. */
export function Clock() {
  return (
    <span
      className="clock"
      data-clock="Europe/Copenhagen"
      data-locale="en-GB"
      data-lat="55.6761"
      data-lon="12.5683"
      suppressHydrationWarning
    >
      <Sun />
      <Moon />
      <time suppressHydrationWarning>00:00:00</time>
    </span>
  );
}

export function Colophon() {
  return (
    <a href="/" className="colophon" aria-label={`${NAME}, home`}>
      <img
        className="arms"
        src="/arms.webp"
        alt=""
        width={156}
        height={192}
        draggable={false}
      />
      <span className="lines">
        {COLOPHON.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </span>
    </a>
  );
}

export function Header() {
  return (
    <header className="head">
      <DraftsMenu>
        <Colophon />
      </DraftsMenu>
      <div className="side">
        <button type="button" commandfor="work" command="show-modal">
          <Roll>Work</Roll>
        </button>
        <Links />
      </div>
    </header>
  );
}

function Links() {
  return (
    <>
      <a href={LINKEDIN} target="_blank" rel="noreferrer">
        <Roll>
          LinkedIn
          <Arrow />
        </Roll>
      </a>
      <a href={X} target="_blank" rel="noreferrer">
        <Roll>
          X
          <Arrow />
        </Roll>
      </a>
    </>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <span>©2026 {NAME}</span>
      <nav className="foot-links" aria-label="Elsewhere">
        <Links />
      </nav>
    </footer>
  );
}
