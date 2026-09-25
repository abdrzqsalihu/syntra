import { Instrument_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MeetingWindow from "@/components/marketing/MeetingWindow";

// Same headline face as the landing page.
const headline = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-headline",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${headline.variable} grid min-h-dvh bg-plum-950 text-white lg:grid-cols-2`}>
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-plum-900 p-10 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-16 h-96 w-96 rounded-full bg-accent/20 blur-[110px]"
        />
        <Link href="/" aria-label="Syntra home" className="relative w-fit">
          <Image src="/logo-2.png" width={100} height={32} alt="Syntra" className="h-auto w-24" priority />
        </Link>
        <div className="relative">
          <MeetingWindow layout="grid" className="max-w-md" />
          <p className="font-headline mt-10 max-w-md text-5xl leading-[1.02] tracking-[-0.02em]">
            Your meetings, <em className="text-accent">all in one place.</em>
          </p>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/60">
            Start a call, schedule ahead, or join with a link.
          </p>
        </div>
      </div>
      <div className="relative flex flex-col items-center justify-center px-4 py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-[120px]"
        />
        <Link
          href="/"
          className="absolute left-4 top-4 flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white sm:left-8 sm:top-8"
        >
          <ArrowLeft size={14} aria-hidden /> Back
        </Link>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
