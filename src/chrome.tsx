import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import type { ReactNode } from "react";
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

export function Colophon() {
  return (
    <a href="/" className="colophon" aria-label={`${NAME}, home`}>
      {COLOPHON.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </a>
  );
}

export function Header() {
  return (
    <header className="head">
      <Colophon />
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
