"use client";

import React from "react";
import { StageColor } from "@/types/crm";

interface StageBadgeProps {
  status: string;
  color?: StageColor;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const COLOR_MAP: Record<StageColor, { bg: string; text: string; dot: string; border: string }> = {
  blue: {
    bg: "bg-sky-50",
    text: "text-sky-800",
    dot: "bg-sky-600",
    border: "border-sky-300"
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    dot: "bg-amber-600",
    border: "border-amber-300"
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-800",
    dot: "bg-purple-600",
    border: "border-purple-300"
  },
  emerald: {
    bg: "bg-[#E2EFE4]",
    text: "text-[#0A1D13]",
    dot: "bg-[#25D366]",
    border: "border-[#C5DDC9]"
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-800",
    dot: "bg-rose-600",
    border: "border-rose-300"
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    dot: "bg-indigo-600",
    border: "border-indigo-300"
  },
  gray: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-500",
    border: "border-slate-300"
  }
};

export function getStageColorByName(statusName: string): StageColor {
  const clean = statusName.toLowerCase();
  if (clean.includes("lead") || clean.includes("new")) return "blue";
  if (clean.includes("contact") || clean.includes("call")) return "amber";
  if (clean.includes("follow") || clean.includes("quote") || clean.includes("meet")) return "purple";
  if (clean.includes("won") || clean.includes("convert") || clean.includes("customer")) return "emerald";
  if (clean.includes("lost") || clean.includes("close") || clean.includes("archive")) return "gray";
  return "blue";
}

export function StageBadge({ status, color, className = "", size = "md" }: StageBadgeProps) {
  const chosenColor = color || getStageColorByName(status);
  const theme = COLOR_MAP[chosenColor] || COLOR_MAP.blue;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-xs gap-2"
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase tracking-wider border ${theme.bg} ${theme.text} ${theme.border} ${sizeClasses[size]} ${className}`}
    >
      <span className={`shrink-0 ${theme.dot} ${size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"}`} />
      <span>{status}</span>
    </span>
  );
}
