"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

type SprayEffectProps = {
  /** Only pass true when this is a genuinely first-time user (see gating below) */
  show: boolean;
  /** Called once the animation is done — use this to flip the "seen" flag server-side */
  onFinished?: () => void;
};

export default function SprayEffect({ show, onFinished }: SprayEffectProps) {
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!show || hasFiredRef.current) return;
    hasFiredRef.current = true;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      onFinished?.();
      return;
    }

    const duration = 2200;
    const end = Date.now() + duration;

    const colors = ["#22C55E", "#4ADE80", "#FBBF24", "#16A34A"];

    // two angled cannons from bottom corners, like party poppers
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.9 },
        colors,
        startVelocity: 45,
        gravity: 0.9,
        ticks: 200,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.9 },
        colors,
        startVelocity: 45,
        gravity: 0.9,
        ticks: 200,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // one big center burst right at the start for punch
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.55 },
      colors,
      startVelocity: 55,
      ticks: 250,
    });

    const timer = setTimeout(() => onFinished?.(), duration + 300);
    return () => clearTimeout(timer);
  }, [show]);

  return null;
}
