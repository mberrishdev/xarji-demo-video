import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// ── Easing functions ────────────────────────────────────────────────────────
export const Easing = {
  linear: (t: number) => t,
  easeInQuad:    (t: number) => t * t,
  easeOutQuad:   (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic:    (t: number) => t * t * t,
  easeOutCubic:   (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart:    (t: number) => t * t * t * t,
  easeOutQuart:   (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),
  easeInExpo:  (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0; if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },
  easeInSine:    (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine:   (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeOutBack: (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  easeInBack:  (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return c3 * t * t * t - c1 * t * t; },
  easeInOutBack: (t: number) => {
    const c1 = 1.70158, c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0; if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// ── Core helpers ────────────────────────────────────────────────────────────
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

type EaseFn = (t: number) => number;

export function interpolate(
  input: number[], output: number[], ease: EaseFn | EaseFn[] = Easing.linear
): (t: number) => number {
  return (t) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? (ease[i] || Easing.linear) : ease;
        return output[i] + (output[i + 1] - output[i]) * easeFn(local);
      }
    }
    return output[output.length - 1];
  };
}

export function animate({
  from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic,
}: { from?: number; to?: number; start?: number; end?: number; ease?: EaseFn }) {
  return (t: number) => {
    if (t <= start) return from;
    if (t >= end) return to;
    return from + (to - from) * ease((t - start) / (end - start));
  };
}

// ── Timeline — bridges Remotion's frame system to seconds ──────────────────
// useTime() returns current playhead in seconds, sourced from Remotion's frame.
export function useTime(): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
}

// ── Sprite ──────────────────────────────────────────────────────────────────
// Renders children only during [start, end] seconds.
interface SpriteCtx { localTime: number; progress: number; duration: number; visible: boolean; }
const SpriteContext = React.createContext<SpriteCtx>({ localTime: 0, progress: 0, duration: 0, visible: true });
export const useSprite = () => React.useContext(SpriteContext);

interface SpriteProps {
  start?: number;
  end?: number;
  keepMounted?: boolean;
  children: React.ReactNode | ((ctx: SpriteCtx) => React.ReactNode);
}

export function Sprite({ start = 0, end = Infinity, keepMounted = false, children }: SpriteProps) {
  const time = useTime();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration) ? clamp(localTime / duration, 0, 1) : 0;
  const value: SpriteCtx = { localTime, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </SpriteContext.Provider>
  );
}

// ── TextSprite ──────────────────────────────────────────────────────────────
interface TextSpriteProps {
  text: string;
  x?: number | string; y?: number | string;
  size?: number; color?: string; font?: string; weight?: number;
  entryDur?: number; exitDur?: number;
  entryEase?: EaseFn; exitEase?: EaseFn;
  align?: "left" | "center" | "right";
  letterSpacing?: string;
}

export function TextSprite({
  text, x = 0, y = 0, size = 48, color = "#111",
  font = "Inter, system-ui, sans-serif", weight = 600,
  entryDur = 0.45, exitDur = 0.35,
  entryEase = Easing.easeOutBack, exitEase = Easing.easeInCubic,
  align = "left", letterSpacing = "-0.01em",
}: TextSpriteProps) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1, ty = 0;

  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime / entryDur, 0, 1));
    opacity = t; ty = (1 - t) * 16;
  } else if (localTime > exitStart) {
    const t = exitEase(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t; ty = -t * 8;
  }

  const translateX = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";

  return (
    <div style={{
      position: "absolute", left: x, top: y,
      transform: `translate(${translateX}, ${ty}px)`,
      opacity, fontFamily: font, fontSize: size, fontWeight: weight, color,
      letterSpacing, whiteSpace: "pre", lineHeight: 1.1, willChange: "transform, opacity",
    }}>
      {text}
    </div>
  );
}
