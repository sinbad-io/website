import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DESCRIPTION, NAME } from "@/profile";
import { Dialogs } from "@/work";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://oscaraborellana.com"),
  title: { default: NAME, template: `%s · ${NAME}` },
  description: DESCRIPTION,
  twitter: { card: "summary_large_image", creator: "@oscaraborellana" },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <div className="ground" aria-hidden="true" />
        {children}
        <Dialogs />
        <script src="/site.js" defer data-keep="" />
      </body>
    </html>
  );
}
