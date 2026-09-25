"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ControlTone = "default" | "off" | "on" | "danger";

const tones: Record<ControlTone, string> = {
  default: "bg-white/[0.07] text-white hover:bg-white/[0.13]",
  // Muted mic, camera off, blocked device
  off: "bg-live/15 text-live hover:bg-live/25",
  // Active toggles such as screen sharing or an open panel
  on: "bg-dark-2 text-white hover:bg-dark-2/90",
  danger: "bg-live text-white hover:bg-live/90",
};

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  tone?: ControlTone;
  pressed?: boolean;
  badge?: ReactNode;
  children: ReactNode;
};

/** Round-cornered icon button used in the call control bars. 48px on touch, 44px from md up. */
export const ControlButton = forwardRef<HTMLButtonElement, Props>(
  function ControlButton(
    { label, tone = "default", pressed, badge, className, children, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        aria-pressed={pressed}
        className={cn(
          "relative inline-flex size-11 shrink-0 md:size-10 items-center justify-center rounded-xl border border-gray-900/80 transition-colors",
          "active:scale-95 disabled:pointer-events-none disabled:opacity-40",
          tones[tone],
          className
        )}
        {...rest}
      >
        {children}
        {badge !== undefined && (
          <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-dark-2 px-1 text-center text-[10px] font-bold leading-[18px] tabular-nums text-white">
            {badge}
          </span>
        )}
      </button>
    );
  }
);

/** Larger labelled tile for the mobile "More" sheet. */
export const SheetAction = forwardRef<
  HTMLButtonElement,
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    label: string;
    tone?: ControlTone;
    icon: ReactNode;
  }
>(function SheetAction({ label, tone = "default", icon, className, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-xl border border-gray-900/80 px-2 py-3 text-center text-xs font-semibold transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        tones[tone],
        className
      )}
      {...rest}
    >
      {icon}
      <span className="leading-tight">{label}</span>
    </button>
  );
});
