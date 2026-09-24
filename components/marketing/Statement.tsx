"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

const words: { w: string; hot?: boolean }[] = [
  ..."Meetings shouldn’t feel".split(" ").map((w) => ({ w })),
  { w: "complicated.", hot: true },
  ..."Start a call, schedule one for later, or share a link to bring people in. When it’s over, the recording stays with the meeting, ready whenever you need it.".split(" ").map((w) => ({ w })),
];

function Word({
  w,
  hot,
  progress,
  range,
  reduce,
}: {
  w: string;
  hot?: boolean;
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className={hot ? "italic text-accent" : undefined}>
      {w}{" "}
    </motion.span>
  );
}

export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });

  return (
    <section
      ref={ref}
      className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-paper py-28 text-plum-900 sm:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <p className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-plum-700/70">The idea</p>
        <p className="font-display max-w-[22ch] text-[clamp(2rem,5.4vw,5rem)] font-medium leading-[1.08] tracking-[-0.02em] sm:max-w-[26ch]">
          {words.map((x, i) => (
            <Word
              key={i}
              {...x}
              progress={scrollYProgress}
              range={[(i / words.length) * 0.85, (i / words.length) * 0.85 + 0.08]}
              reduce={reduce}
            />
          ))}
        </p>
      </div>
    </section>
  );
}
