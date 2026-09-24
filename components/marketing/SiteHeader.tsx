"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#room", label: "In a meeting" },
  { href: "#recordings", label: "Recordings" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-plum-950/95 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-10">
        <Link href="/" aria-label="Syntra home">
          <Image src="/logo-2.png" width={100} height={32} alt="Syntra" className="h-auto w-24" priority />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <SignedOut>
            <Link href="/sign-in" className="hidden text-sm font-semibold text-white/70 transition-colors hover:text-white sm:block">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-plum-950"
            >
              Get started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-plum-950"
            >
              Open dashboard
            </Link>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
