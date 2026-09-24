"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import MeetingWindow, { type ControlId, type WindowLayout } from "./MeetingWindow";

const legend: { id: ControlId; title: string; body: string }[] = [
  { id: "screen", title: "Share your screen", body: "Present without leaving the meeting." },
  { id: "layout", title: "Change the layout", body: "Switch between speaker and grid views." },
  { id: "people", title: "See who’s here", body: "Open the participant list without leaving the call." },
  { id: "record", title: "Record it", body: "Start recording directly from the meeting." },
  { id: "copy", title: "Invite anyone", body: "Copy and share the meeting link." },
];

export default function Room() {
  const [layout, setLayout] = useState<WindowLayout>("speaker");
  const [hot, setHot] = useState<ControlId | null>(null);

  const onControl = (id: ControlId | null, kind: "hover" | "click") => {
    if (kind === "hover") setHot(id);
    else if (id === "layout") setLayout((l) => (l === "speaker" ? "grid" : "speaker"));
  };

  return (
    <section id="room" className="relative z-10 -mt-10 scroll-mt-0 rounded-t-[2.5rem] bg-paper py-24 text-plum-900 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-plum-700/70">In a meeting</p>
            <h2 className="font-headline text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.9] tracking-[-0.025em]">
              Everything you need, <em className="text-accent">right where you need it.</em>
            </h2>
          </div>
          <p className="max-w-sm text-lg leading-relaxed text-plum-800/80">
            Participants stay central and controls stay within reach, so the interface never gets in the way of the conversation.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.55fr_1fr] lg:gap-16">
          <div className="lg:-ml-[3.5vw]">
            <MeetingWindow layout={layout} highlight={hot} onControl={onControl} />
            <div role="group" aria-label="Layout" className="mt-5 inline-flex rounded-full bg-plum-900/10 p-1 text-sm font-bold">
              {(["speaker", "grid"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={layout === l}
                  onClick={() => setLayout(l)}
                  className={cn(
                    "rounded-full px-5 py-2 capitalize transition-colors",
                    layout === l ? "bg-plum-900 text-white" : "text-plum-900/70 hover:text-plum-900"
                  )}
                >
                  {l}
                </button>
              ))}
              <span className="ml-4 text-sm text-plum-800/70">Try it: switch the layout.</span>
            </div>
          </div>

          <ul className="divide-y divide-plum-900/15 border-y border-plum-900/15">
            {legend.map((l, i) => {
              const on = hot === l.id;
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setHot(l.id)}
                    onMouseLeave={() => setHot(null)}
                    onFocus={() => setHot(l.id)}
                    onBlur={() => setHot(null)}
                    onClick={() => l.id === "layout" && setLayout((v) => (v === "speaker" ? "grid" : "speaker"))}
                    className="flex w-full items-baseline gap-4 py-5 text-left"
                  >
                    <span className={cn("w-6 text-sm font-bold tabular-nums transition-colors", on ? "text-accent" : "text-plum-900/40")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn("transition-transform duration-300", on && "translate-x-1.5")}>
                      <span className="font-display block text-2xl font-medium tracking-tight">{l.title}</span>
                      <span className="mt-1 block max-w-xs text-sm leading-relaxed text-plum-800/75">{l.body}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
