import { ABOUT } from "@/content/about";

export default function AboutSection() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[#c08457]">
        Sobre el proyecto
      </h2>
      <p className="text-sm leading-relaxed text-neutral-300">
        {ABOUT.descripcion}
      </p>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {ABOUT.autores.map((autor) => (
            <tr key={autor.nombre} className="border-b border-neutral-800/70">
              <th className="w-1/2 py-2.5 pr-4 text-left font-normal align-top text-neutral-500">
                {autor.nombre}
              </th>
              <td className="py-2.5 text-left text-neutral-200">{autor.rol}</td>
            </tr>
          ))}
          <tr className="border-b border-neutral-800/70">
            <th className="w-1/2 py-2.5 pr-4 text-left font-normal align-top text-neutral-500">
              Contacto
            </th>
            <td className="py-2.5 text-left">
              <a
                href={`mailto:${ABOUT.contacto.email}`}
                className="text-neutral-200 underline decoration-neutral-600 underline-offset-4 transition-colors hover:text-[#c08457] hover:decoration-[#c08457]"
              >
                {ABOUT.contacto.email}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
