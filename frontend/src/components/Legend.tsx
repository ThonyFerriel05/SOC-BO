import { BIOMASS_GRADIENT_CSS, BIOMASS_TICKS } from "@/lib/color";

export default function Legend() {
  return (
    <div className="absolute bottom-2 right-2 z-[1000] rounded border border-neutral-800 bg-neutral-900/90 px-3 py-2 text-xs text-neutral-200 shadow-lg">
      <p className="mb-1.5 font-semibold">Diferencia de biomasa</p>
      <div
        className="h-2 w-64 rounded-full border border-neutral-700"
        style={{ background: BIOMASS_GRADIENT_CSS }}
      />
      <div className="mt-1 flex w-64 justify-between font-mono text-[10px] text-neutral-400">
        {BIOMASS_TICKS.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div className="flex w-64 justify-between text-[10px] text-neutral-400">
        <span>Pérdida</span>
        <span>Neutral</span>
        <span>Acumulación</span>
      </div>
    </div>
  );
}
