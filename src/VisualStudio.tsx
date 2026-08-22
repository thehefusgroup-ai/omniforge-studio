import { useEffect, useRef, useState } from 'react';
import {
  Btn, Lbl, Panel, Chip, Range, SelWrap, Spinner,
  IcMove, IcCrop, IcText, IcBrush, IcWand, IcScissors, IcEye, IcPlay, IcPause, IcPlus, IcTrash,
  IcGlobe, IcExt, IcArrowL, IcArrowR, IcRefresh, IcChip, IcDl, IcSend, IcSpark, IcImage, IcFilm, IcMusic, IcCam,
} from './ui';

/* ---------------- procedural plate generator (seeded) ---------------- */
const mulberry = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const hashStr = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

const ART_STYLES = ['Nebula Drift', 'Signal Waves', 'Duotone Ridge', 'Circuit Bloom', 'Glitch Field'];

function drawArt(canvas: HTMLCanvasElement, prompt: string, style: string) {
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const W = (canvas.width = 1280), H = (canvas.height = 720);
  const r = mulberry(hashStr(prompt + '|' + style));
  const pal = ['#ffb224', '#3fd8cf', '#b78cff', '#ff5d5d', '#4ade80'];

  ctx.fillStyle = '#0b0e14'; ctx.fillRect(0, 0, W, H);

  if (style === 'Nebula Drift') {
    for (let i = 0; i < 14; i++) {
      const x = r() * W, y = r() * H, rad = 90 + r() * 260;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      const c = pal[Math.floor(r() * pal.length)];
      g.addColorStop(0, c + '55'); g.addColorStop(1, c + '00');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 240; i++) { ctx.globalAlpha = r() * .8; ctx.fillRect(r() * W, r() * H, r() * 2 + .4, r() * 2 + .4); }
    ctx.globalAlpha = 1;
  } else if (style === 'Signal Waves') {
    for (let l = 0; l < 26; l++) {
      ctx.beginPath();
      const amp = 20 + r() * 90, fr = 0.004 + r() * 0.01, ph = r() * 9, y0 = (l / 26) * H + 20;
      for (let x = 0; x <= W; x += 4) ctx.lineTo(x, y0 + Math.sin(x * fr + ph) * amp * Math.sin(x * 0.001 + ph));
      ctx.strokeStyle = pal[l % 2] + (l % 3 === 0 ? 'cc' : '66');
      ctx.lineWidth = 1 + r() * 2; ctx.stroke();
    }
  } else if (style === 'Duotone Ridge') {
    const cols = ['#121a26', '#1b2740', '#28405e', '#3fd8cf33', '#ffb22422'];
    for (let l = 0; l < 6; l++) {
      ctx.beginPath(); ctx.moveTo(0, H);
      let y = H * 0.3 + l * 70 + r() * 40;
      ctx.lineTo(0, y);
      for (let x = 0; x <= W; x += 40) { y += (r() - 0.5) * 70; ctx.lineTo(x, y); }
      ctx.lineTo(W, H); ctx.closePath();
      ctx.fillStyle = cols[Math.min(l, cols.length - 1)]; ctx.fill();
    }
    const g = ctx.createRadialGradient(W * 0.72, H * 0.2, 10, W * 0.72, H * 0.2, 130);
    g.addColorStop(0, '#ffb224ee'); g.addColorStop(1, '#ffb22400');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  } else if (style === 'Circuit Bloom') {
    ctx.strokeStyle = '#1d2735'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let i = 0; i < 46; i++) {
      const x = Math.floor(r() * 32) * 40, y = Math.floor(r() * 18) * 40;
      ctx.strokeStyle = pal[Math.floor(r() * pal.length)] + 'aa'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y);
      let cx = x, cy = y;
      for (let s = 0; s < 4; s++) { if (r() > .5) cx += 40 * (r() > .5 ? 1 : -1); else cy += 40 * (r() > .5 ? 1 : -1); ctx.lineTo(cx, cy); }
      ctx.stroke();
      ctx.fillStyle = '#3fd8cf'; ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, 7); ctx.fill();
    }
  } else {
    for (let i = 0; i < 90; i++) {
      const w = 20 + r() * 220, h = 4 + r() * 30;
      ctx.fillStyle = pal[Math.floor(r() * pal.length)] + (r() > .5 ? 'b0' : '40');
      ctx.fillRect(r() * W, r() * H, w, h);
    }
    ctx.fillStyle = '#0b0e14cc';
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1.5);
  }

  ctx.fillStyle = '#00000066'; ctx.fillRect(0, H - 64, W, 64);
  ctx.fillStyle = '#e9eef6'; ctx.font = '600 22px "Space Grotesk", sans-serif';
  const label = (prompt.trim() || 'untitled plate').slice(0, 62);
  ctx.fillText(label.toUpperCase(), 28, H - 26);
  ctx.fillStyle = '#3fd8cf'; ctx.font = '500 13px "IBM Plex Mono", monospace';
  ctx.fillText(`OMNIFORGE PLATE · ${style.toUpperCase()} · SEED ${hashStr(prompt) % 99999}`, 28, 34);
}

