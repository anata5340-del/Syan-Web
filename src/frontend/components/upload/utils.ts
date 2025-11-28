export function rgbaToHex(r: number, g: number, b: number, a: number) {
  // Ensure r, g, b are within the range 0-255 and a is within 0-1
  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));
  a = Math.max(0, Math.min(1, a));

  // Convert r, g, b to two-digit hex values
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  // Convert a to a two-digit hex value
  const aHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");

  // Combine all hex values
  return `#${rHex}${gHex}${bHex}${aHex}`;
}
