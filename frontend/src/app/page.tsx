import Link from "next/link";
import { downloadUrl } from "@/lib/api";

const STATS = [
  { value: "57,576", label: "puntos medidos" },
  { value: "3", label: "departamentos cubiertos" },
  { value: "~1 km", label: "resolución de grilla" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-14 sm:gap-12 sm:px-6 sm:py-24">
        <header className="flex flex-col gap-5 sm:gap-6">
          <h1 className="text-5xl font-bold tracking-tight text-orange-500 sm:text-6xl">
            SOC-BO
          </h1>
          <p className="text-xl font-medium text-neutral-100 sm:text-2xl">
            No predecimos incendios. Medimos criticalidad.
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            El primer instrumento de medición de criticalidad autoorganizada en
            Bolivia — un dataset público de puntos críticos en Santa Cruz, Beni
            y Pando.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-6"
            >
              <p className="text-3xl font-semibold text-emerald-400">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-neutral-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-l-2 border-orange-500/60 pl-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-500">
            El modelo SOC
          </h2>
          <p className="leading-relaxed text-neutral-300">
            La vegetación acumula biomasa de forma continua. Esa acumulación no
            crece indefinidamente: cada punto del territorio tiene un umbral
            crítico a partir del cual el sistema deja de absorber y empieza a
            liberar. Cuando se cruza ese umbral, basta una perturbación mínima
            para desencadenar un colapso local. SOC-BO mide dónde está cada
            punto respecto a su umbral, no cuándo ocurrirá el colapso.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-neutral-950 transition-colors hover:bg-orange-400"
          >
            Explorar dashboard
          </Link>
          <Link
            href="/api"
            className="rounded-lg border border-emerald-500 px-6 py-3 text-center text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/10"
          >
            Ver documentación de API
          </Link>
          <a
            href={downloadUrl("csv")}
            className="rounded-lg border border-neutral-700 px-6 py-3 text-center text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100"
          >
            Descargar dataset (CSV)
          </a>
        </div>
      </section>
    </main>
  );
}
