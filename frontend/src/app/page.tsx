import Link from "next/link";
import AboutSection from "@/components/AboutSection";
import LandingMapSection from "@/components/LandingMapSection";
import { downloadUrl } from "@/lib/api";

const METADATA: { label: string; value: string }[] = [
  { label: "Cobertura geográfica", value: "Santa Cruz, Beni y Pando (oriente boliviano)" },
  { label: "Número de puntos", value: "57 576" },
  { label: "Departamentos", value: "3" },
  { label: "Resolución de grilla", value: "~1 km" },
  { label: "Variable principal", value: "diferencia_biomasa (adimensional)" },
  { label: "Sistema de coordenadas", value: "WGS84 (EPSG:4326)" },
  { label: "Formatos de acceso", value: "CSV, JSON (API REST)" },
];

const LIMITACIONES: string[] = [
  "No es un modelo de predicción de incendios: no estima probabilidad ni fecha de ignición.",
  "Cuantifica la distancia de cada punto a su umbral crítico de acumulación de biomasa, no la causa ni el disparador del colapso.",
  "No incorpora variables meteorológicas, actividad humana, fuentes de ignición ni cobertura de uso de suelo.",
  "Representa un estado (snapshot) derivado de sensoramiento remoto; no es una serie temporal continua.",
  "La resolución (~1 km) acota el análisis a escala regional, no de parcela.",
  "diferencia_biomasa es un indicador relativo; su interpretación depende del contexto local.",
];

const CITA =
  "SOC-BO (2026). Dataset de criticalidad autoorganizada en biomasa — oriente boliviano (Santa Cruz, Beni y Pando). https://soc-bo.vercel.app";

const NAV_LINKS = [
  { href: "#explorador", label: "Explorador" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#dataset", label: "Dataset" },
  { href: "#acceso", label: "Acceso a datos" },
  { href: "#sobre", label: "Sobre el proyecto" },
] as const;

const SECTION_INNER =
  "mx-auto w-full max-w-xl px-5 sm:max-w-2xl sm:px-6 md:max-w-4xl lg:max-w-5xl lg:px-8";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200">
      <header className="sticky top-0 z-[1200] border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div
          className={`${SECTION_INNER} flex h-14 items-center justify-between gap-4`}
        >
          <a
            href="#inicio"
            className="shrink-0 text-sm font-semibold tracking-tight text-neutral-100"
          >
            SOC-BO
          </a>
          <nav
            aria-label="Secciones"
            className="flex min-w-0 items-center gap-1 overflow-x-auto text-xs sm:gap-3 sm:text-sm"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="shrink-0 px-1.5 py-1 text-neutral-400 transition-colors hover:text-neutral-100 sm:px-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section
        id="inicio"
        className="scroll-mt-16 border-b border-neutral-800 py-14 sm:py-20"
      >
        <div className={`${SECTION_INNER} flex flex-col gap-6`}>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-100 md:text-4xl">
              SOC-BO
            </h1>
            <p className="text-sm uppercase tracking-widest text-[#c08457]">
              Criticalidad autoorganizada en biomasa
            </p>
            <p className="max-w-prose text-base leading-relaxed text-neutral-400 md:max-w-3xl">
              Dataset de criticalidad autoorganizada calculado mediante el
              modelo sandpile de Bak-Tang-Wiesenfeld, aplicado a la acumulación
              de biomasa en Santa Cruz, Beni y Pando.
            </p>
          </div>
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-[#c08457] px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-[#cd9269]"
            >
              Abrir dashboard
            </Link>
          </div>
        </div>
      </section>

      <LandingMapSection />

      <section
        id="metodologia"
        className="scroll-mt-16 border-b border-neutral-800 py-12 sm:py-16"
      >
        <div className={`${SECTION_INNER} flex flex-col gap-3`}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#c08457]">
            Metodología — el modelo SOC
          </h2>
          <p className="leading-relaxed text-neutral-300">
            La vegetación acumula biomasa de forma continua. Bajo el modelo
            sandpile de Bak-Tang-Wiesenfeld, cada punto del territorio tiene un
            umbral crítico a partir del cual la acumulación deja de ser estable:
            una perturbación mínima puede desencadenar una redistribución local
            (colapso). El dataset cuantifica, para cada punto de la grilla, la
            diferencia de biomasa respecto de ese estado crítico —la distancia
            al umbral, no el momento del colapso.
          </p>
        </div>
      </section>

      <section
        id="dataset"
        className="scroll-mt-16 border-b border-neutral-800 bg-neutral-900/30 py-12 sm:py-16"
      >
        <div className={`${SECTION_INNER} flex flex-col gap-10`}>
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#c08457]">
              Metadata del dataset
            </h2>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {METADATA.map((row) => (
                  <tr key={row.label} className="border-b border-neutral-800/70">
                    <th className="w-1/2 py-2.5 pr-4 text-left font-normal align-top text-neutral-500">
                      {row.label}
                    </th>
                    <td className="py-2.5 text-left text-neutral-200">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div id="limitaciones" className="flex scroll-mt-16 flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#c08457]">
              Limitaciones
            </h2>
            <ul className="flex flex-col gap-2 text-sm leading-relaxed text-neutral-300">
              {LIMITACIONES.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="select-none text-neutral-600">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="citar" className="flex scroll-mt-16 flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#c08457]">
              Cómo citar este dataset
            </h2>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-neutral-300">
              {CITA}
            </pre>
            <p className="text-sm leading-relaxed text-neutral-400">
              Los datos se distribuyen bajo licencia Creative Commons Atribución
              4.0 Internacional (CC BY 4.0). Se permite el uso, redistribución y
              adaptación citando la fuente.
            </p>
          </div>
        </div>
      </section>

      <section
        id="acceso"
        className="scroll-mt-16 border-b border-neutral-800 py-12 sm:py-16"
      >
        <div className={`${SECTION_INNER} flex flex-col gap-3`}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#c08457]">
            Acceso a los datos
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link
                href="/api"
                className="text-neutral-200 underline decoration-neutral-600 underline-offset-4 transition-colors hover:text-[#c08457] hover:decoration-[#c08457]"
              >
                Documentación de la API
              </Link>
              <span className="text-neutral-500">
                {" "}
                — endpoints REST, ejemplos de request y response.
              </span>
            </li>
            <li>
              <a
                href={downloadUrl("csv")}
                className="text-neutral-200 underline decoration-neutral-600 underline-offset-4 transition-colors hover:text-[#c08457] hover:decoration-[#c08457]"
              >
                Descarga del dataset (CSV)
              </a>
              <span className="text-neutral-500">
                {" "}
                — conjunto completo de puntos.
              </span>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-neutral-200 underline decoration-neutral-600 underline-offset-4 transition-colors hover:text-[#c08457] hover:decoration-[#c08457]"
              >
                Explorador a pantalla completa
              </Link>
              <span className="text-neutral-500">
                {" "}
                — mapa con filtros y estadísticas.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <AboutSection />
    </main>
  );
}
