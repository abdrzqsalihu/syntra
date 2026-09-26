"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState } from "react";

/**
 * Site-wide smooth scrolling (Lenis). Mount once, in the root layout.
 *
 * - Desktop wheel/trackpad is smoothed; touch keeps native scrolling, which is what phones do best.
 * - Anchor links (#section) are handled by Lenis, and nested scroll containers keep working.
 * - Not mounted at all when the visitor prefers reduced motion, so they get plain native scrolling.
 * - Paused while a modal or sheet has locked page scroll, so the page behind it never moves.
 */

function ScrollLockSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    // Radix (dialogs, sheets, dropdowns) marks the body while it locks scroll.
    const sync = () =>
      document.body.hasAttribute("data-scroll-locked") ? lenis.stop() : lenis.start();
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });
    return () => observer.disconnect();
  }, [lenis]);

  return null;
}

export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!enabled) return null;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.11, // between responsive (1) and floaty (0.05)
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
      }}
    >
      <ScrollLockSync />
    </ReactLenis>
  );
}
