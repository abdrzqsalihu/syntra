import CtaButtons from "./CtaButtons";

export default function FinalCta() {
  return (
    <section className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] bg-accent py-24 text-plum-950 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <h2 className="font-headline text-[clamp(4.2rem,11vw,11rem)] leading-[0.82] tracking-[-0.03em]">
          Start your <br />
          next <em>meeting.</em>
        </h2>
        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xs text-lg font-semibold leading-snug">
            Create an account and start a meeting, schedule one for later, or join with a link.
          </p>
          <CtaButtons tone="ink" />
        </div>
      </div>
    </section>
  );
}
