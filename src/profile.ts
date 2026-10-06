export const NAME = "Oscar Antonio Borlund Orellana";

export const LINKEDIN = "https://www.linkedin.com/in/oscar-a-b-orellana/";

export const X = "https://x.com/oscaraborellana";

export const COLOPHON = [
  "Oscar Antonio",
  "Borlund Orellana",
  "Founder & Builder",
];

export const DESCRIPTION =
  "Founder and builder. I teach machines to work, and design for the people beside them.";

/** A run of text, or a link. */
export type Words = string | { readonly text: string; readonly href: string };

/** What the name in the statement opens: paragraphs of runs. */
export const ABOUT: readonly (readonly Words[])[] = [
  [
    "I’m engaged to Laura, whom I met at university, and I’m the father of Elias, our wonderful son. We live in an old, renovated apartment in Copenhagen.",
  ],
  [
    "Laura is my foundation. She makes it possible for me to set out on journeys as crazy as building companies, and she is the reason I’m not afraid to fail, get back up and try again.",
  ],
  [
    "I come from a family of builders. Since I was little, I’ve watched my dad build ",
    { text: "Origo", href: "https://origo.io" },
    ", and I learned early that the things you wish existed are yours to make. I want to leave the world a little better than I found it.",
  ],
];

export interface Art {
  /** A file under public/, drawn over the entry's tile. */
  readonly src: string;
  readonly alt: string;
}

export interface Logo {
  /** A file under public/logos/; only its alpha is drawn. */
  readonly src: string;
  /** Width over height of the trimmed mark. */
  readonly aspect: number;
}

export interface Entry {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  /** YYYY-MM */
  readonly from: string;
  /** YYYY-MM; absent while it lasts. */
  readonly to?: string;
  readonly tags: readonly string[];
  readonly body: string;
  /** A tile of the light-through-paper library, in public/tiles/. */
  readonly plate: string;
  readonly logo?: Logo;
  readonly site?: string;
  readonly art?: readonly Art[];
  readonly press?: { readonly title: string; readonly href: string };
}

/** Newest first; each opens from its name in the statement. */
export const ENTRIES: readonly Entry[] = [
  {
    id: "stealth",
    name: "Stealth",
    title: "Founder",
    from: "2026-06",
    tags: ["Founder", "Research", "Infrastructure"],
    body: "Every so often a problem grabs you and won’t let go. This one is big enough to scare me and still unsolved, so I left Legora to build it. We are in stealth, backed by some of the best people in the world.",
    plate: "surf-lime-4",
  },
  {
    id: "legora",
    name: "Legora",
    title: "Engineering Manager",
    from: "2026-01",
    to: "2026-06",
    tags: ["Infrastructure", "Platform", "Leadership"],
    body: "I led and built the Infra and Foundations teams at Legora: backend, compute and platform, the foundation the company scales on.",
    plate: "bloom-blue-1",
    logo: { src: "/logos/legora.webp", aspect: 5.155 },
    site: "https://legora.com",
  },
  {
    id: "beyond-work",
    name: "Beyond Work",
    title: "Product",
    from: "2024-10",
    to: "2025-12",
    tags: ["Product", "Generative AI", "Backend"],
    body: "I led product from zero and built the infrastructure and backend behind it, deploying generative AI against the hardest problems in the enterprise.",
    plate: "field-periwinkle-5",
    logo: { src: "/logos/beyond-work.webp", aspect: 3.587 },
    site: "https://beyondwork.ai",
  },
  {
    id: "corti",
    name: "Corti",
    title: "Senior Software Engineer",
    from: "2023-09",
    to: "2024-09",
    tags: ["Kubernetes", "Go", "Azure", "Linkerd"],
    body: "I architected and implemented Corti’s multi-tenant Kubernetes platform on Azure, with Go services for automation and a custom Linkerd proxy layer that distributes traffic between tenants.",
    plate: "bands-cyan-3",
    logo: { src: "/logos/corti.webp", aspect: 3.08 },
    site: "https://corti.ai",
  },
  {
    id: "rig",
    name: "Rig.dev",
    title: "Founder & CEO",
    from: "2021-01",
    to: "2023-08",
    tags: ["Founder", "Open source", "Go", "Kubernetes"],
    body: "I wrote the first lines of Rig.dev in my dorm room at 23. We raised €2.2M in venture funding, and I led the team that built the open-source application platform for Kubernetes in Go: SDKs, a web console, CLI tools and authentication modules.",
    plate: "layers-green-5",
    logo: { src: "/logos/rig.webp", aspect: 4.11 },
    press: {
      title: "Rig.dev raises €2M for its open-source platform for Kubernetes",
      href: "https://tech.eu/2023/09/04/rig-dev-first-open-source-baas-platform-on-kubernetes/",
    },
  },
  {
    id: "aarhus",
    name: "Aarhus University",
    title: "BSc and MSc Computer Science",
    from: "2018-09",
    to: "2023-01",
    tags: [
      "Cryptography",
      "Algorithms",
      "Machine learning",
      "Distributed systems",
    ],
    body: "A bachelor’s in machine learning, distributed systems and cryptography, then a master’s in cryptography, algorithms and machine learning, with the Grundfos Award for Best Startup along the way. I paused the master’s to build Rig.dev.",
    plate: "wall-pink-4",
  },
];

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

const month = (ym: string) =>
  `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;

export function period(entry: Entry): string {
  return `${month(entry.from)} – ${entry.to ? month(entry.to) : "Now"}`;
}
