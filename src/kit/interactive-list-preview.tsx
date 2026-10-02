"use client";

import { animate, motion, useMotionValue } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "./cn";
import { useReducedMotionSafe } from "./motion";

export interface InteractiveListPreviewItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly meta?: ReactNode;
  readonly description?: ReactNode;
  /** What the row reveals under the pointer: an image, a tile, any box that fills its frame. */
  readonly preview: ReactNode;
}

/** `index` is mono rows, `statement` a numbered title and a sentence, `brief` a number and a line set in the surrounding text. */
export type InteractiveListPreviewVariant = "index" | "statement" | "brief";

export interface InteractiveListPreviewProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> {
  readonly items: readonly InteractiveListPreviewItem[];
  readonly variant?: InteractiveListPreviewVariant;
  /** Rows flow down one column, or down two. */
  readonly columns?: 1 | 2;
  /** The preview frame's scale, from 0.5 to 2. */
  readonly previewScale?: number;
  /** Where the preview frame sits, over the variant's own placement. */
  readonly previewClassName?: string;
  /** Seconds a preview takes to open or to close. */
  readonly duration?: number;
  /** Seconds the bar and a row's ink take to follow the pointer. */
  readonly smoothness?: number;
  /** The share of the remaining distance the preview closes each frame. */
  readonly lerp?: number;
}

const BASE_WIDTH_REM = 19.5;
const BASE_HEIGHT_REM = 22.5;
const DRIFT_PX = 20;
const inset = (percent: number) => `inset(${percent}%)`;
const CLIP_HIDDEN = inset(50);
const CLIP_SHOWN = inset(0);
const EASE_OPEN = [0.45, 0, 0.55, 1] as const;
const EASE_CLOSE = [0.65, 0, 0.35, 1] as const;
const EASE_BAR = [0.215, 0.61, 0.355, 1] as const;
const EASE_FADE = [0.33, 1, 0.68, 1] as const;

const ROOT: Record<InteractiveListPreviewVariant, string> = {
  index: "overflow-hidden bg-surface",
  statement: "overflow-hidden bg-surface",
  brief: "overflow-visible",
};

const ROW: Record<InteractiveListPreviewVariant, string> = {
  index:
    "grid-cols-[20%_20%_20%_40%] items-center font-mono text-xs tracking-widest uppercase",
  statement:
    "grid-cols-[minmax(0,1fr)_minmax(0,4fr)_minmax(0,1fr)_minmax(0,4fr)] items-baseline",
  brief:
    "break-inside-avoid grid-cols-[3ch_minmax(0,1fr)] items-baseline gap-x-[0.5ch] px-2",
};

const CELL: Record<InteractiveListPreviewVariant, string> = {
  index: "truncate px-6 py-3",
  statement: "px-4 py-6 sm:px-6",
  brief: "",
};

const LABEL: Record<InteractiveListPreviewVariant, string> = {
  index: "",
  statement: "font-mono text-xs tracking-widest tabular-nums",
  brief: "text-ink-muted tabular-nums group-data-active/row:text-surface",
};

const META: Record<InteractiveListPreviewVariant, string> = {
  index: "",
  statement: "text-2xl/tight font-medium tracking-tight text-balance",
  brief: "",
};

const DESCRIPTION: Record<InteractiveListPreviewVariant, string> = {
  index: "",
  statement:
    "text-sm/6 text-pretty text-ink-muted group-data-active/row:text-surface",
  brief: "",
};

const FRAME: Record<InteractiveListPreviewVariant, string> = {
  index: "top-1/2 left-[35%] -translate-y-1/2",
  statement: "top-1/2 left-[40%] -translate-y-1/2",
  brief: "bottom-0 left-1/2 -translate-x-1/2",
};

function clamp(value: number, min: number, max: number, fallback: number) {
  return Number.isFinite(value)
    ? Math.min(Math.max(value, min), max)
    : fallback;
}

