import type { Metadata } from "next";
import CtaButtons from "@/components/marketing/CtaButtons";
import FinalCta from "@/components/marketing/FinalCta";
import Hero from "@/components/marketing/Hero";
import Recordings from "@/components/marketing/Recordings";
import Room from "@/components/marketing/Room";
import Stage from "@/components/marketing/Stage";
import Statement from "@/components/marketing/Statement";

export const metadata: Metadata = {
  title: {
    absolute: "Syntra: video meetings you can start, schedule and record",
  },
  description:
    "Start an instant meeting, schedule one for later, join from a link, and keep every recording in one place.",
};

export default function LandingPage() {
  return (
    <>
      <Hero cta={<CtaButtons />} />
      <Statement />
      <Stage />
      <Room />
      <Recordings />
      <FinalCta />
    </>
  );
}
