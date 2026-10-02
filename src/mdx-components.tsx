import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Playground } from "./playground";

function A({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    />
  );
}

const components: MDXComponents = { a: A, Playground };

export function useMDXComponents(): MDXComponents {
  return components;
}
