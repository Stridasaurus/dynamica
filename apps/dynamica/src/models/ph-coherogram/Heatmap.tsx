import { useEffect, useRef } from 'react';
import { Card } from '@settgast/ui';
import type { CoherogramResult } from './computeCoherogram';

// Inferno colormap LUT (matplotlib's official 256-entry data, public domain) —
// pure viz utility local to this model's heatmap, not a "tool" in the
// manifesto's math taxonomy. Ported from Sites/magnetometer-coherogram/dsp.js.
const IR = new Uint8Array([0,1,1,1,2,2,2,3,4,4,5,6,7,8,9,10,11,12,13,14,16,17,18,20,21,22,24,25,27,28,30,31,33,35,36,38,40,41,43,45,47,49,50,52,54,56,57,59,61,62,64,66,68,69,71,73,74,76,77,79,81,82,84,85,87,89,90,92,93,95,97,98,100,101,103,105,106,108,109,111,113,114,116,117,119,120,122,124,125,127,128,130,132,133,135,136,138,140,141,143,144,146,147,149,151,152,154,155,157,159,160,162,163,165,166,168,169,171,173,174,176,177,179,180,182,183,185,186,188,189,191,192,193,195,196,198,199,200,202,203,204,206,207,208,210,211,212,213,215,216,217,218,219,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,235,236,237,238,239,239,240,241,241,242,243,243,244,245,245,246,246,247,247,248,248,248,249,249,249,250,250,250,251,251,251,251,251,252,252,252,252,252,252,252,252,252,252,252,252,251,251,251,251,251,250,250,250,250,249,249,249,248,248,247,247,246,246,245,245,244,244,244,243,243,242,242,242,241,241,241,241,242,242,243,243,244,245,246,248,249,250,252]);
const IG = new Uint8Array([0,0,1,1,1,2,2,2,3,3,4,4,5,5,6,7,7,8,8,9,9,10,10,11,11,11,12,12,12,12,12,12,12,12,12,12,11,11,11,11,10,10,10,10,9,9,9,9,9,9,10,10,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,18,18,19,19,20,21,21,22,22,23,24,24,25,25,26,26,27,28,28,29,29,30,30,31,32,32,33,33,34,34,35,35,36,37,37,38,38,39,39,40,41,41,42,42,43,44,44,45,46,46,47,48,48,49,50,50,51,52,53,53,54,55,56,57,58,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,74,75,76,77,78,80,81,82,83,85,86,87,89,90,92,93,94,96,97,99,100,102,103,105,106,108,110,111,113,115,116,118,120,121,123,125,126,128,130,132,133,135,137,139,140,142,144,146,148,150,151,153,155,157,159,161,163,165,166,168,170,172,174,176,178,180,182,184,186,188,190,192,194,196,198,199,201,203,205,207,209,211,213,215,217,219,221,223,225,227,229,230,232,234,236,237,239,241,242,244,245,246,248,249,250,251,252,253,255]);
const IB = new Uint8Array([4,5,6,8,10,12,14,16,18,20,23,25,27,29,31,34,36,38,41,43,45,48,50,52,55,57,60,62,65,67,69,72,74,76,79,81,83,85,87,89,91,92,94,95,97,98,99,100,101,102,103,104,104,105,106,106,107,107,108,108,108,109,109,109,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,110,109,109,109,109,109,108,108,108,107,107,107,106,106,105,105,105,104,104,103,103,102,102,101,100,100,99,99,98,97,96,96,95,94,94,93,92,91,90,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,63,62,61,60,59,58,56,55,54,53,52,51,49,48,47,46,45,43,42,41,40,38,37,36,35,33,32,31,29,28,27,25,24,23,21,20,19,18,16,15,14,12,11,10,9,8,7,7,6,6,6,6,7,7,8,9,10,12,13,15,17,18,20,22,24,26,29,31,33,35,38,40,42,45,47,50,53,55,58,61,64,67,70,73,76,79,83,86,90,93,97,101,105,109,113,117,121,125,130,134,138,142,146,150,154,157,161,164]);

function infernoRGB(t: number): [number, number, number] {
  const c = Math.max(0, Math.min(1, t));
  const s = c * 255;
  const i = s | 0;
  const j = Math.min(255, i + 1);
  const f = s - i;
  return [
    Math.round(IR[i] + (IR[j] - IR[i]) * f),
    Math.round(IG[i] + (IG[j] - IG[i]) * f),
    Math.round(IB[i] + (IB[j] - IB[i]) * f),
  ];
}

interface Props {
  result: CoherogramResult;
}

/** The coherogram itself: time (x) x frequency (y), colored by mean network
 *  gamma^2 (Inferno colormap). Hand-drawn on a <canvas> — no charting library
 *  needed for a filled grid, keeping bundle weight down (S9), matching the
 *  original magnetometer-coherogram app's approach. */
export function Heatmap({ result }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data, freqsHz, windowCenterMin } = result;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const nT = data.length;
    const nF = freqsHz.length;
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth || 600;
    const cssH = canvas.clientHeight || 260;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Render into an offscreen low-res ImageData (one pixel per cell) then
    // scale up — sharper for a coarse grid than filling one <rect> per cell
    // via the 2D API, and matches the original app's pixel-buffer approach.
    const cellCanvas = document.createElement('canvas');
    cellCanvas.width = nT;
    cellCanvas.height = nF;
    const cellCtx = cellCanvas.getContext('2d')!;
    const img = cellCtx.createImageData(nT, nF);
    for (let t = 0; t < nT; t++) {
      for (let f = 0; f < nF; f++) {
        // Frequency increases upward, so flip the row index.
        const row = nF - 1 - f;
        const v = data[t][f];
        const [r, g, b] = infernoRGB(v);
        const idx = (row * nT + t) * 4;
        img.data[idx] = r;
        img.data[idx + 1] = g;
        img.data[idx + 2] = b;
        img.data[idx + 3] = 255;
      }
    }
    cellCtx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.drawImage(cellCanvas, 0, 0, cssW, cssH);
  }, [data, freqsHz]);

  const tMin = windowCenterMin[0] ?? 0;
  const tMax = windowCenterMin[windowCenterMin.length - 1] ?? 0;
  const fMin = freqsHz[0] ?? 0;
  const fMax = freqsHz[freqsHz.length - 1] ?? 0;

  return (
    <Card className="p-4">
      <div className="relative h-[260px] w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[#0a0a0e]">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
        <span>{tMin.toFixed(0)} min</span>
        <span>&larr; time &nbsp;|&nbsp; frequency (mHz) &uarr;</span>
        <span>{tMax.toFixed(0)} min</span>
      </div>
      <div className="mt-0.5 text-center text-[11px] text-[var(--color-text-muted)]">
        {(fMin * 1000).toFixed(2)}&ndash;{(fMax * 1000).toFixed(2)} mHz resolved
      </div>
      <ColorbarLegend />
    </Card>
  );
}

function ColorbarLegend() {
  const stops = Array.from({ length: 20 }, (_, i) => infernoRGB(i / 19));
  const gradient = `linear-gradient(to right, ${stops.map(([r, g, b]) => `rgb(${r},${g},${b})`).join(',')})`;
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="text-[11px] text-[var(--color-text-muted)]">&gamma;&sup2; 0</span>
      <div className="h-3 flex-1 rounded" style={{ background: gradient }} />
      <span className="text-[11px] text-[var(--color-text-muted)]">1</span>
    </div>
  );
}
