import Link from "next/link";

const cols = [
  {
    title: "Product",
    links: [
      { href: "#how", label: "How it works" },
      { href: "#room", label: "In a meeting" },
      { href: "#recordings", label: "Recordings" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/sign-in", label: "Sign in" },
      { href: "/sign-up", label: "Create account" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative z-0 -mt-10 overflow-hidden bg-plum-950 pt-24">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-10 px-5 sm:px-10 md:flex-row">
        <p className="max-w-xs text-base leading-relaxed text-white/55">
          Video meetings you can start, schedule and record.
        </p>
        <div className="flex gap-16">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-mauve">{c.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm font-semibold text-white/70 transition-colors hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div aria-hidden className="font-headline mt-16 select-none text-center text-[27vw] leading-[0.72] tracking-[-0.04em] text-plum-800">
        Syntra
      </div>
      <p className="sr-only">© {new Date().getFullYear()} Syntra</p>
    </footer>
  );
}
