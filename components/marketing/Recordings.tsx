"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Feed, feeds } from "./MeetingWindow";

const rows = [
  { title: "Design review", when: "Monday", len: "42:10", feed: 0 },
  { title: "Sprint planning", when: "Last week", len: "58:04", feed: 2 },
  { title: "Customer call", when: "Last week", len: "25:31", feed: 1 },
  { title: "Retro", when: "Two weeks ago", len: "36:47", feed: 3 },
];

export default function Recordings() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const r = rows[i];

  return (
    <section id="recordings" className="relative bg-plum-950 py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <p className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-mauve">Recordings</p>
        <h2 className="font-headline max-w-4xl text-[clamp(3rem,7.2vw,7.2rem)] leading-[0.88] tracking-[-0.025em]">
          Your meetings, <em className="text-accent">saved and easy to find.</em>
        </h2>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
          Recordings stay organized alongside your meetings, so you can come back to them whenever you need.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <ul className="border-t border-white/10" onMouseLeave={() => setI(0)}>
            {rows.map((row, idx) => {
              const on = idx === i;
              return (
                <li key={row.title} className="border-b border-white/10">
                  <button
                    type="button"
                    onMouseEnter={() => setI(idx)}
                    onFocus={() => setI(idx)}
                    className="group flex w-full items-baseline justify-between gap-4 py-6 text-left sm:py-8"
                  >
                    <span className="flex items-baseline gap-5 sm:gap-8">
                      <span className={cn("w-7 text-sm font-bold tabular-nums transition-colors", on ? "text-accent" : "text-white/30")}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-3xl font-medium tracking-tight transition-all duration-300 sm:text-5xl",
                          on ? "translate-x-2 text-white" : "text-white/35"
                        )}
                      >
                        {row.title}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-sm tabular-nums text-white/55">
                      <span className="block">{row.len}</span>
                      <span className="block text-xs text-white/35">{row.when}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-plum-900"
                >
                  <div className="relative">
                    <Feed {...feeds[r.feed]} label={false} className="aspect-video w-full !rounded-none" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex size-16 items-center justify-center rounded-full bg-white text-plum-950 shadow-2xl">
                        <Play size={22} className="ml-0.5 fill-current" aria-hidden />
                      </span>
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-display text-2xl font-medium">{r.title}</p>
                    <div className="mt-4 h-1 rounded-full bg-white/10">
                      <motion.div
                        key={r.title}
                        className="h-full rounded-full bg-accent"
                        initial={reduce ? false : { width: "0%" }}
                        animate={{ width: "38%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </div>
                    <p className="mt-3 flex justify-between text-xs tabular-nums text-white/50">
                      <span>{r.when}</span>
                      <span>{r.len}</span>
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <p className="mt-10 text-sm text-white/40">Example data. Upcoming, Previous and Recordings each have their own page in the dashboard.</p>
      </div>
    </section>
  );
}
