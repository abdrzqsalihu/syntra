"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { CalendarClock, MousePointer2 } from "lucide-react";
import MeetingWindow from "./MeetingWindow";

const ease = [0.22, 1, 0.36, 1] as const;

function Line({ children, delay }: { children: ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero({ cta }: { cta: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Pointer-driven tilt, eased with springs.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 20 });
  const sy = useSpring(py, { stiffness: 80, damping: 20 });
  const rotateY = useTransform(sx, [-1, 1], [-3, 3]);
  const rotateX = useTransform(sy, [-1, 1], [2, -2]);

  // Scroll parallax: the window drifts up slower than the page.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      className="relative min-h-[100svh] overflow-hidden bg-plum-950 pt-16"
    >
      {/* editorial column guides */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto grid max-w-[1400px] grid-cols-4 px-5 sm:px-10">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className="border-l border-white/[0.05] last:border-r" />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[70%] w-[75%] bg-[radial-gradient(closest-side,rgba(203,60,255,0.2),rgba(75,18,70,0.22)_55%,transparent)]"
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1400px] grid-cols-[minmax(0,1fr)] items-center gap-12 px-5 py-16 sm:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
        <div>
          <h1 className="font-headline text-[clamp(2.9rem,5.6vw,5.4rem)] leading-[0.98] tracking-[-0.02em]">
            <Line delay={0.05}>Your meetings,</Line>
            <Line delay={0.17}>
              <em className="pr-[0.05em] text-accent">all in one place.</em>
            </Line>
          </h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
          >
            <p className="mt-7 max-w-md text-lg leading-relaxed text-white/70">
              Start a call, schedule ahead, or join with a link. Syntra makes it easy to meet, record, and pick up where you left off.
            </p>
            <div className="mt-9">{cta}</div>
          </motion.div>
        </div>

        <motion.div
          style={{ y: drift }}
          initial={reduce ? false : { opacity: 0, y: 50 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="relative lg:-mr-[6vw]"
        >
          <div className="[perspective:1600px]">
            <motion.div style={reduce ? undefined : { rotateX, rotateY }} className="relative [transform-style:preserve-3d]">
              <MeetingWindow />

              {/* cursor label, as in a collaborative canvas */}
              <motion.div
                aria-hidden
                className="absolute left-[38%] top-[36%] hidden items-start sm:flex"
                animate={reduce ? undefined : { x: [0, 14, 0], y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <MousePointer2 size={20} className="fill-accent text-accent" />
                <span className="ml-1 mt-4 rounded-md rounded-tl-none bg-accent px-2 py-1 text-xs font-bold text-white">
                  Amara
                </span>
              </motion.div>

              {/* scheduled meeting, overlapping the window edge */}
              <motion.div
                aria-hidden
                className="absolute -left-6 bottom-16 hidden items-center gap-3 rounded-xl border border-white/10 bg-plum-800 px-4 py-3 shadow-2xl sm:flex lg:-left-10"
                animate={reduce ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <CalendarClock size={18} />
                </span>
                <span className="text-sm">
                  <span className="block font-bold">Design review</span>
                  <span className="block text-xs tabular-nums text-white/60">Tue 10:30 · Scheduled</span>
                </span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
