// The gradient library in seed order, as sinbad-io/gradient writes it; the order only grows.
export type Mood =
  | "bands"
  | "bloom"
  | "cross"
  | "curve"
  | "fan"
  | "field"
  | "fold"
  | "gel"
  | "layers"
  | "leaf"
  | "petals"
  | "streaks"
  | "surf"
  | "swell"
  | "wall"
  | "wave"
  | "wind";
export type Palette =
  "blue" | "cyan" | "green" | "lime" | "periwinkle" | "pink";

export interface Tile {
  readonly id: string;
  readonly mood: Mood;
  readonly palette: Palette;
  /** The tile's mean colour, for the box while the image loads. */
  readonly tone: string;
}

export const MOODS: readonly Mood[] = [
  "bands",
  "bloom",
  "cross",
  "curve",
  "fan",
  "field",
  "fold",
  "gel",
  "layers",
  "leaf",
  "petals",
  "streaks",
  "surf",
  "swell",
  "wall",
  "wave",
  "wind",
];
export const PALETTES: readonly Palette[] = [
  "blue",
  "cyan",
  "green",
  "lime",
  "periwinkle",
  "pink",
];

export const TILES: readonly Tile[] = [
  { id: "curve-blue-6", mood: "curve", palette: "blue", tone: "#6a88db" },
  { id: "bands-cyan-4", mood: "bands", palette: "cyan", tone: "#68d5d7" },
  { id: "wave-green-1", mood: "wave", palette: "green", tone: "#8bd1b5" },
  { id: "wave-lime-5", mood: "wave", palette: "lime", tone: "#bed872" },
  {
    id: "wave-periwinkle-3",
    mood: "wave",
    palette: "periwinkle",
    tone: "#8c98dd",
  },
  { id: "bands-pink-3", mood: "bands", palette: "pink", tone: "#e7a6d7" },
  { id: "fan-blue-5", mood: "fan", palette: "blue", tone: "#8092e5" },
  { id: "wave-cyan-4", mood: "wave", palette: "cyan", tone: "#60d3d5" },
  { id: "bands-green-4", mood: "bands", palette: "green", tone: "#6fccb2" },
  { id: "swell-lime-4", mood: "swell", palette: "lime", tone: "#b5dfa1" },
  {
    id: "wall-periwinkle-3",
    mood: "wall",
    palette: "periwinkle",
    tone: "#9ca2eb",
  },
  { id: "bloom-pink-1", mood: "bloom", palette: "pink", tone: "#e6b1d5" },
  { id: "wind-blue-1", mood: "wind", palette: "blue", tone: "#8da7e5" },
  { id: "bloom-cyan-3", mood: "bloom", palette: "cyan", tone: "#54b5bb" },
  { id: "bands-green-3", mood: "bands", palette: "green", tone: "#6ec5b1" },
  { id: "surf-lime-4", mood: "surf", palette: "lime", tone: "#bee89c" },
  {
    id: "bands-periwinkle-4",
    mood: "bands",
    palette: "periwinkle",
    tone: "#8f9de3",
  },
  { id: "wind-pink-3", mood: "wind", palette: "pink", tone: "#dba8d5" },
  { id: "bands-blue-4", mood: "bands", palette: "blue", tone: "#7999eb" },
  { id: "bands-cyan-3", mood: "bands", palette: "cyan", tone: "#5bced3" },
  { id: "bloom-green-3", mood: "bloom", palette: "green", tone: "#85c7ba" },
  { id: "fold-lime-2", mood: "fold", palette: "lime", tone: "#c4e696" },
  {
    id: "wind-periwinkle-3",
    mood: "wind",
    palette: "periwinkle",
    tone: "#8a8fd2",
  },
  { id: "bloom-pink-3", mood: "bloom", palette: "pink", tone: "#e1a4d9" },
  { id: "bloom-blue-1", mood: "bloom", palette: "blue", tone: "#97b1f4" },
  { id: "surf-cyan-4", mood: "surf", palette: "cyan", tone: "#70d2d3" },
  { id: "bloom-green-4", mood: "bloom", palette: "green", tone: "#94d5bf" },
  { id: "wave-lime-3", mood: "wave", palette: "lime", tone: "#c5ec94" },
  {
    id: "wind-periwinkle-4",
    mood: "wind",
    palette: "periwinkle",
    tone: "#97a1ef",
  },
  { id: "bands-pink-4", mood: "bands", palette: "pink", tone: "#da9ece" },
  { id: "cross-blue-6", mood: "cross", palette: "blue", tone: "#8da0ec" },
  { id: "bloom-cyan-4", mood: "bloom", palette: "cyan", tone: "#75e1dc" },
  { id: "cross-green-6", mood: "cross", palette: "green", tone: "#87cfb9" },
  { id: "wall-lime-4", mood: "wall", palette: "lime", tone: "#c6ed8c" },
  {
    id: "wave-periwinkle-5",
    mood: "wave",
    palette: "periwinkle",
    tone: "#7c97eb",
  },
  { id: "wave-pink-5", mood: "wave", palette: "pink", tone: "#e7c0df" },
  { id: "fan-blue-6", mood: "fan", palette: "blue", tone: "#889ce5" },
  { id: "wind-cyan-3", mood: "wind", palette: "cyan", tone: "#63c9cf" },
  { id: "streaks-green-5", mood: "streaks", palette: "green", tone: "#75cbb3" },
  { id: "surf-lime-3", mood: "surf", palette: "lime", tone: "#c9e398" },
  {
    id: "curve-periwinkle-5",
    mood: "curve",
    palette: "periwinkle",
    tone: "#a3a9e7",
  },
  { id: "bloom-pink-2", mood: "bloom", palette: "pink", tone: "#eeb8df" },
  { id: "bands-blue-3", mood: "bands", palette: "blue", tone: "#859ced" },
  { id: "bloom-cyan-2", mood: "bloom", palette: "cyan", tone: "#a4e2df" },
  { id: "wave-green-6", mood: "wave", palette: "green", tone: "#78c8bb" },
  { id: "wind-lime-4", mood: "wind", palette: "lime", tone: "#cbe57f" },
  {
    id: "fan-periwinkle-5",
    mood: "fan",
    palette: "periwinkle",
    tone: "#a2a3f0",
  },
  { id: "wave-pink-2", mood: "wave", palette: "pink", tone: "#ecb1d7" },
  { id: "bloom-blue-2", mood: "bloom", palette: "blue", tone: "#99b8f4" },
  { id: "bloom-cyan-1", mood: "bloom", palette: "cyan", tone: "#79dce1" },
  { id: "wind-green-2", mood: "wind", palette: "green", tone: "#9bd4c5" },
  { id: "curve-lime-6", mood: "curve", palette: "lime", tone: "#d0e28a" },
  {
    id: "wall-periwinkle-4",
    mood: "wall",
    palette: "periwinkle",
    tone: "#817bd4",
  },
  { id: "wall-pink-4", mood: "wall", palette: "pink", tone: "#e1a2d0" },
  { id: "fold-blue-1", mood: "fold", palette: "blue", tone: "#b1c1f7" },
  { id: "leaf-cyan-1", mood: "leaf", palette: "cyan", tone: "#8adfdb" },
  { id: "wave-green-2", mood: "wave", palette: "green", tone: "#75ccba" },
  { id: "wind-lime-3", mood: "wind", palette: "lime", tone: "#cfe788" },
  {
    id: "surf-periwinkle-3",
    mood: "surf",
    palette: "periwinkle",
    tone: "#9da2e2",
  },
  { id: "gel-pink-3", mood: "gel", palette: "pink", tone: "#e3a3dd" },
  { id: "wave-blue-4", mood: "wave", palette: "blue", tone: "#7e9aec" },
  { id: "wave-cyan-1", mood: "wave", palette: "cyan", tone: "#86dade" },
  { id: "wall-green-4", mood: "wall", palette: "green", tone: "#6bc7a6" },
  {
    id: "layers-periwinkle-5",
    mood: "layers",
    palette: "periwinkle",
    tone: "#a3a5e9",
  },
  { id: "fan-pink-5", mood: "fan", palette: "pink", tone: "#e5aeda" },
  { id: "bloom-blue-4", mood: "bloom", palette: "blue", tone: "#809de8" },
  { id: "swell-cyan-3", mood: "swell", palette: "cyan", tone: "#87d2d4" },
  { id: "field-green-5", mood: "field", palette: "green", tone: "#5bb99e" },
  {
    id: "fan-periwinkle-6",
    mood: "fan",
    palette: "periwinkle",
    tone: "#7b81d1",
  },
  { id: "streaks-pink-5", mood: "streaks", palette: "pink", tone: "#e1a0c6" },
  { id: "gel-blue-4", mood: "gel", palette: "blue", tone: "#678eec" },
  { id: "wave-cyan-3", mood: "wave", palette: "cyan", tone: "#68ded1" },
  { id: "layers-green-5", mood: "layers", palette: "green", tone: "#72c8ab" },
  {
    id: "bloom-periwinkle-1",
    mood: "bloom",
    palette: "periwinkle",
    tone: "#b5baef",
  },
  { id: "wave-pink-4", mood: "wave", palette: "pink", tone: "#dd8cbe" },
  { id: "curve-blue-5", mood: "curve", palette: "blue", tone: "#6482d5" },
  { id: "leaf-cyan-2", mood: "leaf", palette: "cyan", tone: "#65d5dd" },
  { id: "curve-green-6", mood: "curve", palette: "green", tone: "#6dbca6" },
  {
    id: "wind-periwinkle-2",
    mood: "wind",
    palette: "periwinkle",
    tone: "#abaeef",
  },
  { id: "curve-pink-5", mood: "curve", palette: "pink", tone: "#e090cd" },
  { id: "gel-blue-3", mood: "gel", palette: "blue", tone: "#809feb" },
  { id: "wind-cyan-2", mood: "wind", palette: "cyan", tone: "#84e4e3" },
  { id: "gel-green-4", mood: "gel", palette: "green", tone: "#75cbb3" },
  {
    id: "bands-periwinkle-3",
    mood: "bands",
    palette: "periwinkle",
    tone: "#a3a5ed",
  },
  { id: "wind-pink-4", mood: "wind", palette: "pink", tone: "#d394c5" },
  { id: "streaks-blue-5", mood: "streaks", palette: "blue", tone: "#6e93e8" },
  { id: "wave-cyan-2", mood: "wave", palette: "cyan", tone: "#8de2e0" },
  { id: "fan-green-5", mood: "fan", palette: "green", tone: "#6ac9b0" },
  {
    id: "petals-periwinkle-1",
    mood: "petals",
    palette: "periwinkle",
    tone: "#b1b8f3",
  },
  { id: "wave-blue-1", mood: "wave", palette: "blue", tone: "#91adef" },
  { id: "wave-cyan-5", mood: "wave", palette: "cyan", tone: "#73d7d9" },
  {
    id: "gel-periwinkle-4",
    mood: "gel",
    palette: "periwinkle",
    tone: "#9c9dec",
  },
  { id: "wave-blue-3", mood: "wave", palette: "blue", tone: "#84a0ef" },
  { id: "wind-cyan-4", mood: "wind", palette: "cyan", tone: "#54c6c6" },
  {
    id: "bloom-periwinkle-3",
    mood: "bloom",
    palette: "periwinkle",
    tone: "#9899ea",
  },
  { id: "bloom-blue-3", mood: "bloom", palette: "blue", tone: "#8297e8" },
  { id: "streaks-cyan-5", mood: "streaks", palette: "cyan", tone: "#74dce2" },
  {
    id: "curve-periwinkle-6",
    mood: "curve",
    palette: "periwinkle",
    tone: "#8075e4",
  },
  { id: "wall-blue-3", mood: "wall", palette: "blue", tone: "#7894e6" },
  {
    id: "field-periwinkle-5",
    mood: "field",
    palette: "periwinkle",
    tone: "#8991de",
  },
  { id: "wind-blue-4", mood: "wind", palette: "blue", tone: "#7489d6" },
];
