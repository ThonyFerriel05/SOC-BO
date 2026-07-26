"use client";

import { DEPARTAMENTOS, DepartamentoFiltro } from "@/lib/types";

export default function DepartmentFilter({
  value,
  onChange,
}: {
  value: DepartamentoFiltro;
  onChange: (value: DepartamentoFiltro) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Departamento
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DepartamentoFiltro)}
        className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-emerald-500 focus:outline-none"
      >
        {DEPARTAMENTOS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}
