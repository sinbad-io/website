"use client";

import { useState, type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/kit/context-menu";

const KEY = "drafts";

/** The name's context menu: one secret item that lists draft posts in this browser. */
export function DraftsMenu({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(false);
  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (open)
          setShown(document.documentElement.classList.contains("drafts"));
      }}
    >
      <ContextMenuTrigger className="colophon-menu">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            const next = !shown;
            document.documentElement.classList.toggle("drafts", next);
            if (next) localStorage.setItem(KEY, "1");
            else localStorage.removeItem(KEY);
          }}
        >
          {shown ? "Hide drafts" : "Show drafts"}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