function subscribeCoarse(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia("(pointer: coarse)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function coarseNow() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

function coarseOnServer() {
  return false;
}

/** Rows that reveal a preview under the pointer behind a bar that follows it; on a touch screen every row shows its preview beside its text. */
export function InteractiveListPreview({
  items,
  variant = "index",
  columns = 1,
  previewScale = 1,
  previewClassName,
  duration = 0.6,
  smoothness = 0.35,
  lerp = 0.18,
  className,
  ...props
}: InteractiveListPreviewProps) {
  const reduced = useReducedMotionSafe();
  const coarse = useSyncExternalStore(
    subscribeCoarse,
    coarseNow,
    coarseOnServer,
  );
  const scale = clamp(previewScale, 0.5, 2, 1);
  const open = clamp(duration, 0.1, 2, 0.6);
  const follow = clamp(smoothness, 0.05, 1.5, 0.35);
  const step = clamp(lerp, 0.02, 1, 0.18);
  const flow = columns === 2 ? "columns-2 gap-x-8" : "";

  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const opening = useRef(new Set<number>());
  const leaveAfterOpen = useRef(new Set<number>());
  const generation = useRef<number[]>([]);
  const running = useRef<(ReturnType<typeof animate> | undefined)[]>([]);
  const barRun = useRef<ReturnType<typeof animate> | undefined>(undefined);
  const stack = useRef(10);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const target = useRef({ x: 0, y: 0 });
  const inside = useRef(false);
  const frame = useRef(0);
  const tick = useRef<() => void>(() => {});

  useEffect(() => {
    tick.current = () => {
      const nx = x.get() + (target.current.x - x.get()) * step;
      const ny = y.get() + (target.current.y - y.get()) * step;
      x.set(nx);
      y.set(ny);
      const settled =
        Math.abs(target.current.x - nx) < 0.05 &&
        Math.abs(target.current.y - ny) < 0.05;
      frame.current =
        !inside.current && settled
          ? 0
          : requestAnimationFrame(() => tick.current());
    };
  });

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useEffect(() => {
    if (!reduced) return;
    target.current = { x: 0, y: 0 };
    x.set(0);
    y.set(0);
  }, [reduced, x, y]);

  const wake = () => {
    if (!frame.current)
      frame.current = requestAnimationFrame(() => tick.current());
  };

  const bump = (index: number) => {
    generation.current[index] = (generation.current[index] ?? 0) + 1;
    return generation.current[index]!;
  };

  const close = (index: number) => {
    const el = frames.current[index];
    if (!el) return;
    const mine = bump(index);
    opening.current.delete(index);
    running.current[index]?.stop();
    const controls = animate(
      el,
      reduced ? { opacity: 0 } : { clipPath: CLIP_HIDDEN, opacity: 0 },
      reduced
        ? { duration: Math.min(follow, 0.35), ease: EASE_FADE }
        : { duration: open, ease: EASE_CLOSE },
    );
    running.current[index] = controls;
    void controls.then(() => {
      if (generation.current[index] === mine) el.style.visibility = "hidden";
    });
  };

  const moveBar = (row: HTMLElement, fresh: boolean) => {
    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar) return;
    const r = row.getBoundingClientRect();
    const o = root.getBoundingClientRect();
    const dx = r.left - o.left;
    const dy = r.top - o.top;
    barRun.current?.stop();
    barRun.current = animate(
      bar,
      fresh
        ? {
            x: [dx, dx],
            y: [dy, dy],
            width: [r.width, r.width],
            height: [r.height, r.height],
            opacity: [0, 1],
          }
        : { x: dx, y: dy, width: r.width, height: r.height, opacity: 1 },
      { duration: follow, ease: EASE_BAR },
    );
  };

  const enter = (row: HTMLElement, index: number) => {
    const el = frames.current[index];
    if (!el) return;
    const previous = activeRef.current;
    leaveAfterOpen.current.delete(index);
    if (reduced && previous !== null && previous !== index) {
      leaveAfterOpen.current.delete(previous);
      close(previous);
    }
    stack.current += 1;
    const mine = bump(index);
    running.current[index]?.stop();
    el.style.zIndex = String(stack.current);
    el.style.visibility = "visible";
    opening.current.add(index);
    let controls;
    if (reduced) {
      el.style.clipPath = CLIP_SHOWN;
      el.style.opacity = "0";
      controls = animate(
        el,
        { opacity: 1 },
        { duration: Math.min(follow, 0.35), ease: EASE_FADE },
      );
    } else {
      el.style.clipPath = CLIP_HIDDEN;
      el.style.opacity = "1";
      controls = animate(
        el,
        { clipPath: CLIP_SHOWN, opacity: 1 },
        { duration: open, ease: EASE_OPEN },
      );
    }
    running.current[index] = controls;
    void controls.then(() => {
      if (generation.current[index] !== mine) return;
      opening.current.delete(index);
      if (leaveAfterOpen.current.delete(index)) close(index);
    });
    activeRef.current = index;
    setActive(index);
    moveBar(row, previous === null);
  };

  const leave = (index: number) => {
    if (opening.current.has(index)) {
      leaveAfterOpen.current.add(index);
      return;
    }
    close(index);
  };

  const leaveList = () => {
    inside.current = false;
    activeRef.current = null;
    setActive(null);
    target.current = { x: 0, y: 0 };
    wake();
    const bar = barRef.current;
    if (!bar) return;
    barRun.current?.stop();
    barRun.current = animate(
      bar,
      { opacity: 0 },
      { duration: follow, ease: EASE_FADE },
    );
  };

  const point = (event: MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    target.current = {
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * DRIFT_PX,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * DRIFT_PX,
    };
    inside.current = true;
    wake();
  };

  if (coarse && variant === "brief") {
    return (
      <div
        {...props}
        data-slot="interactive-list-preview"
        data-variant={variant}
        className={cn("w-full", className)}
      >
        <ul role="list" className={cn("m-0 list-none p-0", flow)}>
          {items.map((item) => (
            <li
              key={item.id}
              className="grid break-inside-avoid grid-cols-[3ch_minmax(0,1fr)] items-baseline gap-x-[0.5ch]"
            >
              <span className="text-ink-muted tabular-nums">{item.label}</span>
              <span>{item.meta}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (coarse) {
    return (
      <div
        {...props}
        data-slot="interactive-list-preview"
        data-variant={variant}
        className={cn("w-full bg-surface text-ink", className)}
      >
        <ul role="list" className={cn("m-0 list-none p-0", flow)}>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex break-inside-avoid border-b border-rule"
            >
              <div className="flex w-1/2 min-w-0 flex-col gap-1 p-4">
                <span className={cn(LABEL[variant], "text-ink-muted")}>
                  {item.label}
                </span>
                {item.meta ? (
                  <span
                    className={
                      variant === "statement"
                        ? "text-lg/tight font-medium tracking-tight text-balance"
                        : "font-mono text-xs tracking-widest uppercase"
                    }
                  >
                    {item.meta}
                  </span>
                ) : null}
                <span className="text-sm/6 text-pretty text-ink-muted">
                  {item.description}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="relative aspect-3/4 w-1/2 overflow-hidden"
              >
                <div className="absolute inset-0 *:size-full">
                  {item.preview}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      {...props}
      ref={rootRef}
      data-slot="interactive-list-preview"
      data-variant={variant}
      className={cn("relative w-full text-ink", ROOT[variant], className)}
      onMouseMove={point}
    >
      <div
        ref={barRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-10 h-0 w-full bg-ink opacity-0"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 dark:mix-blend-difference"
        style={{ x, y }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              frames.current[index] = el;
            }}
            className={cn(
              "invisible absolute overflow-hidden *:size-full",
              FRAME[variant],
              previewClassName,
            )}
            style={{
              width: `${BASE_WIDTH_REM * scale}rem`,
              height: `${BASE_HEIGHT_REM * scale}rem`,
              clipPath: CLIP_HIDDEN,
              zIndex: 10,
            }}
          >
            {item.preview}
          </div>
        ))}
      </motion.div>
      <ul
        role="list"
        className={cn(
          "relative z-30 m-0 list-none p-0",
          flow,
          variant === "brief" && "-mx-2",
        )}
        onMouseLeave={leaveList}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            data-active={active === index ? "" : undefined}
            className={cn(
              "group/row grid transition-colors data-active:text-surface motion-reduce:transition-none",
              ROW[variant],
            )}
            style={{ transitionDuration: `${follow}s` }}
            onMouseEnter={(event) => enter(event.currentTarget, index)}
            onMouseLeave={() => leave(index)}
          >
            <span className={cn(CELL[variant], LABEL[variant])}>
              {item.label}
            </span>
            <span className={cn(CELL[variant], META[variant])}>
              {item.meta}
            </span>
            {variant === "brief" ? null : (
              <>
                <span aria-hidden="true" className={CELL[variant]} />
                <span className={cn(CELL[variant], DESCRIPTION[variant])}>
                  {item.description}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
