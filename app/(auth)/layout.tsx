import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MeetingWindow from "@/components/marketing/MeetingWindow";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-plum-900 p-10 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-accent/20 blur-[100px]"
        />
        <Link href="/" aria-label="Syntra home" className="relative w-fit">
          <Image src="/logo-2.png" width={100} height={32} alt="Syntra" className="h-auto w-24" />
        </Link>
        <div className="relative">
          <MeetingWindow layout="grid" className="max-w-md" />
          <p className="mt-8 max-w-sm text-xl font-medium leading-snug tracking-tight">
            Start, schedule and record meetings from one place.
          </p>
        </div>
      </div>
      <div className="relative flex flex-col items-center justify-center px-4 py-12">
        <Link
          href="/"
          className="absolute left-4 top-4 flex items-center gap-1.5 text-sm text-fg/60 transition-colors hover:text-fg sm:left-8 sm:top-8"
        >
          <ArrowLeft size={14} aria-hidden /> Back
        </Link>
        {children}
      </div>
    </div>
  );
}
