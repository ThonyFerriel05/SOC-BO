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
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-20">
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="w-fit text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-100"
          >
            ← Inicio
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">
            API SOC-BO
          </h1>
          <p className="text-neutral-400">
            Interfaz REST de solo lectura para el acceso programático al dataset,
            orientada a investigadores, aplicaciones de terceros y agentes de IA.
          </p>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              URL base
            </p>
            <code className="break-all font-mono text-sm text-neutral-200">
              {API_URL}
            </code>
          </div>
        </header>

        {ENDPOINTS.map((endpoint) => (
          <section
            key={endpoint.path}
            className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-neutral-800 px-2 py-1 font-mono text-xs font-semibold text-neutral-300">
                {endpoint.method}
              </span>
              <code className="break-all font-mono text-base text-neutral-100 sm:text-lg">
                {endpoint.path}
              </code>
            </div>
            <p className="text-sm text-neutral-400">{endpoint.description}</p>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#c08457]">
                Request
              </p>
              <pre className="overflow-x-auto rounded-lg bg-neutral-950 p-4 font-mono text-xs text-neutral-300">
                {endpoint.request}
              </pre>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#c08457]">
                Response
              </p>
              <pre className="overflow-x-auto rounded-lg bg-neutral-950 p-4 font-mono text-xs text-neutral-300">
                {endpoint.response}
              </pre>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
