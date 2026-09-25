import type { SignIn } from "@clerk/nextjs";
import type { ComponentProps } from "react";

type Appearance = NonNullable<ComponentProps<typeof SignIn>["appearance"]>;

/**
 * Clerk styling for the sign-in and sign-up cards, matched to the landing page:
 * plum surfaces, violet accent, pill buttons and the Instrument Serif headline.
 * Utilities carry `!` because Clerk injects its own styles after ours.
 */
export const authAppearance: Appearance = {
  variables: {
    colorPrimary: "#CB3CFF",
    colorBackground: "#14061D",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.65)",
    colorInputBackground: "#0A0212",
    colorInputText: "#ffffff",
    colorNeutral: "#ffffff",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-nunito), system-ui, sans-serif",
  },
  elements: {
    cardBox: "!shadow-none",
    card: "!border !border-white/10 !bg-plum-900 !shadow-2xl",
    headerTitle: "!font-headline !text-[2rem] !font-normal !tracking-tight",
    headerSubtitle: "!text-white/60",
    formButtonPrimary:
      "!rounded-full !bg-accent !font-bold !normal-case !shadow-none hover:!bg-white hover:!text-plum-950",
    formFieldLabel: "!font-bold !text-white/80",
    formFieldInput: "!border-white/10 !bg-plum-950 focus:!border-accent",
    socialButtonsIconButton: "!border-white/10 !bg-white/[0.04] hover:!bg-white/10",
    socialButtonsBlockButton: "!border-white/10 !bg-white/[0.04] hover:!bg-white/10",
    dividerLine: "!bg-white/10",
    dividerText: "!text-white/50",
    footer: "!bg-plum-800/60",
    footerActionText: "!text-white/60",
    footerActionLink: "!font-bold !text-accent hover:!text-white",
    identityPreviewEditButton: "!text-accent",
    formResendCodeLink: "!text-accent",
  },
};
