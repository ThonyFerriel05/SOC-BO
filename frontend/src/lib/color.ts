type Stop = { pos: number; rgb: [number, number, number] };

const STOPS: Stop[] = [
  { pos: -1, rgb: [37, 99, 235] },
  { pos: 0, rgb: [34, 197, 94] },
  { pos: 0.5, rgb: [234, 179, 8] },
  { pos: 1, rgb: [220, 38, 38] },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function biomassColor(value: number): string {
  const v = Math.max(-1, Math.min(1, value));

  let lower = STOPS[0];
  let upper = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (v >= STOPS[i].pos && v <= STOPS[i + 1].pos) {
      lower = STOPS[i];
      upper = STOPS[i + 1];
      break;
    }
  }

  const range = upper.pos - lower.pos || 1;
  const t = (v - lower.pos) / range;

  const r = Math.round(lerp(lower.rgb[0], upper.rgb[0], t));
  const g = Math.round(lerp(lower.rgb[1], upper.rgb[1], t));
  const b = Math.round(lerp(lower.rgb[2], upper.rgb[2], t));

  return `rgb(${r}, ${g}, ${b})`;
}

export const BIOMASS_GRADIENT_CSS =
  "linear-gradient(to right, rgb(37,99,235), rgb(34,197,94), rgb(234,179,8), rgb(220,38,38))";
