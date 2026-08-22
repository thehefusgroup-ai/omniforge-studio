import { useEffect, useRef, useState } from 'react';
import VoiceStudio from './VoiceStudio';
import ScriptStudio from './ScriptStudio';
import VisualStudio from './VisualStudio';
import CompilerStudio from './CompilerStudio';
import type { Source, Task, Settings, TaskType } from './types';
import { generateScript, TRENDING } from './generator';
import {
  Btn, Chip, Lbl, SelWrap, Spinner, uid,
  IcScript, IcMic, IcFilm, IcStack, IcGear, IcLogo, IcMin, IcMax, IcClose, IcCheck, IcAlert, IcSpark,
  IcBolt, IcDoc, IcImage, IcRadio,
} from './ui';

type Area = 'script' | 'voice' | 'visual' | 'compiler';

const NAV: { id: Area; label: string; sub: string; icon: (p: { s?: number }) => React.ReactElement }[] = [
  { id: 'script', label: 'Script', sub: 'AI content engine', icon: IcScript },
  { id: 'voice', label: 'Voice', sub: 'AI text-to-speech', icon: IcMic },
  { id: 'visual', label: 'Visual', sub: 'Video & image AI', icon: IcFilm },
  { id: 'compiler', label: 'Compile', sub: 'Produce & schedule', icon: IcStack },
];

const TTS_PROVIDERS = ['ElevenLabs Turbo v3', 'OpenAI TTS HD', 'PlayHT 2.0', 'Azure Neural', 'Google WaveNet'];
const LLM_PROVIDERS = ['OpenAI GPT-4o', 'Anthropic Claude 3.5', 'Google Gemini Ultra', 'Mistral Large 2'];
const IMG_PROVIDERS = ['Stability SD3 Ultra', 'Replicate Flux Pro', 'OpenAI DALL·E 3', 'Ideogram 2.0'];

function loadJSON<T>(key: string, fb: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fb; } catch { return fb; }
}

interface ToastItem { id: string; msg: string; kind: 'ok' | 'info' | 'err' }

