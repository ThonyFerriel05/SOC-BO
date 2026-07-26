import { BIOMASS_GRADIENT_CSS } from "@/lib/color";

export default function Legend() {
  return (
    <div className="absolute bottom-2 right-2 z-[1000] rounded bg-white/90 px-3 py-2 text-xs text-gray-700 shadow">
      <p className="mb-1 font-semibold">Diferencia de biomasa</p>
      <div className="flex items-center gap-2">
        <span>-1 (descargado)</span>
        <div className="h-2 w-28 rounded-full" style={{ background: BIOMASS_GRADIENT_CSS }} />
        <span>+1 (acumulación)</span>
      </div>
    </div>
  );
}
