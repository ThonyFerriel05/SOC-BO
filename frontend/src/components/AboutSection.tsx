import { ABOUT } from "@/content/about";

const INNER =
  "mx-auto w-full max-w-xl px-5 sm:max-w-2xl sm:px-6 md:max-w-4xl lg:max-w-5xl lg:px-8";

export default function AboutSection() {
  return (
    <footer
      id="sobre"
      className="section-panel scroll-mt-16 py-10 sm:py-12"
    >
      <div className={`${INNER} flex flex-col gap-3`}>
        <h2 className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--mute)]">
          <span className="motif-dots" aria-hidden="true" />
          Sobre el proyecto
        </h2>
        <p className="max-w-2xl text-xs leading-relaxed text-[var(--mute)]">
          {ABOUT.descripcion}
        </p>
        <dl className="mt-2 grid gap-2 font-mono text-[11px] text-[var(--mute)] sm:grid-cols-2">
          {ABOUT.autores.map((autor) => (
            <div key={autor.nombre} className="border-t border-[var(--line)] pt-2">
              <dt className="text-[var(--ink)]">{autor.nombre}</dt>
              <dd>{autor.rol}</dd>
            </div>
          ))}
          <div className="border-t border-[var(--line)] pt-2 sm:col-span-2">
            <dt className="text-[var(--ink)]">Contacto</dt>
            <dd>
              <a
                href={`mailto:${ABOUT.contacto.email}`}
                className="underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--amber)] hover:decoration-[var(--amber)]"
              >
                {ABOUT.contacto.email}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
