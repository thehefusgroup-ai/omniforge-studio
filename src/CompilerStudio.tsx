import { useEffect, useState } from 'react';
import type { Source, Task, TaskType } from './types';
import { produceLastFreeFacelessVideo } from './freefacelessApi';
import {
  Btn, Lbl, Panel, Chip, Range, Seg, SelWrap, Empty, Bar, Spinner, uid,
  IcBolt, IcPlay, IcStack, IcCal, IcTrash, IcDl, IcCheck, IcClock, IcDoc, IcMic, IcImage, IcFilm, IcFolder,
  IcLayers3, IcAlert,
} from './ui';

interface ExportRec { id: string; name: string; format: string; res: string; status: 'rendering' | 'done'; pct: number; sizeMB: number; at: number; videoUrl?: string }

const FORMATS = ['MP4 · H.264', 'MP4 · H.265 / HEVC', 'MOV · ProRes 422', 'WebM · VP9', 'GIF · Animated', 'MP3 · Audio only', 'WAV · Audio master', 'PNG · Frame sequence'];
const RESOLUTIONS = ['3840×2160 · 4K UHD', '1920×1080 · Full HD', '1080×1920 · Vertical 9:16', '1080×1080 · Square', '1280×720 · HD'];
const MANUAL_STAGES = ['Resolving sources', 'Normalizing audio', 'Building timeline', 'Rendering frames', 'Muxing container'];
const AUTO_STAGES = ['Ingesting sources', 'Storyboarding beats', 'Placing timeline', 'Mixing voiceover', 'Color & grade pass', 'Encoding & muxing'];
const TASK_META: Record<TaskType, { label: string; verb: string }> = {
  script: { label: 'Auto-script — discovery roll', verb: 'Script generated' },
  voice: { label: 'Voiceover — daily read', verb: 'Voice take rendered' },
  visual: { label: 'Visual — prompt render batch', verb: 'Plates rendered' },
  compile: { label: 'Auto-compile — daily vertical', verb: 'Final cut compiled' },
};

const kindIcon = (k: Source['kind']) =>
  k === 'script' ? IcDoc : k === 'voice' ? IcMic : k === 'visual' ? IcImage : k === 'timeline' ? IcFilm : k === 'final' ? IcStack : IcFolder;
const kindTone = (k: Source['kind']) =>
  k === 'script' ? 'amber' : k === 'voice' ? 'cyan' : k === 'visual' ? 'vio' : k === 'final' ? 'grn' : 'mut';

