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

const PLACES = [
  {
    city: "Copenhagen",
    zone: "Europe/Copenhagen",
    locale: "en-GB",
    lat: 55.6761,
    lon: 12.5683,
  },
  {
    city: "San Francisco",
    zone: "America/Los_Angeles",
    locale: "en-US",
    lat: 37.7749,
    lon: -122.4194,
  },
];

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

/** A city's time and whether its sun is up; site.js keeps both current. */
function Clock({ place }: { place: (typeof PLACES)[number] }) {
  return (
    <span
      className="clock"
      data-clock={place.zone}
      data-locale={place.locale}
      data-lat={place.lat}
      data-lon={place.lon}
      suppressHydrationWarning
    >
      <span className="city">{place.city}</span>
      <Sun />
      <Moon />
      <time suppressHydrationWarning>--:--</time>
    </span>
  );
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
      <div className="clocks" aria-label="Local times">
        {PLACES.map((p) => (
          <Clock key={p.zone} place={p} />
        ))}
      </div>
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
