"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { scenes } from "./StageScenes";

const steps = [
  { n: "01", title: "Start", body: "Start a meeting instantly when you need one." },
  { n: "02", title: "Schedule", body: "Plan a meeting ahead of time and share the details." },
  { n: "03", title: "Join", body: "Use a meeting link to join without unnecessary steps." },
  { n: "04", title: "Record", body: "Record the conversation and find it again when you need it." },
];

export default function Stage() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length * 0.999))));
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    if (window.innerWidth < 1024) {
      setActive(i);
      return;
    }
    const top = el.offsetTop + ((i + 0.5) / steps.length) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  const Scene = scenes[active];

  return (
    <section id="how" ref={ref} className="relative scroll-mt-0 bg-plum-950 lg:h-[380vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-24 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:py-0">
          <div className="flex flex-col justify-center">
            <p className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-mauve">How it works</p>
            <h2 className="font-headline text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.92] tracking-[-0.02em]">
              Everything you need to <em className="text-accent">run a meeting.</em>
            </h2>

            <ol className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {steps.map((s, i) => {
                const on = i === active;
                const Mobile = scenes[i];
                return (
                  <li key={s.n}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={on ? "step" : undefined}
                      className="group flex w-full items-baseline gap-5 py-5 text-left"
                    >
                      <span className={cn("w-8 shrink-0 text-sm font-bold tabular-nums transition-colors", on ? "text-accent" : "text-white/35")}>
                        {s.n}
                      </span>
                      <span className="flex-1">
                        <span
                          className={cn(
                            "font-display block text-3xl font-medium tracking-tight transition-all duration-300 sm:text-4xl",
                            on ? "text-white" : "text-white/40 group-hover:translate-x-1 group-hover:text-white/70"
                          )}
                        >
                          {s.title}
                        </span>
                        <span
                          className={cn(
                            "grid transition-all duration-500 ease-out lg:grid-rows-[0fr]",
                            on && "lg:grid-rows-[1fr]"
                          )}
                        >
                          <span className="overflow-hidden">
                            <span className="mt-3 block max-w-md text-base leading-relaxed text-white/65">{s.body}</span>
                          </span>
                        </span>
                      </span>
                    </button>
                    <div className="pb-8 lg:hidden">
                      <Mobile />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="relative hidden items-center lg:flex">
            <div
              aria-hidden
              className="absolute inset-0 -z-0 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(203,60,255,0.16),transparent)]"
            />
            <div className="relative w-full" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <Scene />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
