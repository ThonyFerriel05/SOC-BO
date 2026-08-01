import { ABOUT } from "@/content/about";

const INNER =
  "mx-auto w-full max-w-xl px-5 sm:max-w-2xl sm:px-6 md:max-w-4xl lg:max-w-5xl lg:px-8";

export default function AboutSection() {
  return (
    <footer
      id="sobre"
      className="scroll-mt-16 border-t border-[var(--line)] bg-[var(--void)] py-10 sm:py-12"
    >
      <div className={`${INNER} flex flex-col gap-3`}>
        <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ash)]">
          Sobre el proyecto
        </h2>
        <p className="max-w-2xl text-xs leading-relaxed text-[var(--ash)]">
          {ABOUT.descripcion}
        </p>
        <dl className="mt-2 grid gap-2 font-mono text-[11px] text-[var(--ash)] sm:grid-cols-2">
          {ABOUT.autores.map((autor) => (
            <div key={autor.nombre} className="border-t border-[var(--line)] pt-2">
              <dt className="text-[var(--mist)]">{autor.nombre}</dt>
              <dd>{autor.rol}</dd>
            </div>
          ))}
          <div className="border-t border-[var(--line)] pt-2 sm:col-span-2">
            <dt className="text-[var(--mist)]">Contacto</dt>
            <dd>
              <a
                href={`mailto:${ABOUT.contacto.email}`}
                className="underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--gain)] hover:decoration-[var(--gain)]"
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
