import { DepartamentoFiltro, StatsResponse } from "@/lib/types";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function StatsPanel({
  stats,
  departamento,
}: {
  stats: StatsResponse | null;
  departamento: DepartamentoFiltro;
}) {
  if (!stats) {
    return <div className="text-sm text-gray-500">Cargando estadísticas...</div>;
  }

  const deptoStats =
    departamento === "Todos"
      ? null
      : stats.por_departamento.find((d) => d.departamento === departamento);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Estadísticas {departamento !== "Todos" ? `— ${departamento}` : "generales"}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Total puntos"
          value={(deptoStats?.count ?? stats.total_puntos).toLocaleString()}
        />
        <StatCard
          label="Promedio Δ biomasa"
          value={(deptoStats?.promedio ?? stats.promedio_global).toFixed(4)}
        />
        <StatCard label="Máximo" value={stats.max_diferencia_biomasa.toFixed(4)} />
        <StatCard label="Mínimo" value={stats.min_diferencia_biomasa.toFixed(4)} />
      </div>
      <div>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Por departamento
        </h3>
        <ul className="flex flex-col gap-1 text-sm">
          {stats.por_departamento.map((d) => (
            <li
              key={d.departamento}
              className="flex justify-between rounded bg-gray-50 px-2 py-1 text-gray-800"
            >
              <span>{d.departamento}</span>
              <span className="font-mono">
                {d.promedio.toFixed(4)} ({d.count.toLocaleString()})
              </span>
            </li>
          ))}
        </ul>
      </div>
      {stats.top_riesgo.length > 0 && (
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Top riesgo (mayor acumulación)
          </h3>
          <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto text-sm">
            {stats.top_riesgo.slice(0, 10).map((p) => (
              <li
                key={p.id}
                className="flex justify-between rounded bg-gray-50 px-2 py-1 text-gray-800"
              >
                <span>
                  {p.municipio} ({p.departamento})
                </span>
                <span className="font-mono text-red-600">
                  {p.diferencia_biomasa.toFixed(4)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
