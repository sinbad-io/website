import {
  Children,
  Fragment,
  isValidElement,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * Copy that resolves word by word: each word, or each name set in it, takes
 * the next place in the queue. Punctuation that follows a name rides with it,
 * so no line starts on a full stop.
 */
export function Cascade({ children }: { children: ReactNode }) {
  const units: ReactNode[][] = [];
  const out: (ReactNode[] | string)[] = [];
  const unit = (node: ReactNode) => {
    const u = [node];
    units.push(u);
    out.push(u);
  };
  for (const child of Children.toArray(children)) {
    if (isValidElement(child)) {
      unit(child);
      continue;
    }
    String(child)
      .split(/( +)/)
      .forEach((part, p) => {
        if (part === "") return;
        if (/^ +$/.test(part)) out.push(part);
        else if (p === 0 && out.length && Array.isArray(out.at(-1)))
          (out.at(-1) as ReactNode[]).push(part);
        else unit(part);
      });
  }
  return out.map((u, k) =>
    typeof u === "string" ? (
      <Fragment key={k}>{u}</Fragment>
    ) : (
      <span
        key={k}
        className="cw"
        style={{ "--i": units.indexOf(u) } as CSSProperties}
      >
        {u.map((n, j) => (
          <Fragment key={j}>{n}</Fragment>
        ))}
      </span>
    ),
  );
}
