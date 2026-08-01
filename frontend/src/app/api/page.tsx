import Link from "next/link";
import { API_URL } from "@/lib/api";

type Endpoint = {
  method: string;
  path: string;
  description: string;
  request: string;
  response: string;
};

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/samples",
    description: "Lista paginada de puntos, con filtros y ordenamiento.",
    request: `GET ${API_URL}/samples?page=1&page_size=2&departamento=Beni`,
    response: `{
  "total": 18432,
  "page": 1,
  "page_size": 2,
  "total_pages": 9216,
  "items": [
    {
      "id": "BEN-00001",
      "departamento": "Beni",
      "municipio": "Trinidad",
      "lat": -14.83,
      "lon": -64.9,
      "diferencia_biomasa": -0.18
    },
    {
      "id": "BEN-00002",
      "departamento": "Beni",
      "municipio": "Riberalta",
      "lat": -10.98,
      "lon": -66.06,
      "diferencia_biomasa": 0.55
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/samples/{id}",
    description: "Un punto individual por su identificador.",
    request: `GET ${API_URL}/samples/BEN-00001`,
    response: `{
  "id": "BEN-00001",
  "departamento": "Beni",
  "municipio": "Trinidad",
  "lat": -14.83,
  "lon": -64.9,
  "diferencia_biomasa": -0.18
}`,
  },
  {
    method: "GET",
    path: "/stats",
    description:
      "Agregados globales, por departamento, por municipio y top de riesgo.",
    request: `GET ${API_URL}/stats`,
    response: `{
  "total_puntos": 57576,
  "promedio_global": 0.17,
  "max_diferencia_biomasa": 0.61,
  "min_diferencia_biomasa": -0.31,
  "por_departamento": [
    { "departamento": "Beni", "promedio": 0.217, "count": 18432 }
  ],
  "por_municipio": [
    {
      "municipio": "Trinidad",
      "departamento": "Beni",
      "promedio": 0.31,
      "count": 1204
    }
  ],
  "top_riesgo": [
    {
      "id": "SCZ-04412",
      "departamento": "Santa Cruz",
      "municipio": "San Julian",
      "lat": -16.9,
      "lon": -62.7,
      "diferencia_biomasa": 0.61
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/download",
    description:
      "Descarga completa del dataset en CSV o JSON, opcionalmente filtrada por departamento.",
    request: `GET ${API_URL}/download?format=json&departamento=Pando`,
    response: `[
  {
    "id": "PAN-00001",
    "departamento": "Pando",
    "municipio": "Cobija",
    "lat": -11.02,
    "lon": -68.77,
    "diferencia_biomasa": 0.09
  }
]`,
  },
];

export default function ApiDocs() {
  return (
    <main className="min-h-screen bg-[var(--void)] text-[var(--mist)]">
      <div className="anomaly-bar" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-12 sm:max-w-2xl sm:gap-10 sm:px-6 sm:py-16 md:max-w-4xl md:py-20 lg:max-w-5xl lg:px-8">
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="w-fit text-sm font-medium text-[var(--ash)] transition-colors hover:text-[var(--neutral)]"
          >
            ← Inicio
          </Link>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--neutral)]">
            API SOC-BO
          </h1>
          <p className="text-[var(--ash)]">
            Interfaz REST de solo lectura para el acceso programático al dataset,
            orientada a investigadores, aplicaciones de terceros y agentes de IA.
          </p>
          <div className="border border-[var(--line)] bg-[var(--panel)] px-4 py-3">
            <p className="section-eyebrow w-fit">URL base</p>
            <code className="mt-2 block break-all font-mono text-sm text-[var(--neutral)]">
              {API_URL}
            </code>
          </div>
        </header>

        {ENDPOINTS.map((endpoint) => (
          <section
            key={endpoint.path}
            className="flex flex-col gap-4 border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-[var(--line)] bg-[var(--void)] px-2 py-1 font-mono text-xs font-semibold text-[var(--gain)]">
                {endpoint.method}
              </span>
              <code className="break-all font-mono text-base text-[var(--neutral)] sm:text-lg">
                {endpoint.path}
              </code>
            </div>
            <p className="text-sm text-[var(--ash)]">{endpoint.description}</p>

            <div>
              <p className="section-eyebrow mb-2 w-fit">Request</p>
              <pre className="overflow-x-auto border border-[var(--line)] bg-[var(--void)] p-4 font-mono text-xs text-[var(--mist)]">
                {endpoint.request}
              </pre>
            </div>

            <div>
              <p className="section-eyebrow mb-2 w-fit">Response</p>
              <pre className="overflow-x-auto border border-[var(--line)] bg-[var(--void)] p-4 font-mono text-xs text-[var(--mist)]">
                {endpoint.response}
              </pre>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
