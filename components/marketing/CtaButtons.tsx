import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { cn } from "@/lib/utils";
import Magnetic from "./Magnetic";

type Tone = "violet" | "ink";

const primary: Record<Tone, string> = {
  violet: "bg-accent text-white hover:bg-white hover:text-plum-950",
  ink: "bg-plum-950 text-white hover:bg-white hover:text-plum-950",
};

export default async function CtaButtons({ tone = "violet" }: { tone?: Tone }) {
  // Read on the server so the buttons are in the first HTML rather than waiting for Clerk in the browser.
  const { userId } = await auth();
  const signedIn = !!userId;
  const pill = cn(
    "group inline-flex h-14 items-center gap-2 rounded-full pl-7 pr-5 text-base font-bold transition-colors duration-300",
    primary[tone]
  );
  const link = cn(
    "text-base font-bold underline decoration-2 underline-offset-[6px] transition-colors",
    tone === "ink"
      ? "decoration-plum-950/30 hover:decoration-plum-950"
      : "decoration-white/25 hover:decoration-accent"
  );
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
      {signedIn ? (
        <>
        <Magnetic>
          <Link href="/dashboard" className={pill}>
            Open dashboard
            <ArrowUpRight
              size={20}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Magnetic>
      </>
      ) : (
        <>
        <Magnetic>
          <Link href="/sign-up" className={pill}>
            Start a meeting
            <ArrowUpRight
              size={20}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Magnetic>
        <Link href="/sign-in" className={link}>
          Sign in
        </Link>
      </>
      )}
    </div>
  );
}
