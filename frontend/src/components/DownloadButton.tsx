import { downloadUrl } from "@/lib/api";
import { DepartamentoFiltro } from "@/lib/types";

export default function DownloadButton({
  departamento,
}: {
  departamento: DepartamentoFiltro;
}) {
  const depto = departamento === "Todos" ? undefined : departamento;
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Descargar datos {departamento !== "Todos" ? `(${departamento})` : "(todos)"}
      </label>
      <div className="flex gap-2">
        <a
          href={downloadUrl("csv", depto)}
          className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          CSV
        </a>
        <a
          href={downloadUrl("json", depto)}
          className="flex-1 rounded-md border border-emerald-500 px-3 py-2 text-center text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/10"
        >
          JSON
        </a>
      </div>
    </div>
  );
}
