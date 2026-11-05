"use client";

import { createContext, useContext, type ReactNode } from "react";
import { motionValue, type MotionValue } from "motion/react";

export type Tone = "dark" | "light";

export type SlideDef = {
  id: string;
  section: string;
  title: string;
  tone: Tone;
  render: () => ReactNode;
};

export const DeckContext = createContext<{ goTo: (id: string | number) => void; index: number }>({
  goTo: () => {},
  index: 0,
});

export const useDeck = () => useContext(DeckContext);

/** Posição do mouse normalizada no palco: -0.5 … 0.5 (centro = 0). */
export const MouseContext = createContext<{ x: MotionValue<number>; y: MotionValue<number> }>({
  x: motionValue(0),
  y: motionValue(0),
});

export const useStageMouse = () => useContext(MouseContext);
