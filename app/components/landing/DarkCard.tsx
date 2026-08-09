"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

type CardVariant = "default" | "danger" | "accent";

interface DarkCardProps {
  children: ReactNode;
  hover?: boolean;
  variant?: CardVariant;
  className?: string;
  padding?: string;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

const variants: Record<CardVariant, string> = {
  default: "bg-[#111] border-white/[0.06]",
  danger: "bg-red-500/[0.04] border-red-500/[0.12]",
  accent:
    "bg-gradient-to-b from-emerald-500/[0.06] to-[#111] border-emerald-500/30",
};

const hoverAccents: Record<CardVariant, string> = {
  default:
    "[@media(hover:hover)]:hover:border-emerald-500/20 [@media(hover:hover)]:hover:bg-[#141414] [@media(hover:hover)]:hover:shadow-emerald-500/[0.02]",
  danger:
    "[@media(hover:hover)]:hover:border-red-500/25 [@media(hover:hover)]:hover:bg-red-500/[0.06] [@media(hover:hover)]:hover:shadow-red-500/[0.04]",
  accent:
    "[@media(hover:hover)]:hover:border-emerald-500/40 [@media(hover:hover)]:hover:shadow-emerald-500/[0.04]",
};

const activeAccents: Record<CardVariant, string> = {
  default: "active:border-emerald-500/25 active:bg-[#141414]",
  danger: "active:border-red-500/30 active:bg-red-500/[0.08]",
  accent: "active:border-emerald-500/45 active:bg-[#141414]",
};

const focusRings: Record<CardVariant, string> = {
  default: "focus-visible:ring-emerald-500/50",
  danger: "focus-visible:ring-red-500/50",
  accent: "focus-visible:ring-emerald-500/60",
};

export default function DarkCard({
  children,
  hover = false,
  variant = "default",
  className = "",
  padding = "p-6",
  href,
  onClick,
  ariaLabel,
}: DarkCardProps) {
  const isInteractive = Boolean(href || onClick);

  // No padding, no color, no border classes live here — every property that
  // a caller might want to override (padding, background, border) is either
  // its own prop or lives only in `variants`, so `className` only ever adds
  // new utilities (positioning, width, transforms) rather than competing
  // with base classes over the same property.
  const baseStyle =
    "group relative overflow-hidden rounded-3xl border shadow-lg shadow-black/20 " +
    "transition-[transform,box-shadow,border-color,background-color] duration-300 " +
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0";

  // Lift/press feedback only applies when the card is a real clickable unit —
  // a container that merely holds a button shouldn't itself feel "pressable".
  const liftStyle =
    hover && isInteractive
      ? `cursor-pointer [@media(hover:hover)]:hover:-translate-y-1.5 [@media(hover:hover)]:hover:shadow-2xl ${hoverAccents[variant]} active:scale-[0.98] active:duration-100 ${activeAccents[variant]}`
      : hover
        ? hoverAccents[variant] // decorative hover glow only, no lift/press
        : "";

  const focusStyle = isInteractive
    ? `outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${focusRings[variant]}`
    : "";

  const classes = [
    baseStyle,
    padding,
    variants[variant],
    liftStyle,
    focusStyle,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const hairline = (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {hairline}
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={classes}
        aria-label={ariaLabel}
      >
        {hairline}
        {children}
      </button>
    );
  }

  return (
    <div className={classes}>
      {hairline}
      {children}
    </div>
  );
}
