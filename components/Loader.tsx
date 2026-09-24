import { LucideLoader } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

/**
 * Centered loading state. Fills the available area by default;
 * use `fullscreen` when nothing else has rendered yet (for example while the app connects).
 */
function Loader({ fullscreen = false }: { fullscreen?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-full items-center justify-center",
        fullscreen ? "h-dvh bg-dark-1" : "min-h-[45vh]"
      )}
    >
      <LucideLoader className="animate-spin text-dark-2" size={28} aria-hidden />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default Loader;