interface ExpSettings { filename: string; format: string; res: string; fps: string; quality: number; bitrate: string }
const DEFAULT_EXP: ExpSettings = { filename: 'final_cut_01', format: FORMATS[0], res: RESOLUTIONS[1], fps: '30', quality: 82, bitrate: '320' };
function loadJSON<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
const toLocalInput = (ms: number) => { const d = new Date(ms); const p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
const fmtCountdown = (ms: number) => { if (ms <= 0) return 'DUE'; const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60; return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`; };

export default function CompilerStudio({ sources, addSource, removeSource, toast, tasks, setTasks }: {
  sources: Source[];
  addSource: (s: { kind: string; name: string; meta: string; duration: number }) => void;
  removeSource: (id: string) => void;
  toast: (msg: string, kind?: 'ok' | 'info' | 'err') => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [mode, setMode] = useState<'manual' | 'auto'>('auto');
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [exp, setExp] = useState<ExpSettings>(() => loadJSON('ofx.exp', DEFAULT_EXP));
  const [exports, setExports] = useState<ExportRec[]>(() => loadJSON<ExportRec[]>('ofx.exports', []));
  const [manual, setManual] = useState<{ pct: number; stage: number } | null>(null);
  const [auto, setAuto] = useState<{ stage: number } | null>(null);
  const [now, setNow] = useState(Date.now());
  const [form, setForm] = useState<{ type: TaskType; at: string }>({ type: 'script', at: toLocalInput(Date.now() + 5 * 60e3) });

  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(t); }, []);
  useEffect(() => { localStorage.setItem('ofx.exp', JSON.stringify(exp)); }, [exp]);
  useEffect(() => { localStorage.setItem('ofx.exports', JSON.stringify(exports.slice(0, 12))); }, [exports]);

  const selected = sources.filter(s => sel.has(s.id));
  const estDur = selected.reduce((a, s) => a + s.duration, 0);

  const finalize = (baseName: string, srcCount: number, videoUrl?: string, actualDuration?: number) => {
    const ext = exp.format.startsWith('MP3') || exp.format.startsWith('WAV') ? (exp.format.startsWith('MP3') ? 'mp3' : 'wav') : exp.format.startsWith('PNG') ? 'zip' : exp.format.split('·')[0].trim().toLowerCase();
    const name = `${exp.filename || baseName}.${ext}`;
    const sizeMB = Math.round((18 + srcCount * 14 + exp.quality * 0.9) * (exp.res.includes('3840') ? 3.4 : 1));
    const rec: ExportRec = { id: uid(), name, format: exp.format, res: exp.res, status: 'rendering', pct: 0, sizeMB, at: Date.now(), videoUrl };
    setExports(x => [rec, ...x].slice(0, 12));
    const iv = window.setInterval(() => setExports(x => x.map(r => r.id === rec.id ? { ...r, pct: Math.min(100, r.pct + 4 + Math.random() * 9) } : r)), 160);
    window.setTimeout(() => {
      window.clearInterval(iv);
      setExports(x => x.map(r => r.id === rec.id ? { ...r, pct: 100, status: 'done', videoUrl } : r));
      addSource({ kind: 'final', name: `FINAL — ${name}`, meta: `${exp.format} · ${exp.res} · ${exp.fps} fps · Q${exp.quality}${videoUrl ? ' · REAL BACKEND' : ''}`, duration: Math.max(10, actualDuration ?? estDur) });
      toast(videoUrl ? `Real production complete — ${name}` : `Production complete — ${name} (${sizeMB} MB) is in the render queue`, 'ok');
    }, 2600);
  };

  const runManual = () => {
    if (selected.length === 0) { toast('Select at least one source to compile', 'err'); return; }
    if (manual) return;
    setManual({ pct: 0, stage: 0 });
    const iv = window.setInterval(() => setManual(m => { if (!m) return m; const pct = Math.min(100, m.pct + 2.5 + Math.random() * 3); return { pct, stage: Math.min(MANUAL_STAGES.length - 1, Math.floor((pct / 100) * MANUAL_STAGES.length)) }; }), 90);
    window.setTimeout(() => { window.clearInterval(iv); finalize('manual_mix', selected.length); setManual(null); }, 3600);
  };

  const runAuto = async () => {
    if (auto) return;
    if (sources.length === 0) { toast('Media Library is empty — generate a script first', 'err'); return; }
    setAuto({ stage: 0 });
    try {
      for (let i = 0; i < AUTO_STAGES.length - 1; i++) {
        setAuto({ stage: i });
        await new Promise(resolve => window.setTimeout(resolve, 350));
      }
      setAuto({ stage: AUTO_STAGES.length - 1 });
      const result = await produceLastFreeFacelessVideo();
      const actualName = result.path.split(/[\\/]/).pop() || 'final.mp4';
      setAuto(null);
      const rec: ExportRec = {
        id: uid(), name: actualName, format: 'MP4 · H.264', res: RESOLUTIONS[2],
        status: 'done', pct: 100, sizeMB: 0, at: Date.now(), videoUrl: result.video_url,
      };
      setExports(x => [rec, ...x].slice(0, 12));
      addSource({ kind: 'final', name: `FINAL — ${result.title}`, meta: `REAL BACKEND · ${result.words} words · ${result.duration_sec}s · MP4`, duration: result.duration_sec });
      toast(`REAL VIDEO COMPLETE — ${result.title}`, 'ok');
    } catch (err) {
      setAuto(null);
      toast(err instanceof Error ? `Production failed — ${err.message}` : 'Production failed — check the FreeFaceless API', 'err');
    }
  };

  const download = (r: ExportRec) => {
    if (r.videoUrl) { window.open(`http://127.0.0.1:8000${r.videoUrl}`, '_blank', 'noopener,noreferrer'); return; }
    const manifest = { project: 'OmniForge Studio', file: r.name, format: r.format, resolution: r.res, fps: exp.fps, quality: exp.quality, audioBitrateKbps: exp.bitrate, sizeMB: r.sizeMB, sources: selected.map(s => ({ name: s.name, kind: s.kind })), exportedAt: new Date(r.at).toISOString(), note: 'Render manifest — full media payload streams from the connected render node.' };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' })); a.download = r.name + '.manifest.json'; a.click(); URL.revokeObjectURL(a.href); toast('Render manifest downloaded', 'ok');
  };

  const addTask = () => {
    const at = new Date(form.at).getTime();
    if (Number.isNaN(at)) { toast('Pick a valid date & time', 'err'); return; }
    if (at < Date.now() - 60e3) { toast('Scheduled time is in the past', 'err'); return; }
    setTasks(t => [...t, { id: uid(), type: form.type, label: TASK_META[form.type].label, at, status: 'pending' }]);
    toast(`Task scheduled — ${TASK_META[form.type].label} at ${new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 'ok');
    setForm(f => ({ ...f, at: toLocalInput(Date.now() + 5 * 60e3) }));
  };
  const fireNow = (id: string) => setTasks(t => t.map(x => x.id === id ? { ...x, at: Date.now() } : x));
  const pending = tasks.filter(t => t.status === 'pending').sort((a, b) => a.at - b.at);
  const doneTasks = tasks.filter(t => t.status !== 'pending');

  return (
    <div className="h-full flex flex-col gap-3 p-3 min-h-0 area-enter">
      <div className="flex items-center justify-between shrink-0">
        <div><h1 className="font-disp font-bold text-[19px] leading-tight tracking-tight">Media Compiler</h1><div className="text-[11px] text-dim mt-0.5">Manual & one-click production · task scheduler · final format delivery</div></div>
        <div className="flex items-center gap-2"><Chip t="grn"><span className="w-1.5 h-1.5 rounded-full bg-grn live-dot" /> RENDER NODE READY</Chip><Chip t="amber">{sources.length} SOURCES</Chip></div>
      </div>

      <div className="flex-1 grid grid-cols-[290px_1fr_300px] gap-3 min-h-0">
        <Panel title="SOURCE SELECTION" c="min-h-0" pad={false} right={<div className="flex gap-1"><button className="text-[9px] font-mono text-dim hover:text-amber cursor-pointer" onClick={() => setSel(new Set(sources.map(s => s.id)))}>ALL</button><button className="text-[9px] font-mono text-dim hover:text-amber cursor-pointer" onClick={() => setSel(new Set())}>NONE</button></div>}>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {sources.length === 0 && <Empty icon={<IcFolder s={22} />} title="Library empty" sub="Scripts, voice takes and plates from the other studios land here automatically." />}
            {sources.map(s => { const Ico = kindIcon(s.kind); const on = sel.has(s.id); return <div key={s.id} className={`rounded-[6px] border p-2 transition-all group ${on ? 'border-amber/50 bg-amber/[.05]' : 'border-line bg-bg2 hover:border-line2'}`}><div className="flex items-start gap-2"><button onClick={() => setSel(prev => { const n = new Set(prev); if (n.has(s.id)) n.delete(s.id); else n.add(s.id); return n; })} className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-all ${on ? 'bg-amber border-amber text-[#1a1204]' : 'border-line2 hover:border-amber/60'}`}>{on && <IcCheck s={9} />}</button><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><Ico s={11} c={`shrink-0 text-${kindTone(s.kind)}`} /><span className="text-[11px] font-medium text-ink truncate">{s.name}</span></div><div className="text-[9.5px] text-dim font-mono mt-0.5 truncate">{s.meta}</div></div><button onClick={() => removeSource(s.id)} className="opacity-0 group-hover:opacity-100 text-dim hover:text-red transition-all cursor-pointer shrink-0"><IcTrash s={10} /></button></div></div>; })}
          </div>
          <div className="p-2 border-t border-line shrink-0 flex items-center justify-between"><span className="font-mono text-[9.5px] text-dim">{selected.length} selected</span><span className="font-mono text-[9.5px] text-amber">Σ {Math.floor(estDur / 60)}:{String(Math.round(estDur % 60)).padStart(2, '0')} est</span></div>
        </Panel>

        <div className="flex flex-col gap-3 min-h-0">
          <Seg opts={[{ v: 'auto' as const, label: <><IcBolt s={11} /> AUTO-GENERATE · ONE-CLICK</> }, { v: 'manual' as const, label: <><IcLayers3 s={11} /> MANUAL COMPILE</> }]} value={mode} onChange={setMode} c="shrink-0" />
          {mode === 'auto' ? <Panel title="SINGLE-BUTTON PRODUCTION" c="flex-1 min-h-0"><div className="h-full flex flex-col"><p className="text-[11.5px] text-mut leading-relaxed">The AI producer ingests your Media Library and hands the latest generated FreeFaceless script to the real production backend — voice, captions, visuals and FFmpeg assembly.</p><div className="mt-4 space-y-2 flex-1">{AUTO_STAGES.map((s, i) => { const active = auto && auto.stage === i; const done = auto ? auto.stage > i : false; return <div key={s} className={`flex items-center gap-2.5 rounded-[6px] border px-3 py-2 transition-all duration-300 ${active ? 'border-amber/60 bg-amber/[.07]' : done && auto ? 'border-grn/30 bg-grn/[.04]' : 'border-line bg-bg2'}`}><span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] shrink-0 border ${active ? 'border-amber text-amber' : done && auto ? 'border-grn/50 text-grn' : 'border-line2 text-dim'}`}>{done && auto ? <IcCheck s={9} /> : active ? <Spinner s={9} /> : i + 1}</span><span className={`text-[12px] ${active ? 'text-amber font-medium' : done && auto ? 'text-grn' : 'text-mut'}`}>{s}</span>{active && <span className="ml-auto font-mono text-[9px] text-amber">RUNNING…</span>}{done && auto && <span className="ml-auto font-mono text-[9px] text-grn">DONE</span>}</div>; })}</div><div className="mt-4 shrink-0"><Btn v="amber" s="lg" className="w-full text-[14.5px]! py-3!" onClick={runAuto} disabled={!!auto}>{auto ? <Spinner s={15} /> : <IcBolt s={15} />}{auto ? `Producing — ${AUTO_STAGES[auto.stage]}…` : 'One-Click Produce'}</Btn>{auto && <div className="mt-2"><Bar pct={((auto.stage + 1) / AUTO_STAGES.length) * 100} /></div>}</div></div></Panel> : <Panel title="MANUAL COMPILE ORDER" c="flex-1 min-h-0"><div className="h-full flex flex-col"><div className="flex-1 overflow-y-auto space-y-1.5">{selected.length === 0 ? <Empty icon={<IcLayers3 s={22} />} title="No sources selected" sub="Tick sources in the left panel — they stack here in library order." /> : selected.map((s, i) => { const Ico = kindIcon(s.kind); return <div key={s.id} className="flex items-center gap-2.5 rounded-[6px] border border-line bg-bg2 px-3 py-2 pop-in"><span className="font-mono text-[10px] text-amber w-5">{String(i + 1).padStart(2, '0')}</span><Ico s={12} c="text-cyan" /><span className="text-[11.5px] text-ink truncate">{s.name}</span><span className="ml-auto font-mono text-[9px] text-dim">{s.duration}s</span></div>; })}</div><div className="mt-3 shrink-0">{manual && <div className="mb-2"><div className="flex justify-between mb-1"><span className="font-mono text-[9.5px] text-amber">{MANUAL_STAGES[manual.stage]}…</span><span className="font-mono text-[9.5px] text-dim">{Math.round(manual.pct)}%</span></div><div className="rounded-full bg-bg3 overflow-hidden h-[7px]"><div className="h-full bg-amber stripes" style={{ width: manual.pct + '%' }} /></div></div>}<Btn v="amber" s="lg" className="w-full" onClick={runManual} disabled={!!manual}>{manual ? <Spinner s={14} /> : <IcPlay s={13} />} {manual ? 'Compiling…' : 'Compile selected sources'}</Btn></div></div></Panel>}
        </div>

        <div className="flex flex-col gap-3 min-h-0">
          <Panel title="FINAL PRODUCTION OPTIONS" c="shrink-0"><div className="space-y-2.5"><div><Lbl c="mb-1">Output filename</Lbl><input className="field font-mono text-[11px]!" value={exp.filename} onChange={e => setExp({ ...exp, filename: e.target.value })} /></div><div className="grid grid-cols-2 gap-2"><div><Lbl c="mb-1">Container / codec</Lbl><SelWrap><select className="field" value={exp.format} onChange={e => setExp({ ...exp, format: e.target.value })}>{FORMATS.map(f => <option key={f}>{f}</option>)}</select></SelWrap></div><div><Lbl c="mb-1">Resolution</Lbl><SelWrap><select className="field" value={exp.res} onChange={e => setExp({ ...exp, res: e.target.value })}>{RESOLUTIONS.map(f => <option key={f}>{f}</option>)}</select></SelWrap></div><div><Lbl c="mb-1">Frame rate</Lbl><SelWrap><select className="field" value={exp.fps} onChange={e => setExp({ ...exp, fps: e.target.value })}>{['24', '30', '60', '120'].map(f => <option key={f}>{f} fps</option>)}</select></SelWrap></div><div><Lbl c="mb-1">Audio bitrate</Lbl><SelWrap><select className="field" value={exp.bitrate} onChange={e => setExp({ ...exp, bitrate: e.target.value })}>{['128', '192', '256', '320'].map(f => <option key={f}>{f} kbps</option>)}</select></SelWrap></div></div><Range label="Quality / bitrate bias" value={exp.quality} min={40} max={100} onChange={n => setExp({ ...exp, quality: n })} fmt={n => 'Q' + n} /></div></Panel>
          <Panel title={`RENDER QUEUE · ${exports.length}`} c="flex-1 min-h-0" pad={false}><div className="flex-1 overflow-y-auto p-2 space-y-1.5">{exports.length === 0 && <Empty icon={<IcStack s={20} />} title="No renders yet" sub="Compiled productions appear here with their delivery manifest." />}{exports.map(r => <div key={r.id} className="rounded-[6px] border border-line bg-bg2 p-2.5 pop-in"><div className="flex items-center gap-2"><IcFilm s={12} c={r.status === 'done' ? 'text-grn' : 'text-amber'} /><span className="font-mono text-[10.5px] text-ink truncate flex-1">{r.name}</span>{r.status === 'done' ? <Chip t="grn"><IcCheck s={8} /> DONE</Chip> : <Chip t="amber"><Spinner s={8} /> {Math.round(r.pct)}%</Chip>}</div><div className="mt-1.5"><Bar pct={r.pct} tone={r.status === 'done' ? 'grn' : 'amber'} h={3} /></div><div className="flex items-center gap-1.5 mt-1.5"><span className="font-mono text-[8.5px] text-dim">{r.format} · {r.res}{r.sizeMB ? ` · ${r.sizeMB} MB` : ''}</span>{r.status === 'done' && <Btn v="ghost" s="xs" className="ml-auto py-0.5!" onClick={() => download(r)}>{r.videoUrl ? <><IcPlay s={9} /> Open video</> : <><IcDl s={9} /> Manifest</>}</Btn>}</div></div>)}</div></Panel>
        </div>
      </div>

      <Panel title="TASK SCHEDULER — EXECUTE LATER" c="shrink-0" pad={false} right={<div className="flex items-center gap-2"><IcClock s={11} c="text-cyan" /><span className="font-mono text-[10px] text-mut">{pending.length} pending · next {pending[0] ? fmtCountdown(pending[0].at - now) : '—'}</span></div>}>
        <div className="grid grid-cols-[330px_1fr] max-h-[210px]"><div className="border-r border-line p-2.5 space-y-2 overflow-y-auto"><div><Lbl c="mb-1">Task to execute</Lbl><SelWrap><select className="field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as TaskType }))}>{(Object.keys(TASK_META) as TaskType[]).map(k => <option key={k} value={k}>{TASK_META[k].label}</option>)}</select></SelWrap></div><div><Lbl c="mb-1">Scheduled time</Lbl><input type="datetime-local" className="field font-mono text-[11px]!" value={form.at} onChange={e => setForm(f => ({ ...f, at: e.target.value }))} /></div><div className="flex gap-1.5"><Btn v="cyan" s="sm" className="flex-1" onClick={addTask}><IcCal s={11} /> Schedule task</Btn><Btn v="ghost" s="sm" onClick={() => setForm(f => ({ ...f, at: toLocalInput(Date.now() + 60e3) }))}>+1m</Btn><Btn v="ghost" s="sm" onClick={() => setForm(f => ({ ...f, at: toLocalInput(Date.now() + 60 * 60e3) }))}>+1h</Btn></div><p className="text-[9.5px] text-dim leading-relaxed flex gap-1.5"><IcAlert s={10} c="text-amber shrink-0 mt-0.5" /> When the countdown hits zero the task runs by itself and drops its output into the Media Library.</p></div><div className="overflow-y-auto p-2.5"><div className="space-y-1.5">{[...pending, ...doneTasks].map(t => <div key={t.id} className={`flex items-center gap-2.5 rounded-[6px] border px-3 py-2 ${t.status === 'running' ? 'border-cyan/50 bg-cyan/[.05]' : t.status === 'done' ? 'border-line bg-bg1 opacity-70' : 'border-line bg-bg2'}`}>{t.status === 'done' ? <IcCheck s={12} c="text-grn" /> : t.status === 'running' ? <Spinner s={12} /> : <IcCal s={12} c="text-cyan" />}<div className="min-w-0 flex-1"><div className="text-[11.5px] text-ink truncate">{t.label}</div><div className="font-mono text-[9px] text-dim">{new Date(t.at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}{t.status === 'done' && t.result && <span className="text-grn"> · {t.result}</span>}</div></div>{t.status === 'pending' && <span className={`font-mono text-[11px] ${t.at - now < 60e3 ? 'text-red' : 'text-amber'}`}>{fmtCountdown(t.at - now)}</span>}{t.status === 'running' && <Chip t="cyan">EXECUTING</Chip>}{t.status === 'done' && <Chip t="grn">DONE</Chip>}{t.status === 'pending' && <><Btn v="ghost" s="xs" onClick={() => fireNow(t.id)} title="Execute immediately"><IcPlay s={9} /></Btn><Btn v="ghost" s="xs" className="text-red!" onClick={() => setTasks(x => x.filter(y => y.id !== t.id))}><IcTrash s={9} /></Btn></>}</div>)}{tasks.length === 0 && <Empty icon={<IcCal s={20} />} title="No scheduled tasks" sub="Queue a task on the left — it fires itself at the scheduled time." />}</div></div></div>
      </Panel>
    </div>
  );
}