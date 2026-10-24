export function shotLabel(canvas, label) {
  const out = document.createElement('canvas');
  out.width = Math.max(2, canvas.width);
  out.height = Math.max(2, canvas.height);
  const g = out.getContext('2d');
  g.drawImage(canvas, 0, 0);
  g.font = '700 18px Orbitron, system-ui, sans-serif';
  const pad = 10;
  const w = Math.min(out.width - 16, g.measureText(label).width + pad * 2);
  g.fillStyle = '#07010f';
  g.fillRect(8, out.height - 36, Math.max(28, w), 26);
  g.fillStyle = '#fff6fb';
  g.fillText(label, 8 + pad, out.height - 16);
  let bright = 0;
  const strip = g.getImageData(8, Math.max(0, out.height - 36), Math.max(1, Math.min(120, out.width - 8)), 26).data;
  for (let i = 0; i < strip.length; i += 4) if (strip[i] > 200) bright += 1;
  return { url: out.toDataURL('image/png'), bright };
}