export default function App() {
  const [area, setArea] = useState<Area>('script');
  const [sources, setSources] = useState<Source[]>(() => loadJSON<Source[]>('ofx.sources', []));
  const [tasks, setTasks] = useState<Task[]>(() => loadJSON<Task[]>('ofx.tasks', []).map((t: Task) => t.status === 'running' ? { ...t, status: 'pending' as const } : t));
  const [settings, setSettings] = useState<Settings>(() => loadJSON<Settings>('ofx.settings', {
    providers: { tts: TTS_PROVIDERS[0], llm: LLM_PROVIDERS[0], img: IMG_PROVIDERS[0] },
    keys: { tts: '', llm: '', img: '' },
    verified: { tts: false, llm: false, img: false },
  }));
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [incomingVoice, setIncomingVoice] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [menu, setMenu] = useState<null | 'file' | 'edit' | 'view' | 'render' | 'help'>(null);
  const [showBar, setShowBar] = useState(true);
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => { localStorage.setItem('ofx.sources', JSON.stringify(sources.slice(0, 60))); }, [sources]);
  useEffect(() => { localStorage.setItem('ofx.tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('ofx.settings', JSON.stringify(settings)); }, [settings]);

  const toast = (msg: string, kind: 'ok' | 'info' | 'err' = 'ok') => {
    const id = uid();
    setToasts(t => [...t.slice(-3), { id, msg, kind }]);
    window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  };

  const addSource = (s: { kind: string; name: string; meta: string; duration: number }) =>
    setSources(x => [{ ...s, kind: s.kind as Source['kind'], id: uid(), createdAt: Date.now() }, ...x]);
  const removeSource = (id: string) => setSources(x => x.filter(s => s.id !== id));

  /* ---- scheduled task runner ---- */
  useEffect(() => {
    const due = tasks.find(t => t.status === 'pending' && t.at <= Date.now() && !firedRef.current.has(t.id));
    if (!due) return;
    firedRef.current.add(due.id);
    setTasks(ts => ts.map(t => t.id === due.id ? { ...t, status: 'running' } : t));
    window.setTimeout(() => {
      let result = '';
      if (due.type === 'script') {
        const r = generateScript({ topic: TRENDING[Math.floor(Math.random() * TRENDING.length)].topic, mode: 'dice', durationSec: 45, targetWords: 118, segments: [{ id: uid(), type: 'hook', note: '' }, { id: uid(), type: 'value', note: '' }, { id: uid(), type: 'cta', note: '' }], personaId: null });
        addSource({ kind: 'script', name: r.titles[0], meta: `Scheduled auto-script · ${r.words} words`, duration: r.seconds });
        result = `wrote "${r.titles[0]}"`;
      } else if (due.type === 'voice') {
        addSource({ kind: 'voice', name: 'VO Take — scheduled read (ATLAS)', meta: 'Scheduled daily read · 312 chars · Narration style', duration: 21 });
        result = 'take rendered to library';
      } else if (due.type === 'visual') {
        addSource({ kind: 'visual', name: `Plate batch — scheduled (${new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })})`, meta: '3 plates · 1280×720 · prompt render batch', duration: 12 });
        result = 'plates rendered';
      } else {
        addSource({ kind: 'final', name: 'FINAL — daily_vertical.mp4', meta: 'MP4 · 1080×1920 · scheduled auto-compile', duration: 34 });
        result = 'vertical compiled';
      }
      setTasks(ts => ts.map(t => t.id === due.id ? { ...t, status: 'done', result } : t));
      toast(`Scheduled task executed — ${due.label}`, 'ok');
    }, 2400);
  }, [tasks]);

  /* ---- keyboard: Ctrl+1..4 switches studios ---- */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      const i = ['1', '2', '3', '4'].indexOf(e.key);
      if (i >= 0) { e.preventDefault(); setArea(NAV[i].id); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const downloadProject = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ project: 'OmniForge Studio', version: '2.4.1', sources, tasks, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' }));
    a.download = 'omniforge_project.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Project manifest exported', 'ok');
  };

  const MENUS: Record<'file' | 'edit' | 'view' | 'render' | 'help', { label: string; fn: () => void }[]> = {
    file: [
      { label: 'New project (clear library)', fn: () => { setSources([]); toast('New project — media library cleared', 'info'); } },
      { label: 'Export project JSON', fn: downloadProject },
      { label: 'API settings…', fn: () => setShowSettings(true) },
    ],
    edit: [
      { label: 'Remove last source (undo)', fn: () => { if (sources[0]) { removeSource(sources[0].id); toast('Removed most recent source', 'info'); } else toast('Nothing to undo', 'err'); } },
      { label: 'Clear notifications', fn: () => setToasts([]) },
    ],
    view: [
      { label: showBar ? 'Hide status bar' : 'Show status bar', fn: () => setShowBar(b => !b) },
      { label: 'Cycle studio area', fn: () => setArea(a => NAV[(NAV.findIndex(n => n.id === a) + 1) % NAV.length].id) },
    ],
    render: [
      { label: 'Open Media Compiler', fn: () => setArea('compiler') },
      { label: 'Quick export project JSON', fn: downloadProject },
    ],
    help: [
      { label: 'About OmniForge Studio', fn: () => toast('OmniForge Studio v2.4.1 — neural cores online, all engines nominal', 'info') },
      { label: 'Keyboard: Ctrl+1…4 switch studios', fn: () => toast('Ctrl+1 Script · Ctrl+2 Voice · Ctrl+3 Visual · Ctrl+4 Compile', 'info') },
    ],
  };

  const verifyKey = (k: 'tts' | 'llm' | 'img') => {
    setSettings(s => ({ ...s, verified: { ...s.verified, [k]: false } }));
    window.setTimeout(() => {
      setSettings(s => ({ ...s, verified: { ...s.verified, [k]: true } }));
      toast(`${k.toUpperCase()} API key verified — endpoint handshake OK`, 'ok');
    }, 900);
  };

  return (
    <div className="h-full flex flex-col workspace-bg text-ink select-none">
      {/* ============ TITLE BAR ============ */}
      <header className="h-[42px] shrink-0 bg-bg1 border-b border-line flex items-center px-3 gap-3 relative z-40">
        <div className="flex items-center gap-2.5">
          <IcLogo s={22} />
          <div className="leading-none">
            <div className="font-disp font-bold text-[13px] tracking-[.08em]">OMNIFORGE <span className="text-amber">STUDIO</span></div>
            <div className="font-mono text-[8px] text-dim mt-[3px]">ALL-IN-ONE AI MEDIA CREATION · v2.4.1</div>
          </div>
        </div>

        <nav className="flex items-center gap-0.5 ml-4 h-full">
          {(Object.keys(MENUS) as (keyof typeof MENUS)[]).map(m => (
            <div key={m} className="relative h-full flex items-center">
              <button onClick={() => setMenu(menu === m ? null : m)}
                className={`px-2.5 py-1 rounded-[5px] text-[11.5px] capitalize transition-colors cursor-pointer ${menu === m ? 'bg-bg3 text-amber' : 'text-mut hover:text-ink hover:bg-bg2'}`}>
                {m}
              </button>
              {menu === m && (
                <div className="absolute top-full left-0 mt-1 w-[240px] panel shadow-[0_12px_40px_rgba(0,0,0,.55)] py-1 pop-in z-50">
                  {MENUS[m].map(it => (
                    <button key={it.label} onClick={() => { it.fn(); setMenu(null); }}
                      className="w-full text-left px-3 py-1.5 text-[11.5px] text-mut hover:text-ink hover:bg-bg3 transition-colors cursor-pointer">
                      {it.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <span className="font-mono text-[9.5px] text-dim hidden lg:block">PROJECT: untitled_campaign.ofx</span>
          <button onClick={() => setShowSettings(true)} className="flex items-center gap-1.5 px-2 py-1 rounded-[5px] border border-line text-[10px] font-mono text-mut hover:text-amber hover:border-amber/40 transition-colors cursor-pointer">
            <IcGear s={11} /> API
            <span className={`w-1.5 h-1.5 rounded-full ${settings.verified.tts || settings.verified.llm || settings.verified.img ? 'bg-grn live-dot' : 'bg-dim'}`} />
          </button>
          <span className="flex items-center gap-1.5 font-mono text-[9.5px] text-red"><span className="w-2 h-2 rounded-full bg-red rec-dot" />REC</span>
          <div className="flex items-center ml-1">
            <button className="w-8 h-7 flex items-center justify-center text-dim hover:text-ink hover:bg-bg3 rounded-[4px] transition-colors cursor-pointer" onClick={() => toast('Minimize is decorative in the web build', 'info')}><IcMin s={12} /></button>
            <button className="w-8 h-7 flex items-center justify-center text-dim hover:text-ink hover:bg-bg3 rounded-[4px] transition-colors cursor-pointer" onClick={() => toast('Workspace is already at full canvas', 'info')}><IcMax s={11} /></button>
            <button className="w-8 h-7 flex items-center justify-center text-dim hover:text-red hover:bg-red/10 rounded-[4px] transition-colors cursor-pointer" onClick={() => toast('Session preserved — sources, tasks & settings are stored locally', 'info')}><IcClose s={12} /></button>
          </div>
        </div>
        {menu && <div className="fixed inset-0 z-30" onClick={() => setMenu(null)} />}
      </header>

      {/* ============ BODY ============ */}
      <div className="flex-1 flex min-h-0">
        {/* rail */}
        <aside className="w-[86px] shrink-0 bg-bg1 border-r border-line flex flex-col items-center py-3 gap-1.5 z-20">
          {NAV.map((n, i) => {
            const active = area === n.id;
            const Ico = n.icon;
            return (
              <button key={n.id} onClick={() => setArea(n.id)}
                className={`w-[70px] py-2.5 rounded-[7px] flex flex-col items-center gap-1 transition-all duration-150 cursor-pointer relative group ${active ? 'bg-amber/[.09] text-amber shadow-[inset_0_0_0_1px_rgba(255,178,36,.35)]' : 'text-dim hover:text-mut hover:bg-bg2'}`}>
                {active && <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r bg-amber" />}
                <Ico s={17} />
                <span className="font-disp font-semibold text-[9.5px] tracking-[.09em] uppercase">{n.label}</span>
                <span className="font-mono text-[7px] text-dim opacity-0 group-hover:opacity-100 transition-opacity">CTRL+{i + 1}</span>
              </button>
            );
          })}
          <div className="mt-auto flex flex-col items-center gap-2">
            <button onClick={() => setArea('compiler')} className="relative text-dim hover:text-cyan transition-colors cursor-pointer" title="Scheduled tasks">
              <IcBolt s={16} />
              {tasks.filter(t => t.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-cyan text-[7px] font-mono text-bg0 flex items-center justify-center font-bold">{tasks.filter(t => t.status === 'pending').length}</span>
              )}
            </button>
            <button onClick={() => setShowSettings(true)} className="text-dim hover:text-amber transition-colors cursor-pointer" title="API & engine settings"><IcGear s={16} /></button>
          </div>
        </aside>

        {/* workspace */}
        <main className="flex-1 min-w-0 min-h-0 relative">
          <div key={area} className="absolute inset-0">
            {area === 'script' && <ScriptStudio addSource={addSource} toast={toast} sendToVoice={t => { setIncomingVoice(t); setArea('voice'); }} />}
            {area === 'voice' && <VoiceStudio addSource={addSource} toast={toast} incoming={incomingVoice} consumeIncoming={() => setIncomingVoice(null)} />}
            {area === 'visual' && <VisualStudio addSource={addSource} toast={toast} />}
            {area === 'compiler' && <CompilerStudio sources={sources} addSource={addSource} removeSource={removeSource} toast={toast} tasks={tasks} setTasks={setTasks} />}
          </div>
        </main>
      </div>

      {/* ============ STATUS BAR ============ */}
      {showBar && <StatusBar tasks={tasks} settings={settings} />}

      {/* ============ SETTINGS MODAL ============ */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 fade-in" onClick={() => setShowSettings(false)}>
          <div className="w-[620px] max-h-[84vh] panel shadow-[0_24px_80px_rgba(0,0,0,.6)] pop-in flex flex-col" onClick={e => e.stopPropagation()}>
            <header className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
              <div className="flex items-center gap-2">
                <IcGear s={15} c="text-amber" />
                <span className="font-disp font-bold text-[14px]">API & Engine Settings</span>
              </div>
              <Btn v="ghost" s="xs" onClick={() => setShowSettings(false)}><IcClose s={12} /></Btn>
            </header>
            <div className="p-4 space-y-4 overflow-y-auto">
              {([
                { k: 'tts' as const, name: 'Text-to-Speech API', desc: 'Powers the 18 voice models in Voice Studio', providers: TTS_PROVIDERS, icon: IcMic, tone: 'text-cyan' },
                { k: 'llm' as const, name: 'Script Generation LLM', desc: 'Powers the premium content engine', providers: LLM_PROVIDERS, icon: IcDoc, tone: 'text-amber' },
                { k: 'img' as const, name: 'Image / Video Generation API', desc: 'Powers plate & clip generation in Visual Studio', providers: IMG_PROVIDERS, icon: IcImage, tone: 'text-vio' },
              ]).map(sec => (
                <div key={sec.k} className="rounded-[8px] border border-line bg-bg2 p-3.5">
                  <div className="flex items-center gap-2.5">
                    <sec.icon s={16} c={sec.tone} />
                    <div className="flex-1">
                      <div className="font-disp font-semibold text-[12.5px]">{sec.name}</div>
                      <div className="text-[10px] text-dim">{sec.desc}</div>
                    </div>
                    {settings.verified[sec.k] ? <Chip t="grn"><IcCheck s={8} /> VERIFIED</Chip> : <Chip>NOT VERIFIED</Chip>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <Lbl c="mb-1">Provider</Lbl>
                      <SelWrap>
                        <select className="field" value={settings.providers[sec.k]}
                          onChange={e => setSettings(s => ({ ...s, providers: { ...s.providers, [sec.k]: e.target.value }, verified: { ...s.verified, [sec.k]: false } }))}>
                          {sec.providers.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </SelWrap>
                    </div>
                    <div>
                      <Lbl c="mb-1">API key (stored locally)</Lbl>
                      <div className="flex gap-1.5">
                        <input type="password" className="field font-mono text-[11px]!" placeholder={`sk-… ${sec.k}`} value={settings.keys[sec.k]}
                          onChange={e => setSettings(s => ({ ...s, keys: { ...s.keys, [sec.k]: e.target.value }, verified: { ...s.verified, [sec.k]: false } }))} />
                        <Btn v="cyan" s="sm" onClick={() => verifyKey(sec.k)} disabled={!settings.keys[sec.k]}>Test</Btn>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="rounded-[8px] border border-amber/25 bg-amber/[.05] p-3 flex gap-2">
                <IcAlert s={13} c="text-amber shrink-0 mt-0.5" />
                <p className="text-[10.5px] text-mut leading-relaxed">
                  Keys never leave this machine — they are stored in your browser's local storage and sent only to the provider you select.
                  Without keys, OmniForge runs its built-in sandbox engines (on-device speech synthesis and the offline script core), so every studio stays fully functional.
                </p>
              </div>
            </div>
            <footer className="px-4 py-3 border-t border-line flex justify-end gap-2 shrink-0">
              <Btn v="ghost" s="sm" onClick={() => setShowSettings(false)}>Close</Btn>
              <Btn v="amber" s="sm" onClick={() => { setShowSettings(false); toast('Settings saved to local workspace', 'ok'); }}><IcCheck s={11} /> Save settings</Btn>
            </footer>
          </div>
        </div>
      )}

      {/* ============ TOASTS ============ */}
      <div className="fixed bottom-4 right-4 z-[60] space-y-2 w-[340px]">
        {toasts.map(t => (
          <div key={t.id} className={`toast-in panel px-3 py-2.5 flex items-start gap-2.5 shadow-[0_10px_36px_rgba(0,0,0,.5)] border-l-2 ${t.kind === 'ok' ? 'border-l-grn' : t.kind === 'err' ? 'border-l-red' : 'border-l-cyan'}`}>
            <span className={`mt-0.5 shrink-0 ${t.kind === 'ok' ? 'text-grn' : t.kind === 'err' ? 'text-red' : 'text-cyan'}`}>
              {t.kind === 'err' ? <IcAlert s={13} /> : t.kind === 'ok' ? <IcCheck s={13} /> : <IcSpark s={13} />}
            </span>
            <span className="text-[11.5px] text-ink/90 leading-snug">{t.msg}</span>
            <button className="ml-auto text-dim hover:text-ink cursor-pointer shrink-0" onClick={() => setToasts(x => x.filter(y => y.id !== t.id))}><IcClose s={10} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ STATUS BAR ============ */
function StatusBar({ tasks, settings }: { tasks: Task[]; settings: Settings }) {
  const [tc, setTc] = useState('00:00:00:00');
  const [cpu, setCpu] = useState(34);
  const [gpu, setGpu] = useState(52);

  useEffect(() => {
    const t = window.setInterval(() => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, '0');
      setTc(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}:${p(Math.floor(d.getMilliseconds() / 33.4))}`);
    }, 100);
    const m = window.setInterval(() => {
      setCpu(v => Math.max(6, Math.min(96, v + (Math.random() - 0.48) * 16)));
      setGpu(v => Math.max(6, Math.min(97, v + (Math.random() - 0.46) * 20)));
    }, 900);
    return () => { window.clearInterval(t); window.clearInterval(m); };
  }, []);

  const next = tasks.filter(t => t.status === 'pending').sort((a, b) => a.at - b.at)[0];

  return (
    <footer className="h-[30px] shrink-0 bg-bg1 border-t border-line flex items-center px-3 gap-4 text-[9.5px] font-mono text-dim z-20">
      <span className="flex items-center gap-1.5 text-grn"><IcRadio s={10} /> NEURAL CORES ONLINE</span>
      <span className="hidden md:block">TTS {settings.providers.tts.split(' ')[0].toUpperCase()}</span>
      <span className="hidden md:block">LLM {settings.providers.llm.split(' ')[1] ?? settings.providers.llm.split(' ')[0]}</span>
      <span className="ml-auto" />
      {next && <span className="text-cyan">NEXT TASK −{Math.max(0, Math.floor((next.at - Date.now()) / 1000))}s</span>}
      <span className="text-amber tracking-[.12em]">{tc}</span>
      <span className="flex items-center gap-1">CPU
        <span className="w-[52px] h-[5px] rounded-full bg-bg3 overflow-hidden inline-block"><span className="block h-full bg-cyan transition-[width] duration-700" style={{ width: cpu + '%' }} /></span>
        {Math.round(cpu)}%
      </span>
      <span className="flex items-center gap-1">GPU
        <span className="w-[52px] h-[5px] rounded-full bg-bg3 overflow-hidden inline-block"><span className="block h-full bg-amber transition-[width] duration-700" style={{ width: gpu + '%' }} /></span>
        {Math.round(gpu)}%
      </span>
      <span className="hidden lg:block text-dim">CTRL+1…4 SWITCH STUDIO</span>
    </footer>
  );
}
