import { Fraunces, Instrument_Serif } from "next/font/google";
import SiteFooter from "@/components/marketing/SiteFooter";
import SiteHeader from "@/components/marketing/SiteHeader";

// Marketing-only type. Product UI stays on Nunito.
// Instrument Serif: condensed, high-contrast headline voice (hero, section titles, closing).
// Fraunces: softer editorial voice (statement, step and row titles); its rounded terminals echo Nunito.
const headline = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-headline",
});

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-display",
});

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${display.variable} ${headline.variable} relative bg-plum-950 text-white`}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
