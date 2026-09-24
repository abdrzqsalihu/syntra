"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Circle,
  Copy,
  LayoutGrid,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Users,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type WindowLayout = "speaker" | "grid";
export type ControlId =
  | "mic"
  | "camera"
  | "screen"
  | "layout"
  | "people"
  | "record"
  | "copy"
  | "leave";

const people = [
  { name: "Amara O.", tone: "from-accent/70 via-ultra/50 to-plum-800", muted: false },
  { name: "Daniel K.", tone: "from-wine via-plum-800 to-plum-900", muted: true },
  { name: "Priya S.", tone: "from-ultra/50 via-plum-800 to-plum-900", muted: false },
  { name: "You", tone: "from-mauve/40 via-wine/60 to-plum-900", muted: false },
];

/** A video "feed": tonal gradient with a head-and-shoulders silhouette. */
export function Feed({
  name,
  tone,
  muted,
  speaking,
  className,
  label = true,
}: {
  name: string;
  tone: string;
  muted?: boolean;
  speaking?: boolean;
  className?: string;
  label?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br",
        tone,
        speaking && "ring-2 ring-accent",
        className
      )}
    >
      <div aria-hidden className="absolute inset-x-0 bottom-0 mx-auto w-[42%] min-w-10">
        <div className="absolute -top-[46%] left-1/2 aspect-square w-[62%] -translate-x-1/2 rounded-full bg-plum-950/60" />
        <div className="aspect-[5/3] rounded-t-full bg-plum-950/60" />
      </div>
      {label && (
        <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-plum-950/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {muted && <MicOff size={11} className="text-live" aria-hidden />}
          {name}
        </span>
      )}
    </div>
  );
}

export const feeds = people;

function useElapsed(start = 754) {
  const [s, setS] = useState(start);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [reduce]);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const controls: { id: ControlId; icon: typeof Mic; label: string }[] = [
  { id: "mic", icon: Mic, label: "Microphone" },
  { id: "camera", icon: Video, label: "Camera" },
  { id: "screen", icon: MonitorUp, label: "Share screen" },
  { id: "layout", icon: LayoutGrid, label: "Layout" },
  { id: "people", icon: Users, label: "Participants" },
  { id: "record", icon: Circle, label: "Record" },
  { id: "copy", icon: Copy, label: "Copy invite link" },
  { id: "leave", icon: PhoneOff, label: "Leave call" },
];

export default function MeetingWindow({
  layout = "speaker",
  recording = true,
  highlight,
  onControl,
  className,
}: {
  layout?: WindowLayout;
  recording?: boolean;
  highlight?: ControlId | null;
  /** When provided, controls become interactive buttons. */
  onControl?: (id: ControlId | null, kind: "hover" | "click") => void;
  className?: string;
}) {
  const time = useElapsed();
  const speaker = layout === "speaker";
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-plum-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="flex gap-1.5" aria-hidden>
            <i className="size-2.5 rounded-full bg-white/15" />
            <i className="size-2.5 rounded-full bg-white/15" />
            <i className="size-2.5 rounded-full bg-white/15" />
          </span>
          <span className="ml-2 hidden tabular-nums sm:inline">syntra.app/meeting/</span>
          <span className="rounded bg-white/[0.07] px-1.5 py-0.5 tabular-nums text-white/85">k7f-2qm</span>
        </div>
        {recording && (
          <div className="flex items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-1 text-[11px] font-bold tabular-nums text-live">
            <Circle size={7} fill="currentColor" className="animate-pulse-live" aria-hidden />
            REC {time}
          </div>
        )}
      </div>

      <div
        className={cn(
          "grid aspect-[16/10] gap-2 p-3 sm:gap-3 sm:p-4",
          speaker ? "grid-cols-[2fr_1fr] grid-rows-3" : "grid-cols-2 grid-rows-2"
        )}
      >
        {people.map((p, i) => (
          <motion.div
            key={p.name}
            layout
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className={cn("min-h-0", speaker && i === 0 && "row-span-3")}
          >
            <Feed {...p} speaking={i === 0} className="size-full" />
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1 border-t border-white/[0.07] px-2 py-3 sm:gap-2 sm:px-3">
        {controls.map((c) => {
          const cls = cn(
            "flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/80 transition-colors sm:size-9",
            c.id === "leave" && "border-transparent bg-live text-white",
            c.id === "record" && recording && "text-live",
            highlight === c.id && c.id !== "leave" && "border-accent bg-accent/25 text-white"
          );
          return onControl ? (
            <button
              key={c.id}
              type="button"
              aria-label={c.label}
              className={cn(cls, "hover:border-accent/60 hover:bg-accent/15")}
              onMouseEnter={() => onControl(c.id, "hover")}
              onMouseLeave={() => onControl(null, "hover")}
              onFocus={() => onControl(c.id, "hover")}
              onBlur={() => onControl(null, "hover")}
              onClick={() => onControl(c.id, "click")}
            >
              <c.icon size={15} aria-hidden />
            </button>
          ) : (
            <span key={c.id} aria-hidden className={cls}>
              <c.icon size={15} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