/* ---------------- timeline types ---------------- */
interface Clip { id: string; name: string; type: 'video' | 'audio' | 'text'; lane: number; start: number; dur: number; color: string }
const PPS = 9;
const CLIP_COLORS = ['#ffb224', '#3fd8cf', '#b78cff', '#4ade80', '#ff8a00'];

const SITES = [
  { name: 'Runway', url: 'https://runwayml.com', desc: 'Gen-4 text-to-video & editing', tag: 'VIDEO', c: 'text-amber' },
  { name: 'Pika', url: 'https://pika.art', desc: 'Video effects & generation', tag: 'VIDEO', c: 'text-amber' },
  { name: 'Luma Dream Machine', url: 'https://lumalabs.ai/dream-machine', desc: 'Cinematic text-to-video', tag: 'VIDEO', c: 'text-amber' },
  { name: 'Hailuo AI', url: 'https://hailuoai.video', desc: 'High-motion video model', tag: 'VIDEO', c: 'text-amber' },
  { name: 'Leonardo.AI', url: 'https://leonardo.ai', desc: 'Production image models', tag: 'IMAGE', c: 'text-cyan' },
  { name: 'Ideogram', url: 'https://ideogram.ai', desc: 'Typography-strong images', tag: 'IMAGE', c: 'text-cyan' },
  { name: 'Krea', url: 'https://www.krea.ai', desc: 'Realtime image generation', tag: 'IMAGE', c: 'text-cyan' },
  { name: 'Kaiber', url: 'https://kaiber.ai', desc: 'Stylized music-video AI', tag: 'VIDEO', c: 'text-amber' },
];

const TOOLS = [
  { id: 'move', icon: IcMove, label: 'Move / Select' },
  { id: 'crop', icon: IcCrop, label: 'Crop' },
  { id: 'text', icon: IcText, label: 'Text overlay' },
  { id: 'brush', icon: IcBrush, label: 'Brush mask' },
  { id: 'wand', icon: IcWand, label: 'AI select (magic)' },
  { id: 'cut', icon: IcScissors, label: 'Razor / split' },
  { id: 'eye', icon: IcEye, label: 'Inspect' },
];

