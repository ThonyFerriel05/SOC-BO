import Link from "next/link";
import AboutSection from "@/components/AboutSection";
import LandingMapSection from "@/components/LandingMapSection";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
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

const INNER =
  "mx-auto w-full max-w-xl px-5 sm:max-w-2xl sm:px-6 md:max-w-4xl lg:max-w-5xl lg:px-8";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--void)] text-[var(--mist)]">
      <SiteHeader />
      <LandingMapSection />

      <section
        id="metodologia"
        className="scroll-mt-16 border-b border-[var(--line)] py-14 sm:py-20"
      >
        <div className={INNER}>
          <Reveal className="flex max-w-3xl flex-col gap-4">
            <h2 className="section-eyebrow">Metodología — el modelo SOC</h2>
            <p className="font-serif text-xl leading-relaxed text-[var(--mist)] md:text-2xl">
              La vegetación acumula biomasa de forma continua. Bajo el modelo
              sandpile de Bak-Tang-Wiesenfeld, cada punto del territorio tiene
              un umbral crítico a partir del cual la acumulación deja de ser
              estable: una perturbación mínima puede desencadenar una
              redistribución local (colapso). El dataset cuantifica, para cada
              punto de la grilla, la diferencia de biomasa respecto de ese
              estado crítico —la distancia al umbral, no el momento del
              colapso.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id="dataset"
        className="scroll-mt-16 border-b border-[var(--line)] bg-[var(--panel)] py-14 sm:py-20"
      >
        <div className={INNER}>
          <Reveal className="flex flex-col gap-4">
            <h2 className="section-eyebrow">Metadata del dataset</h2>
            <div className="overflow-hidden border border-[var(--line)] bg-[var(--void)]">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {METADATA.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-[var(--line)] last:border-b-0"
                    >
                      <th className="w-[42%] px-4 py-3 text-left align-top font-sans text-xs font-medium uppercase tracking-wide text-[var(--ash)] sm:w-1/2">
                        {row.label}
                      </th>
                      <td className="px-4 py-3 text-left font-mono text-[13px] tabular-nums text-[var(--neutral)]">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="limitaciones"
        className="scroll-mt-16 border-b border-[var(--line)] py-14 sm:py-20"
      >
        <div className={INNER}>
          <Reveal>
            <div className="border border-[var(--line)] border-l-[3px] border-l-[var(--loss)] bg-[var(--panel)] p-5 sm:p-7">
              <h2 className="section-eyebrow">Limitaciones</h2>
              <ul className="mt-5 flex flex-col gap-3 text-sm leading-relaxed text-[var(--mist)]">
                {LIMITACIONES.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--loss)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="citar"
        className="scroll-mt-16 border-b border-[var(--line)] bg-[var(--panel)] py-14 sm:py-20"
      >
        <div className={`${INNER} flex flex-col gap-4`}>
          <Reveal className="flex flex-col gap-4">
            <h2 className="section-eyebrow">Cómo citar este dataset</h2>
            <pre className="overflow-x-auto whitespace-pre-wrap border border-[var(--line)] bg-[var(--void)] p-4 font-mono text-xs leading-relaxed text-[var(--mist)]">
              {CITA}
            </pre>
            <p className="text-sm leading-relaxed text-[var(--ash)]">
              Los datos se distribuyen bajo licencia Creative Commons Atribución
              4.0 Internacional (CC BY 4.0). Se permite el uso, redistribución y
              adaptación citando la fuente.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id="acceso"
        className="scroll-mt-16 border-b border-[var(--line)] py-14 sm:py-20"
      >
        <div className={INNER}>
          <Reveal className="flex flex-col gap-5">
            <h2 className="section-eyebrow">Acceso a los datos</h2>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="border-b border-[var(--line)] pb-4">
                <Link
                  href="/api"
                  className="font-serif text-lg text-[var(--neutral)] underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--gain)] hover:decoration-[var(--gain)]"
                >
                  Documentación de la API
                </Link>
                <p className="mt-1 text-[var(--ash)]">
                  endpoints REST, ejemplos de request y response.
                </p>
              </li>
              <li className="border-b border-[var(--line)] pb-4">
                <a
                  href={downloadUrl("csv")}
                  className="font-serif text-lg text-[var(--neutral)] underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--gain)] hover:decoration-[var(--gain)]"
                >
                  Descarga del dataset (CSV)
                </a>
                <p className="mt-1 text-[var(--ash)]">
                  conjunto completo de puntos.
                </p>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="font-serif text-lg text-[var(--neutral)] underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--gain)] hover:decoration-[var(--gain)]"
                >
                  Explorador a pantalla completa
                </Link>
                <p className="mt-1 text-[var(--ash)]">
                  mapa con filtros y estadísticas.
                </p>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <AboutSection />
    </main>
  );
}
