"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "./cn";

type WithClass<P> = Omit<P, "className"> & { className?: string };

export const ContextMenu = ContextMenuPrimitive.Root;

export function ContextMenuTrigger(props: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

export function ContextMenuContent({
  className,
  children,
  ...props
}: WithClass<ContextMenuPrimitive.Popup.Props>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        collisionPadding={8}
        className="isolate z-[60] outline-none"
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          {...props}
          className={cn("menu", className)}
        >
          {children}
        </ContextMenuPrimitive.Popup>
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

export function ContextMenuItem({
  className,
  ...props
}: WithClass<ContextMenuPrimitive.Item.Props>) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      {...props}
      className={cn("menu-item", className)}
    />
  );
}
