import type { ReactNode } from "react";
import { MOODS, PALETTES, TILES, type Tile } from "./tiles";

const SEED = 42;
const TEXT = "Light";
const SHAPES = [
  ["wide", "2:1"],
  ["square", "1:1"],
  ["tall", "4:5"],
] as const;

function mean(tiles: readonly Tile[]): string {
  const sum = [0, 0, 0];
  for (const t of tiles)
    for (let i = 0; i < 3; i++)
      sum[i]! += parseInt(t.tone.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${sum
    .map((v) =>
      Math.round(v / tiles.length)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function Chip({
  group,
  value,
  on,
  children,
}: {
  group: string;
  value: string;
  on?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="chip"
      data-lab-set={group}
      value={value}
      aria-pressed={on ? "true" : "false"}
    >
      {children}
    </button>
  );
}

/** Pick a seed, a palette, a mood and a shape, and the tile follows; site.js runs it, so it works without React. */
export function Playground() {
  const first = TILES[(SEED - 1) % TILES.length]!;
  return (
    <div
      className="lab"
      data-lab=""
      data-tiles={JSON.stringify(
        TILES.map((t) => [t.id, t.mood, t.palette, t.tone]),
      )}
    >
      <div className="lab-stage" data-shape="wide">
        <div
          className="plate lab-plate"
          style={{ backgroundColor: first.tone }}
        >
          <img
            className="plate-tile"
            src={`/tiles/${first.id}.webp`}
            alt=""
            draggable={false}
            data-lab-img=""
          />
          <span className="plate-top">
            <span data-lab-seedline="" suppressHydrationWarning>
              {`Seed ${SEED}`}
            </span>
            <span data-lab-id="" suppressHydrationWarning>
              {first.id}
            </span>
          </span>
          <span
            className="plate-name"
            data-lab-name=""
            suppressHydrationWarning
          >
            {TEXT}
          </span>
        </div>
      </div>
      <div className="lab-controls">
        <div className="lab-row">
          <span className="lab-key">Seed</span>
          <div className="lab-seed">
            <button
              type="button"
              className="chip"
              data-lab-step="-1"
              aria-label="Previous seed"
            >
              −
            </button>
            <output data-lab-seed="" suppressHydrationWarning>
              {SEED}
            </output>
            <button
              type="button"
              className="chip"
              data-lab-step="1"
              aria-label="Next seed"
            >
              +
            </button>
            <button type="button" className="chip" data-lab-shuffle="">
              Shuffle
            </button>
          </div>
        </div>
        <div className="lab-row">
          <span className="lab-key">Palette</span>
          <div className="lab-chips">
            <Chip group="palette" value="" on>
              Any
            </Chip>
            {PALETTES.map((p) => (
              <Chip key={p} group="palette" value={p}>
                <span
                  className="swatch"
                  style={{
                    background: mean(TILES.filter((t) => t.palette === p)),
                  }}
                />
                {p}
              </Chip>
            ))}
          </div>
        </div>
        <div className="lab-row">
          <span className="lab-key">Mood</span>
          <div className="lab-chips">
            <Chip group="mood" value="" on>
              Any
            </Chip>
            {MOODS.map((m) => (
              <Chip key={m} group="mood" value={m}>
                {m}
              </Chip>
            ))}
          </div>
        </div>
        <div className="lab-row">
          <span className="lab-key">Shape</span>
          <div className="lab-chips">
            {SHAPES.map(([value, label], i) => (
              <Chip key={value} group="shape" value={value} on={i === 0}>
                {label}
              </Chip>
            ))}
          </div>
        </div>
        <label className="lab-row">
          <span className="lab-key">Text</span>
          <input
            className="lab-text"
            defaultValue={TEXT}
            maxLength={24}
            spellCheck={false}
            data-lab-text=""
          />
        </label>
      </div>
      <pre className="lab-code">
        <code
          data-lab-code=""
          suppressHydrationWarning
        >{`<Gradient seed={${SEED}} style={{ aspectRatio: "2 / 1" }} />`}</code>
      </pre>
    </div>
  );
}
