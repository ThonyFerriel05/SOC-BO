const NAV_LINKS = [
  { href: "#explorador", label: "Explorador" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#dataset", label: "Dataset" },
  { href: "#limitaciones", label: "Limitaciones" },
  { href: "#acceso", label: "Acceso a datos" },
  { href: "#sobre", label: "Sobre el proyecto" },
] as const;

const INNER =
  "mx-auto w-full max-w-xl px-5 sm:max-w-2xl sm:px-6 md:max-w-4xl lg:max-w-5xl lg:px-8";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-[1200] bg-[color-mix(in_srgb,var(--void)_92%,transparent)] backdrop-blur-md">
      <div className="anomaly-bar" aria-hidden="true" />
      <div className={`${INNER} flex h-14 items-center justify-between gap-4`}>
        <a
          href="#inicio"
          className="shrink-0 font-serif text-base font-semibold tracking-tight text-[var(--neutral)]"
        >
          SOC-BO
        </a>
        <nav
          aria-label="Secciones"
          className="flex min-w-0 items-center gap-1 overflow-x-auto text-xs sm:gap-4 sm:text-sm"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 px-1.5 py-1 text-[var(--ash)] transition-colors hover:text-[var(--neutral)] sm:px-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-b border-[var(--line)]" />
    </header>
  );
}
