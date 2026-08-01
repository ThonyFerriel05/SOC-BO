import { ABOUT } from "@/content/about";

export default function AboutSection() {
  return (
    <section
      id="sobre"
      className="scroll-mt-16 border-t border-neutral-800 bg-neutral-950 py-10 sm:py-12"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3 px-5 sm:max-w-2xl sm:px-6 md:max-w-4xl lg:max-w-5xl lg:px-8">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
          Sobre el proyecto
        </h2>
        <p className="text-xs leading-relaxed text-neutral-500">
          {ABOUT.descripcion}
        </p>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {ABOUT.autores.map((autor) => (
              <tr key={autor.nombre} className="border-b border-neutral-800/50">
                <th className="w-1/2 py-2 pr-4 text-left font-normal align-top text-neutral-600">
                  {autor.nombre}
                </th>
                <td className="py-2 text-left text-neutral-500">{autor.rol}</td>
              </tr>
            ))}
            <tr className="border-b border-neutral-800/50">
              <th className="w-1/2 py-2 pr-4 text-left font-normal align-top text-neutral-600">
                Contacto
              </th>
              <td className="py-2 text-left">
                <a
                  href={`mailto:${ABOUT.contacto.email}`}
                  className="text-neutral-500 underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-[#c08457] hover:decoration-[#c08457]"
                >
                  {ABOUT.contacto.email}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
