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
      <label className="text-xs font-semibold uppercase tracking-wide text-[var(--mute)]">
        Descargar datos {departamento !== "Todos" ? `(${departamento})` : "(todos)"}
      </label>
      <div className="flex gap-2">
        <a
          href={downloadUrl("csv", depto)}
          className="flex-1 rounded-md bg-[var(--gain)] px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:brightness-110"
        >
          CSV
        </a>
        <a
          href={downloadUrl("json", depto)}
          className="flex-1 rounded-md border border-[var(--gain)] px-3 py-2 text-center text-sm font-medium text-[var(--gain)] transition-colors hover:bg-[color-mix(in_srgb,var(--gain)_8%,transparent)]"
        >
          JSON
        </a>
      </div>
    </div>
  );
}
