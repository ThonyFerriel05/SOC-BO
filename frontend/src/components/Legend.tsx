import { BIOMASS_GRADIENT_CSS, BIOMASS_TICKS } from "@/lib/color";

export default function Legend() {
  return (
    <div className="absolute bottom-2 right-2 z-[1000] border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_94%,transparent)] px-2.5 py-2 text-xs text-[var(--ink)] backdrop-blur-sm sm:px-3">
      <p className="mb-1.5 font-sans text-[11px] font-medium tracking-wide">
        Diferencia de biomasa
      </p>
      <div
        className="h-2 w-40 border border-[var(--line)] sm:w-56"
        style={{ background: BIOMASS_GRADIENT_CSS }}
      />
      <div className="mt-1 flex w-40 justify-between font-mono text-[10px] text-[var(--mute)] sm:w-56">
        {BIOMASS_TICKS.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div className="flex w-40 justify-between text-[10px] text-[var(--mute)] sm:w-56">
        <span>Pérdida</span>
        <span>Neutral</span>
        <span>Acumulación</span>
      </div>
    </div>
  );
}
