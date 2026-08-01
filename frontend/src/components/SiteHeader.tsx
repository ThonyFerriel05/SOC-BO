"use client";

import { useEffect, useState } from "react";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[1200] border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--void)_94%,transparent)] backdrop-blur-md">
      <div className={`${INNER} flex h-14 items-center justify-between gap-4`}>
        <a
          href="#inicio"
          className="shrink-0 font-serif text-base font-semibold tracking-tight text-[var(--ink)]"
          onClick={() => setOpen(false)}
        >
          SOC-BO
        </a>

        <nav
          aria-label="Secciones"
          className="hidden items-center gap-5 text-sm md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[var(--mute)] transition-colors hover:text-[var(--ink)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-[var(--line)] text-[var(--ink)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="text-lg leading-none" aria-hidden="true">
            {open ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-[var(--line)] bg-[var(--panel)] md:hidden"
        >
          <nav
            aria-label="Secciones móviles"
            className={`${INNER} flex flex-col py-1`}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-b border-[var(--line)] py-3.5 text-sm text-[var(--ink)] last:border-b-0"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
