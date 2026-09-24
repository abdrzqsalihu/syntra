"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, Circle, Copy, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import MeetingWindow, { Feed, feeds } from "./MeetingWindow";

const frame = "rounded-2xl border border-white/10 bg-plum-900 p-5 sm:p-6";

function useRise() {
  const reduce = useReducedMotion();
  return (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  });
}

function StartScene() {
  const rise = useRise();
  return (
    <div className="space-y-4">
      <motion.div {...rise(0)} className="flex items-center justify-between rounded-2xl bg-accent p-6 shadow-[0_20px_50px_-20px_rgba(203,60,255,0.7)]">
        <div>
          <p className="font-display text-3xl font-medium">New meeting</p>
          <p className="mt-1 text-sm text-white/80">Start an instant meeting</p>
        </div>
        <span className="flex size-11 items-center justify-center rounded-full bg-white/20">
          <Plus size={22} aria-hidden />
        </span>
      </motion.div>
      <motion.div {...rise(1)} className={cn(frame, "flex items-center justify-between gap-3 !p-4")}>
        <span className="truncate text-sm tabular-nums text-white/80">syntra.app/meeting/k7f-2qm</span>
        <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold">
          <Copy size={12} aria-hidden /> Copy link
        </span>
      </motion.div>
      <motion.div {...rise(2)}>
        <Feed {...feeds[3]} className="aspect-[16/8] w-full" />
        <p className="mt-3 text-sm text-white/60">You are in. Waiting for others to join.</p>
      </motion.div>
    </div>
  );
}

function ScheduleScene() {
  const rise = useRise();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return (
    <div className="space-y-4">
      <motion.div {...rise(0)} className={frame}>
        <div className="grid grid-cols-5 gap-2">
          {days.map((d, i) => (
            <div key={d} className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">{d}</p>
              <div className="mt-2 space-y-1.5">
                {[0, 1, 2].map((s) => {
                  const on = i === 1 && s === 1;
                  return (
                    <span
                      key={s}
                      className={cn(
                        "block rounded-md py-2 text-xs tabular-nums",
                        on ? "bg-accent font-bold text-white" : "bg-white/[0.05] text-white/50"
                      )}
                    >
                      {["09:00", "10:30", "14:00"][s]}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div {...rise(1)} className={cn(frame, "space-y-3 !p-4")}>
        <p className="text-xs font-bold uppercase tracking-wider text-white/50">Description</p>
        <p className="rounded-lg bg-plum-950 px-3 py-2.5 text-sm">Design review</p>
        <p className="text-xs font-bold uppercase tracking-wider text-white/50">Date and time</p>
        <p className="rounded-lg bg-plum-950 px-3 py-2.5 text-sm tabular-nums">Tuesday, 10:30 AM</p>
        <span className="block rounded-lg bg-accent py-2.5 text-center text-sm font-bold">Schedule meeting</span>
      </motion.div>
    </div>
  );
}

function JoinScene() {
  const rise = useRise();
  const reduce = useReducedMotion();
  return (
    <div className="space-y-4">
      <motion.div {...rise(0)} className={cn(frame, "!p-4")}>
        <p className="text-xs font-bold uppercase tracking-wider text-white/50">Paste the link here</p>
        <div className="mt-2 flex items-center rounded-lg bg-plum-950 px-3 py-3 text-sm tabular-nums">
          <motion.span
            className="inline-block overflow-hidden whitespace-nowrap"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: "auto" }}
            transition={{ duration: 1.1, delay: 0.3, ease: "linear" }}
          >
            https://syntra.app/meeting/k7f-2qm
          </motion.span>
          <span className="ml-0.5 h-4 w-px animate-pulse-live bg-accent" />
        </div>
      </motion.div>
      <motion.div {...rise(1)} className={cn(frame, "!p-4")}>
        <Feed {...feeds[3]} className="aspect-[16/7] w-full" />
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-white/70">
            <span className="flex size-4 items-center justify-center rounded border border-white/30">
              <Check size={11} aria-hidden className="text-accent" />
            </span>
            Join with mic and camera off
          </span>
          <span className="whitespace-nowrap rounded-lg bg-accent px-4 py-2 text-sm font-bold">Join meeting</span>
        </div>
      </motion.div>
    </div>
  );
}

function RecordScene() {
  const rise = useRise();
  return (
    <div className="space-y-4">
      <motion.div {...rise(0)}>
        <MeetingWindow layout="grid" />
      </motion.div>
      <motion.div {...rise(2)} className={cn(frame, "flex items-center justify-between !p-4")}>
        <span className="flex items-center gap-3">
          <Circle size={9} fill="currentColor" className="text-live" aria-hidden />
          <span className="text-sm">
            <span className="block font-bold">Design review</span>
            <span className="block text-xs tabular-nums text-white/60">42:10 · Saved to Recordings</span>
          </span>
        </span>
        <Check size={18} className="text-accent" aria-hidden />
      </motion.div>
    </div>
  );
}

export const scenes = [StartScene, ScheduleScene, JoinScene, RecordScene];
