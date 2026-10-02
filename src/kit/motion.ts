"use client";

import { useReducedMotion } from "motion/react";

export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? false;
}