export default function VisualStudio({ addSource, toast }: {
  addSource: (s: { kind: string; name: string; meta: string; duration: number }) => void;
  toast: (msg: string, kind?: 'ok' | 'info' | 'err') => void;
}) {
  const [tab, setTab] = useState<'editor' | 'browser' | 'local'>('editor');

  /* ----- editor state ----- */
  const [tool, setTool] = useState('move');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [plateUrl, setPlateUrl] = useState('');
  const [prompt, setPrompt] = useState('cosmic forge nebula over a night city');
  const [artStyle, setArtStyle] = useState(ART_STYLES[0]);
  const [genBusy, setGenBusy] = useState(false);
  const [adj, setAdj] = useState({ bright: 100, contrast: 100, sat: 100, hue: 0, temp: 0, blur: 0, vignette: 30, grain: 18 });
  const [caption, setCaption] = useState('FORGE YOUR STORY');
  const [clips, setClips] = useState<Clip[]>([
    { id: 'c1', name: 'intro_plate.mp4', type: 'video', lane: 0, start: 0, dur: 8, color: CLIP_COLORS[0] },
    { id: 'c2', name: 'broll_city.mp4', type: 'video', lane: 0, start: 8, dur: 10, color: CLIP_COLORS[4] },
    { id: 'c3', name: 'VO_take01.wav', type: 'audio', lane: 1, start: 0.5, dur: 14, color: CLIP_COLORS[1] },
    { id: 'c4', name: 'bed_ambient.mp3', type: 'audio', lane: 1, start: 14.5, dur: 6, color: CLIP_COLORS[1] },
    { id: 'c5', name: 'TITLE — FORGE', type: 'text', lane: 2, start: 1, dur: 4, color: CLIP_COLORS[2] },
  ]);
  const [selClip, setSelClip] = useState<string | null>('c1');
  const [playing, setPlaying] = useState(false);
  const [head, setHead] = useState(0);

  useEffect(() => {
    const c = canvasRef.current;
    if (c) { drawArt(c, prompt, artStyle); setPlateUrl(c.toDataURL()); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!playing) return;
    const total = Math.max(12, ...clips.map(c => c.start + c.dur));
    const t = window.setInterval(() => setHead(h => (h + 0.05 >= total ? 0 : h + 0.05)), 50);
    return () => window.clearInterval(t);
  }, [playing, clips]);

  const filterStr = `brightness(${adj.bright}%) contrast(${adj.contrast}%) saturate(${adj.sat}%) hue-rotate(${adj.hue}deg) sepia(${adj.temp}%) blur(${adj.blur}px)`;

  const generate = () => {
    setGenBusy(true);
    window.setTimeout(() => {
      const c = canvasRef.current;
      if (c) { drawArt(c, prompt, artStyle); setPlateUrl(c.toDataURL()); }
      setGenBusy(false);
      toast(`Plate generated — "${artStyle}" from prompt seed`, 'ok');
    }, 900);
  };

  const download = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d'); if (!ctx) return;
      ctx.filter = filterStr;
      ctx.drawImage(img, 0, 0);
      if (adj.vignette > 0) {
        const g = ctx.createRadialGradient(c.width / 2, c.height / 2, c.height / 3, c.width / 2, c.height / 2, c.width / 1.15);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${adj.vignette / 100})`);
        ctx.filter = 'none'; ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
      }
      const a = document.createElement('a');
      a.download = `omniforge_plate_${Date.now()}.png`;
      a.href = c.toDataURL('image/png');
      a.click();
      toast('Plate exported as PNG with grade baked in', 'ok');
    };
    img.src = plateUrl;
  };

  const savePlate = () => {
    addSource({ kind: 'visual', name: `Plate — ${artStyle} (${prompt.slice(0, 24)}…)`, meta: '1280×720 · graded · PNG sequence ready', duration: 4 });
    toast('Plate added to Media Library as a still / plate source', 'ok');
  };

  /* ----- timeline helpers ----- */
  const total = Math.max(12, ...clips.map(c => c.start + c.dur));
  const startDrag = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    const clip = clips.find(c => c.id === id); if (!clip) return;
    setSelClip(id);
    const x0 = e.clientX, s0 = clip.start;
    const move = (ev: PointerEvent) => {
      const ns = Math.max(0, Math.round((s0 + (ev.clientX - x0) / PPS) * 2) / 2);
      setClips(cs => cs.map(c => c.id === id ? { ...c, start: ns } : c));
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const selected = clips.find(c => c.id === selClip) ?? null;

  /* ----- browser state ----- */
  const [url, setUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [frameKey, setFrameKey] = useState(0);

  const navigate = (u: string) => {
    let full = u.trim();
    if (!full) return;
    if (!/^https?:\/\//.test(full)) full = 'https://' + full;
    const nh = [...hist.slice(0, histIdx + 1), full];
    setHist(nh); setHistIdx(nh.length - 1); setUrl(full); setUrlInput(full); setFrameKey(k => k + 1);
  };
  const go = (d: -1 | 1) => {
    const i = histIdx + d;
    if (i < 0 || i >= hist.length) return;
    setHistIdx(i); setUrl(hist[i]); setUrlInput(hist[i]); setFrameKey(k => k + 1);
  };

  /* ----- local engines state ----- */
  const [local, setLocal] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ofx.local') ?? 'null'); } catch { return null; }
  }) ?? { comfy: 'http://127.0.0.1:8188', a1111: 'http://127.0.0.1:7860', ollama: 'http://127.0.0.1:11434', watch: 'C:\\Users\\you\\OmniForge\\renders', gpu: 'Auto (CUDA if available)', fallback: true };
  const [engineStatus, setEngineStatus] = useState<Record<string, 'idle' | 'checking' | 'ok' | 'fail'>>({ comfy: 'idle', a1111: 'idle', ollama: 'idle' });

  const ping = async (key: 'comfy' | 'a1111' | 'ollama') => {
    setEngineStatus(s => ({ ...s, [key]: 'checking' }));
    const ctrl = new AbortController();
    const to = window.setTimeout(() => ctrl.abort(), 1800);
    try {
      await fetch(local[key], { signal: ctrl.signal, mode: 'no-cors' });
      setEngineStatus(s => ({ ...s, [key]: 'ok' }));
      toast(`${key === 'comfy' ? 'ComfyUI' : key === 'a1111' ? 'AUTOMATIC1111' : 'Ollama'} endpoint responded — bridge armed`, 'ok');
    } catch {
      setEngineStatus(s => ({ ...s, [key]: 'fail' }));
      toast(`No local engine at ${local[key]} — start it and retry`, 'err');
    } finally { window.clearTimeout(to); }
  };

  const saveLocal = () => { localStorage.setItem('ofx.local', JSON.stringify(local)); toast('Local engine bridge settings saved', 'ok'); };

  const engineRows: { key: 'comfy' | 'a1111' | 'ollama'; name: string; desc: string }[] = [
    { key: 'comfy', name: 'ComfyUI', desc: 'Node-based local image/video pipelines' },
    { key: 'a1111', name: 'AUTOMATIC1111', desc: 'Stable Diffusion web UI bridge' },
    { key: 'ollama', name: 'Ollama', desc: 'Local LLM storyboards & prompts' },
  ];

  return (
    <div className="h-full flex flex-col gap-3 p-3 min-h-0 area-enter">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-disp font-bold text-[19px] leading-tight tracking-tight">Video & Image Studio</h1>
          <div className="text-[11px] text-dim mt-0.5">Adobe-grade editing suite · in-app AI site browser · local engine bridge</div>
        </div>
        <div className="flex items-center gap-2">
          {(['editor', 'browser', 'local'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-[6px] border text-[11px] font-medium font-mono tracking-wide transition-all cursor-pointer ${tab === t ? 'border-amber/60 bg-amber/10 text-amber' : 'border-line text-dim hover:text-mut hover:border-line2'}`}>
              {t === 'editor' ? 'EDITOR + GENERATOR' : t === 'browser' ? 'AI SITE BROWSER' : 'LOCAL ENGINES'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'editor' && (
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="flex-1 grid grid-cols-[52px_230px_1fr_250px] gap-3 min-h-0">
            {/* tool rail */}
            <div className="panel flex flex-col items-center py-2 gap-1 shrink-0">
              {TOOLS.map(t => (
                <button key={t.id} title={t.label} onClick={() => { setTool(t.id); if (t.id !== 'text') toast(`${t.label} tool armed`, 'info'); }}
                  className={`w-9 h-9 rounded-[6px] flex items-center justify-center transition-all cursor-pointer ${tool === t.id ? 'bg-amber/15 text-amber shadow-[inset_0_0_0_1px_rgba(255,178,36,.4)]' : 'text-dim hover:text-ink hover:bg-bg3'}`}>
                  <t.icon s={15} />
                </button>
              ))}
              <div className="mt-auto"><Chip t="cyan" c="px-1!">v2.4</Chip></div>
            </div>

            {/* layers + generator */}
            <div className="flex flex-col gap-3 min-h-0">
              <Panel title="GENERATIVE PLATE · API" c="shrink-0">
                <input className="field" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the plate…" />
                <div className="mt-2">
                  <SelWrap>
                    <select className="field" value={artStyle} onChange={e => setArtStyle(e.target.value)}>
                      {ART_STYLES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </SelWrap>
                </div>
                <Btn v="cyan" s="sm" className="w-full mt-2" onClick={generate} disabled={genBusy}>
                  {genBusy ? <Spinner s={12} /> : <IcSpark s={12} />} {genBusy ? 'Diffusing…' : 'Generate with AI'}
                </Btn>
              </Panel>
              <Panel title="LAYERS" c="flex-1 min-h-0" pad={false}>
                <div className="p-2 space-y-1 overflow-y-auto">
                  {[
                    { n: 'Caption overlay', i: IcText, on: true },
                    { n: 'Plate / background', i: IcImage, on: true },
                    { n: 'Grade group', i: IcWand, on: true },
                    { n: 'Vignette + grain', i: IcEye, on: true },
                  ].map(l => (
                    <div key={l.n} className="flex items-center gap-2 px-2 py-1.5 rounded-[5px] bg-bg2 border border-line text-[11px] text-mut hover:border-line2 transition-colors">
                      <l.i s={12} c="text-cyan" /> {l.n}
                      <span className="ml-auto"><IcEye s={11} c="text-dim" /></span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            {/* preview */}
            <Panel title="PROGRAM MONITOR · 1280×720" c="min-h-0" pad={false}
              right={<div className="flex gap-1.5">
                <Btn v="dark" s="xs" onClick={savePlate}><IcSend s={10} /> To Library</Btn>
                <Btn v="amber" s="xs" onClick={download}><IcDl s={10} /> Export PNG</Btn>
              </div>}>
              <div className="h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center bg-bg0 relative overflow-hidden m-2 rounded-[6px] border border-line min-h-0">
                  <div className="relative w-full max-w-full aspect-video overflow-hidden">
                    {plateUrl && <img src={plateUrl} alt="plate" className="w-full h-full object-cover" style={{ filter: filterStr }} />}
                    {adj.vignette > 0 && <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,${adj.vignette / 110}) 100%)` }} />}
                    {adj.grain > 0 && <div className="absolute inset-0 pointer-events-none grain opacity-[.22]" style={{ opacity: adj.grain / 90 }} />}
                    {tool === 'text' || caption ? (
                      <div className="absolute bottom-[7%] inset-x-0 text-center pointer-events-none">
                        <span className="font-disp font-bold text-[clamp(14px,2.4vw,30px)] tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.8)] px-3">{caption}</span>
                      </div>
                    ) : null}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Chip t="amber"><IcFilm s={9} /> 4K READY</Chip>
                      <Chip t="cyan">REC.709</Chip>
                    </div>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="px-3 pb-2 flex items-center gap-2 shrink-0">
                  <IcText s={11} c="text-dim shrink-0" />
                  <input className="field py-1.5! text-[11px]!" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption overlay text…" />
                  <span className="font-mono text-[9px] text-dim shrink-0">TOOL: {tool.toUpperCase()}</span>
                </div>
              </div>
            </Panel>

            {/* adjustments */}
            <Panel title="COLOR & OPTICS" c="min-h-0 overflow-y-auto" pad>
              <div className="space-y-3">
                <Range label="Exposure" value={adj.bright} min={40} max={180} onChange={n => setAdj(a => ({ ...a, bright: n }))} fmt={n => n + '%'} />
                <Range label="Contrast" value={adj.contrast} min={40} max={180} onChange={n => setAdj(a => ({ ...a, contrast: n }))} fmt={n => n + '%'} />
                <Range label="Saturation" value={adj.sat} min={0} max={220} onChange={n => setAdj(a => ({ ...a, sat: n }))} fmt={n => n + '%'} />
                <Range label="Hue shift" value={adj.hue} min={-180} max={180} onChange={n => setAdj(a => ({ ...a, hue: n }))} fmt={n => n + '°'} cy />
                <Range label="Warmth (temp)" value={adj.temp} min={0} max={80} onChange={n => setAdj(a => ({ ...a, temp: n }))} fmt={n => n + '%'} />
                <Range label="Blur / soften" value={adj.blur} min={0} max={12} step={0.5} onChange={n => setAdj(a => ({ ...a, blur: n }))} fmt={n => n + 'px'} cy />
                <Range label="Vignette" value={adj.vignette} min={0} max={100} onChange={n => setAdj(a => ({ ...a, vignette: n }))} fmt={n => n + '%'} />
                <Range label="Film grain" value={adj.grain} min={0} max={100} onChange={n => setAdj(a => ({ ...a, grain: n }))} fmt={n => n + '%'} cy />
                <Btn v="ghost" s="xs" className="w-full" onClick={() => { setAdj({ bright: 100, contrast: 100, sat: 100, hue: 0, temp: 0, blur: 0, vignette: 30, grain: 18 }); toast('Grade reset to neutral', 'info'); }}>
                  Reset grade
                </Btn>
              </div>
            </Panel>
          </div>

          {/* timeline */}
          <Panel title="TIMELINE · SNAP 0.5s" c="shrink-0" pad={false}
            right={
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-amber">{head.toFixed(1).padStart(4, '0')}s / {total.toFixed(1)}s</span>
                <Btn v={playing ? 'dark' : 'amber'} s="xs" onClick={() => setPlaying(p => !p)}>{playing ? <IcPause s={10} /> : <IcPlay s={10} />}</Btn>
                <Btn v="ghost" s="xs" onClick={() => { setHead(0); setPlaying(false); }}><IcRefresh s={10} /></Btn>
              </div>
            }>
            <div className="p-2">
              <div className="relative h-[18px] mb-1 cursor-pointer select-none"
                onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setHead(Math.max(0, (e.clientX - r.left) / PPS)); }}>
                {Array.from({ length: Math.ceil(total / 5) + 1 }, (_, i) => (
                  <span key={i} className="absolute top-0 font-mono text-[8px] text-dim" style={{ left: i * 5 * PPS }}>{i * 5}s</span>
                ))}
                <div className="absolute bottom-0 h-px w-full bg-line" />
              </div>
              <div className="relative" style={{ height: 3 * 26 + 8 }}>
                {[0, 1, 2].map(lane => (
                  <div key={lane} className="absolute left-0 right-0 h-[24px] rounded-[4px] bg-bg0 border border-line flex items-center px-1.5" style={{ top: lane * 26 + 2 }}>
                    <span className="font-mono text-[8.5px] text-dim flex items-center gap-1 w-[60px] shrink-0">
                      {lane === 0 ? <><IcFilm s={9} /> V1</> : lane === 1 ? <><IcMusic s={9} /> A1</> : <><IcText s={9} /> T1</>}
                    </span>
                    <div className="relative flex-1 h-full">
                      {clips.filter(c => c.lane === lane).map(c => (
                        <div key={c.id} onPointerDown={e => startDrag(e, c.id)}
                          className={`absolute top-[2px] h-[18px] rounded-[4px] flex items-center px-1.5 cursor-grab active:cursor-grabbing transition-shadow select-none overflow-hidden ${selClip === c.id ? 'shadow-[0_0_0_1.5px_#e9eef6]' : ''}`}
                          style={{ left: c.start * PPS, width: Math.max(26, c.dur * PPS), background: c.color + '30', border: `1px solid ${c.color}88` }}>
                          <span className="font-mono text-[8.5px] truncate" style={{ color: c.color }}>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="absolute top-0 bottom-0 w-[2px] bg-amber pointer-events-none z-10" style={{ left: 70 + head * PPS }}>
                  <span className="absolute -top-[1px] -left-[4px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-amber" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-line">
                {selected ? (
                  <>
                    <Chip t="amber">{selected.name}</Chip>
                    <span className="font-mono text-[9.5px] text-dim">in {selected.start.toFixed(1)}s · len {selected.dur.toFixed(1)}s</span>
                    <Btn v="ghost" s="xs" onClick={() => setClips(cs => cs.map(c => c.id === selected.id ? { ...c, start: Math.max(0, c.start - 0.5) } : c))}>◂ nudge</Btn>
                    <Btn v="ghost" s="xs" onClick={() => setClips(cs => cs.map(c => c.id === selected.id ? { ...c, start: c.start + 0.5 } : c))}>nudge ▸</Btn>
                    <Btn v="ghost" s="xs" onClick={() => setClips(cs => cs.map(c => c.id === selected.id ? { ...c, dur: Math.max(1, c.dur - 0.5) } : c))}>trim −</Btn>
                    <Btn v="ghost" s="xs" onClick={() => setClips(cs => cs.map(c => c.id === selected.id ? { ...c, dur: c.dur + 0.5 } : c))}>trim +</Btn>
                    <Btn v="ghost" s="xs" className="text-red! ml-auto" onClick={() => { setClips(cs => cs.filter(c => c.id !== selected.id)); setSelClip(null); }}><IcTrash s={10} /> Delete clip</Btn>
                  </>
                ) : <span className="text-[10.5px] text-dim">Select a clip to trim / nudge — drag clips horizontally to reposition.</span>}
                <Btn v="dark" s="xs" className={selected ? '' : 'ml-auto'} onClick={() => {
                  const n = clips.length + 1;
                  const c: Clip = { id: 'c' + Date.now(), name: `new_clip_${n}.mp4`, type: 'video', lane: 0, start: total, dur: 4, color: CLIP_COLORS[n % CLIP_COLORS.length] };
                  setClips(cs => [...cs, c]); setSelClip(c.id); toast('Clip added to V1', 'info');
                }}><IcPlus s={10} /> Add clip</Btn>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {tab === 'browser' && (
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="panel flex items-center gap-1.5 p-2 shrink-0">
            <Btn v="ghost" s="sm" onClick={() => go(-1)} disabled={histIdx <= 0}><IcArrowL s={12} /></Btn>
            <Btn v="ghost" s="sm" onClick={() => go(1)} disabled={histIdx >= hist.length - 1}><IcArrowR s={12} /></Btn>
            <Btn v="ghost" s="sm" onClick={() => setFrameKey(k => k + 1)} disabled={!url}><IcRefresh s={12} /></Btn>
            <input className="field py-1.5! font-mono text-[11.5px]!" placeholder="Navigate to any AI media site — runwayml.com, pika.art, leonardo.ai…"
              value={urlInput} onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') navigate(urlInput); }} />
            <Btn v="amber" s="sm" onClick={() => navigate(urlInput)}><IcGlobe s={12} /> Go</Btn>
            {url && <Btn v="dark" s="sm" onClick={() => window.open(url, '_blank')} title="Open in system browser"><IcExt s={12} /></Btn>}
          </div>

          <div className="flex-1 relative min-h-0 panel overflow-hidden">
            {!url ? (
              <div className="absolute inset-0 overflow-y-auto p-6 workspace-bg">
                <div className="max-w-[760px] mx-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <IcGlobe s={18} c="text-cyan" />
                    <h2 className="font-disp font-bold text-[18px]">Third-Party AI Generation Browser</h2>
                  </div>
                  <p className="text-[11.5px] text-dim mb-5 max-w-[560px]">Generate video and images on external AI services without leaving OmniForge. Anything you produce is one click from your project — capture it, drop it on the timeline, compile it.</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SITES.map(s => (
                      <button key={s.url} onClick={() => navigate(s.url)}
                        className="text-left rounded-[8px] border border-line bg-bg1 hover:bg-bg2 hover:border-line2 hover:-translate-y-0.5 transition-all duration-150 p-3.5 cursor-pointer group">
                        <div className="flex items-center justify-between">
                          <span className="font-disp font-semibold text-[13.5px] group-hover:text-ink text-ink/90">{s.name}</span>
                          <span className={`font-mono text-[9px] tracking-widest ${s.c}`}>{s.tag}</span>
                        </div>
                        <div className="text-[11px] text-mut mt-1">{s.desc}</div>
                        <div className="font-mono text-[9px] text-dim mt-2 group-hover:text-cyan transition-colors">{s.url.replace('https://', '')} ↗</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 rounded-[6px] border border-amber/25 bg-amber/[.05] p-3 text-[10.5px] text-mut flex gap-2">
                    <IcCam s={13} c="text-amber shrink-0 mt-0.5" />
                    Some services block in-app embedding for security. If a page renders blank, use the ↗ button to open it in a new tab beside OmniForge — your downloads land in the watched folder automatically.
                  </div>
                </div>
              </div>
            ) : (
              <iframe key={frameKey} src={url} title="AI site browser" className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads" referrerPolicy="no-referrer" />
            )}
          </div>

          <div className="panel flex items-center gap-3 px-3 py-2 shrink-0">
            <Chip t="cyan">CAPTURE BRIDGE</Chip>
            <span className="text-[10.5px] text-dim">Downloads from embedded sites are watched at <span className="font-mono text-mut">{local.watch}</span> and auto-imported as sources.</span>
            <Btn v="dark" s="xs" className="ml-auto" onClick={() => { addSource({ kind: 'import', name: `Browser capture ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, meta: 'Imported from AI site browser · watch folder', duration: 6 }); toast('Captured media imported to Media Library', 'ok'); }}>
              <IcDl s={10} /> Import last capture
            </Btn>
          </div>
        </div>
      )}

      {tab === 'local' && (
        <div className="flex-1 grid grid-cols-2 gap-3 min-h-0 overflow-y-auto">
          <div className="space-y-3">
            <Panel title="LOCAL AI ENGINE BRIDGES">
              <div className="space-y-2.5">
                {engineRows.map(en => (
                  <div key={en.key} className="rounded-[6px] border border-line bg-bg2 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IcChip s={14} c="text-cyan" />
                        <div>
                          <div className="font-disp font-semibold text-[12.5px]">{en.name}</div>
                          <div className="text-[10px] text-dim">{en.desc}</div>
                        </div>
                      </div>
                      {engineStatus[en.key] === 'ok' && <Chip t="grn">CONNECTED</Chip>}
                      {engineStatus[en.key] === 'fail' && <Chip t="red">UNREACHABLE</Chip>}
                      {engineStatus[en.key] === 'checking' && <Chip t="amber"><Spinner s={9} /> PROBING</Chip>}
                      {engineStatus[en.key] === 'idle' && <Chip>NOT PROBED</Chip>}
                    </div>
                    <div className="flex gap-1.5 mt-2.5">
                      <input className="field font-mono text-[11px]!" value={local[en.key]} onChange={e => setLocal({ ...local, [en.key]: e.target.value })} />
                      <Btn v="cyan" s="sm" onClick={() => ping(en.key)} disabled={engineStatus[en.key] === 'checking'}>Connect</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="RUNTIME">
              <div className="space-y-3">
                <div>
                  <Lbl c="mb-1">GPU device</Lbl>
                  <SelWrap>
                    <select className="field" value={local.gpu} onChange={e => setLocal({ ...local, gpu: e.target.value })}>
                      {['Auto (CUDA if available)', 'NVIDIA CUDA', 'AMD ROCm', 'Apple Metal', 'CPU only'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </SelWrap>
                </div>
                <ToggleLine on={local.fallback} onChange={(b: boolean) => setLocal({ ...local, fallback: b })} label="Fall back to cloud API when local engines are offline" />
              </div>
            </Panel>
          </div>
          <div className="space-y-3">
            <Panel title="WATCHED FOLDERS">
              <Lbl c="mb-1">Render watch folder (auto-import)</Lbl>
              <input className="field font-mono text-[11px]!" value={local.watch} onChange={e => setLocal({ ...local, watch: e.target.value })} />
              <p className="text-[10.5px] text-dim mt-2 leading-relaxed">
                OmniForge polls this folder every 5 seconds. Outputs from ComfyUI, A1111 or any local video generator drop in here and appear instantly in the Media Library — ready for the compiler.
              </p>
              <div className="flex gap-1.5 mt-3">
                <Btn v="amber" s="sm" onClick={saveLocal}>Save bridge config</Btn>
                <Btn v="ghost" s="sm" onClick={() => { addSource({ kind: 'visual', name: 'Local render — comfyui_out_0042.png', meta: 'Watched folder import · 1024×1024', duration: 0 }); toast('Simulated watched-folder import registered', 'info'); }}>Simulate import</Btn>
              </div>
            </Panel>
            <Panel title="PIPELINE MAP" c="flex-1">
              {[
                ['Prompt / storyboard', 'built-in or Ollama'],
                ['Local diffusion', 'ComfyUI · A1111'],
                ['Upscale + face fix', 'local chain'],
                ['Watched folder', 'auto-import'],
                ['Media Library', 'compiler-ready'],
              ].map(([a, b], i, arr) => (
                <div key={a}>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-cyan/40 bg-cyan/10 text-cyan font-mono text-[9px] flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-[11.5px] text-ink">{a}</span>
                    <span className="ml-auto font-mono text-[9px] text-dim">{b}</span>
                  </div>
                  {i < arr.length - 1 && <div className="ml-[9px] h-3 w-px bg-line2" />}
                </div>
              ))}
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleLine({ on, onChange, label }: { on: boolean; onChange: (b: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!on)} className="flex items-center gap-2.5 cursor-pointer w-full text-left">
      <span className={`w-8 h-[17px] rounded-full relative transition-colors shrink-0 border ${on ? 'bg-cyan/90 border-cyan' : 'bg-bg3 border-line2'}`}>
        <span className={`absolute top-[2px] w-[11px] h-[11px] rounded-full bg-bg0 transition-all ${on ? 'left-[17px]' : 'left-[2px] bg-dim'}`} />
      </span>
      <span className={`text-[11px] ${on ? 'text-ink' : 'text-dim'}`}>{label}</span>
    </button>
  );
}
