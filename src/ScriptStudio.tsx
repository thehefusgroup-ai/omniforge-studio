import { useState } from 'react';
import {
  SEG_META, SEG_ORDER, PERSONAS, TRENDING, generateScript, scriptToText, fmtDur,
  type Segment, type SegType, type GenResult, type GenMode,
} from './generator';
import {
  Btn, Lbl, Panel, Chip, Range, Seg, SelWrap, Empty, Spinner, uid,
  IcTarget, IcSpark, IcDice, IcPlus, IcTrash, IcUp, IcDn, IcCopy, IcSend, IcRefresh, IcDoc, IcCheck, IcBolt,
} from './ui';

const PRESETS: { label: string; types: SegType[] }[] = [
  { label: 'REEL · 3 BEATS', types: ['hook', 'value', 'cta'] },
  { label: 'STANDARD · 6', types: ['hook', 'intro', 'value', 'story', 'cta', 'outro'] },
  { label: 'LONGFORM · 9', types: ['hook', 'intro', 'value', 'value', 'story', 'demo', 'engage', 'cta', 'outro'] },
];

export default function ScriptStudio({ addSource, toast, sendToVoice }: {
  addSource: (s: { kind: string; name: string; meta: string; duration: number }) => void;
  toast: (msg: string, kind?: 'ok' | 'info' | 'err') => void;
  sendToVoice: (text: string) => void;
}) {
  const [mode, setMode] = useState<GenMode>('exact');
  const [topic, setTopic] = useState('AI side hustles');
  const [durationSec, setDurationSec] = useState(60);
  const [words, setWords] = useState(158);
  const [wordsTouched, setWordsTouched] = useState(false);
  const [personaId, setPersonaId] = useState('');
  const [segments, setSegments] = useState<Segment[]>(
    PRESETS[1].types.map(type => ({ id: uid(), type, note: '' }))
  );
  const [addType, setAddType] = useState<SegType>('value');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<GenResult | null>(null);
  const [titleIdx, setTitleIdx] = useState(0);
  const [history, setHistory] = useState<GenResult[]>([]);

  const persona = PERSONAS.find(p => p.id === personaId) ?? null;

  const setDuration = (s: number) => {
    setDurationSec(s);
    if (!wordsTouched) setWords(Math.round(s * 2.6));
  };

  const generate = () => {
    setBusy(true);
    window.setTimeout(() => {
      const r = generateScript({ topic, mode, durationSec, targetWords: words, segments, personaId: personaId || null });
      setResult(r); setTitleIdx(0);
      setHistory(h => [r, ...h].slice(0, 8));
      setBusy(false);
      toast(`Script generated — ${r.words} words across ${r.sections.length} segments`, 'ok');
    }, 1100);
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard?.writeText(scriptToText({ ...result, titles: [result.titles[titleIdx], ...result.titles.filter((_, i) => i !== titleIdx)] }))
      .then(() => toast('Full script copied to clipboard', 'ok'))
      .catch(() => toast('Clipboard unavailable', 'err'));
  };

  const save = () => {
    if (!result) return;
    addSource({
      kind: 'script', name: result.titles[titleIdx],
      meta: `${result.words} words · ${fmtDur(result.seconds)} · ${persona?.name ?? 'brand-neutral'}`,
      duration: result.seconds,
    });
    toast('Script saved to Media Library', 'ok');
  };

  const move = (id: string, dir: -1 | 1) => setSegments(s => {
    const i = s.findIndex(x => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= s.length) return s;
    const n = [...s]; [n[i], n[j]] = [n[j], n[i]]; return n;
  });

  return (
    <div className="h-full flex flex-col gap-3 p-3 min-h-0 area-enter">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-disp font-bold text-[19px] leading-tight tracking-tight">Content Script Generator</h1>
          <div className="text-[11px] text-dim mt-0.5">API-driven premium scripts · tuned for Facebook, Instagram, TikTok & YouTube retention curves</div>
        </div>
        <div className="flex items-center gap-2">
          <Chip t="cyan"><IcSpark s={10} /> LLM CORE · GPT-4o CLASS</Chip>
          <Chip t="amber">RETENTION-TUNED</Chip>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[300px_1fr_280px] gap-3 min-h-0">
        {/* ---------- brief ---------- */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto pr-0.5">
          <Panel title="GENERATION MODE">
            <Seg
              opts={[
                { v: 'exact' as GenMode, label: <><IcTarget s={11} /> Only Topic</>, title: 'Generate strictly on your topic/niche' },
                { v: 'related' as GenMode, label: <><IcSpark s={11} /> Related</>, title: 'Pivot to a popular related topic/niche' },
                { v: 'dice' as GenMode, label: <><IcDice s={11} /> Roll Dice</>, title: 'Discovery — random trending topic' },
              ]}
              value={mode} onChange={setMode} />
            <p className="text-[10.5px] text-dim leading-relaxed mt-2">
              {mode === 'exact' && 'Engine locks onto your exact topic/niche and builds every segment around it.'}
              {mode === 'related' && 'Engine finds a proven popular angle adjacent to your topic/niche.'}
              {mode === 'dice' && 'Discovery mode — engine rolls a random topic from the live trending pool.'}
            </p>
            <Lbl c="mt-3 mb-1">Topic / Niche</Lbl>
            <div className="flex gap-1.5">
              <input className="field" value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="e.g. budget travel hacks" disabled={mode === 'dice'} />
              <Btn v="dark" s="sm" title="Random trending topic"
                onClick={() => { setTopic(TRENDING[Math.floor(Math.random() * TRENDING.length)].topic); toast('Topic rolled from trending pool', 'info'); }}>
                <IcDice s={12} />
              </Btn>
            </div>
          </Panel>

          <Panel title="LENGTH & DENSITY">
            <Range label="Target duration" value={durationSec} min={15} max={600} step={5} onChange={setDuration} fmt={n => fmtDur(n)} />
            <div className="mt-3">
              <Lbl c="mb-1">Word count target</Lbl>
              <input type="number" className="field font-mono" value={words} min={30} max={2000}
                onChange={e => { setWordsTouched(true); setWords(Number(e.target.value) || 0); }} />
              <div className="text-[9.5px] font-mono text-dim mt-1">≈ 158 wpm narration pace · auto-syncs with duration until edited</div>
            </div>
          </Panel>

          <Panel title="IN THE STYLE OF" right={persona ? <Chip t="vio">{persona.kind === 'real' ? 'REAL' : 'FICTION'}</Chip> : <Chip>NEUTRAL</Chip>}>
            <SelWrap>
              <select className="field" value={personaId} onChange={e => setPersonaId(e.target.value)}>
                <option value="">— No persona (brand-neutral) —</option>
                <optgroup label="Real entertainers & celebrities">
                  {PERSONAS.filter(p => p.kind === 'real').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </optgroup>
                <optgroup label="Fictional personas">
                  {PERSONAS.filter(p => p.kind === 'fictional').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </optgroup>
              </select>
            </SelWrap>
            <p className="text-[10.5px] text-dim leading-relaxed mt-2 min-h-[30px]">
              {persona ? persona.vibe + '.' : 'Pick a famous entertainer or celebrity — the engine mimics their character, cadence and catchphrases.'}
            </p>
          </Panel>

          <Btn v="amber" s="lg" className="w-full shrink-0" onClick={generate} disabled={busy || segments.length === 0}>
            {busy ? <Spinner s={14} /> : <IcBolt s={14} />}
            {busy ? 'Generating premium content…' : 'Generate Script'}
          </Btn>
        </div>

        {/* ---------- structure + output ---------- */}
        <div className="flex flex-col gap-3 min-h-0">
          <Panel title={`CONTENT STRUCTURE · ${segments.length} SEGMENTS`} c="shrink-0"
            right={
              <div className="flex gap-1">
                {PRESETS.map(p => (
                  <button key={p.label} onClick={() => { setSegments(p.types.map(t => ({ id: uid(), type: t, note: '' }))); toast(`Structure preset applied: ${p.label.toLowerCase()}`, 'info'); }}
                    className="px-1.5 py-0.5 rounded-[4px] border border-line text-[9px] font-mono text-dim hover:text-amber hover:border-amber/40 transition-colors cursor-pointer">
                    {p.label}
                  </button>
                ))}
              </div>
            }>
            <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
              {segments.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1.5 group pop-in">
                  <span className="font-mono text-[9px] text-dim w-4 text-right shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <SelWrap>
                    <select className="field w-[130px]! py-1.5! text-[11px]!" value={s.type}
                      onChange={e => setSegments(x => x.map(y => y.id === s.id ? { ...y, type: e.target.value as SegType } : y))}>
                      {SEG_ORDER.map(t => <option key={t} value={t}>{SEG_META[t].label}</option>)}
                    </select>
                  </SelWrap>
                  <input className="field py-1.5! text-[11px]!" placeholder={`Function: ${SEG_META[s.type].hint}`} value={s.note}
                    onChange={e => setSegments(x => x.map(y => y.id === s.id ? { ...y, note: e.target.value } : y))} />
                  <div className="flex shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                    <Btn v="ghost" s="xs" onClick={() => move(s.id, -1)} disabled={i === 0}><IcUp s={10} /></Btn>
                    <Btn v="ghost" s="xs" onClick={() => move(s.id, 1)} disabled={i === segments.length - 1}><IcDn s={10} /></Btn>
                    <Btn v="ghost" s="xs" className="text-red!" onClick={() => setSegments(x => x.filter(y => y.id !== s.id))}><IcTrash s={10} /></Btn>
                  </div>
                </div>
              ))}
              {segments.length === 0 && <div className="text-[11px] text-dim text-center py-3">No segments — add one below or apply a preset.</div>}
            </div>
            <div className="flex gap-1.5 mt-2 pt-2 border-t border-line">
              <SelWrap>
                <select className="field w-[150px]! py-1.5! text-[11px]!" value={addType} onChange={e => setAddType(e.target.value as SegType)}>
                  {SEG_ORDER.map(t => <option key={t} value={t}>{SEG_META[t].label}</option>)}
                </select>
              </SelWrap>
              <Btn v="dark" s="sm" onClick={() => { setSegments(x => [...x, { id: uid(), type: addType, note: '' }]); }}><IcPlus s={11} /> Add segment</Btn>
              <span className="ml-auto self-center font-mono text-[9px] text-dim">each segment carries its own description / function</span>
            </div>
          </Panel>

          <Panel title="GENERATED SCRIPT" c="flex-1 min-h-0" pad={false}
            right={result && (
              <div className="flex items-center gap-1.5">
                <Chip t="amber">{result.words} W</Chip>
                <Chip t="cyan">{fmtDur(result.seconds)}</Chip>
                {persona && <Chip t="vio">{persona.name.toUpperCase()}</Chip>}
              </div>
            )}>
            {!result ? (
              <Empty icon={<IcDoc s={26} />} title="No script yet"
                sub="Set the brief, shape the segments, optionally pick a persona — then hit Generate Script." />
            ) : (
              <div className="h-full flex flex-col">
                <div className="p-3 border-b border-line shrink-0">
                  <Lbl c="mb-1.5">Title candidates — click to select</Lbl>
                  <div className="flex gap-1.5 flex-wrap">
                    {result.titles.map((t, i) => (
                      <button key={t} onClick={() => setTitleIdx(i)}
                        className={`px-2 py-1 rounded-[5px] border text-[11px] font-medium transition-all cursor-pointer ${i === titleIdx ? 'border-amber/60 bg-amber/10 text-amber' : 'border-line text-mut hover:border-line2 hover:text-ink'}`}>
                        {i === titleIdx && <IcCheck s={9} c="inline mr-1 -mt-0.5" />}{t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {result.sections.map((s, i) => (
                    <div key={i} className="pop-in" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9.5px] tracking-[.12em] text-amber font-semibold">{s.heading}</span>
                        <span className="h-px flex-1 bg-line" />
                        <span className="font-mono text-[9px] text-dim">{s.words}w · {s.sec}s</span>
                      </div>
                      {s.note && <div className="text-[10px] text-cyan italic mt-1">Director's note: {s.note}</div>}
                      <p className="text-[12.5px] leading-relaxed text-ink/90 mt-1">{s.lines.join(' ')}</p>
                    </div>
                  ))}
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {result.hashtags.map(h => <Chip key={h} t="cyan">{h}</Chip>)}
                  </div>
                  <div className="rounded-[6px] bg-bg0 border border-line p-2.5 mt-1">
                    <Lbl c="mb-1">Engine notes</Lbl>
                    {result.notes.map((n, i) => <div key={i} className="text-[10px] text-dim font-mono leading-relaxed">▸ {n}</div>)}
                  </div>
                </div>
                <div className="p-2.5 border-t border-line flex gap-1.5 shrink-0">
                  <Btn v="dark" s="sm" onClick={copy}><IcCopy s={11} /> Copy</Btn>
                  <Btn v="cyan" s="sm" onClick={() => { sendToVoice(scriptToText(result)); }}><IcSend s={11} /> Send to Voice Studio</Btn>
                  <Btn v="grn" s="sm" onClick={save}>Save to Library</Btn>
                  <Btn v="ghost" s="sm" className="ml-auto" onClick={generate}><IcRefresh s={11} /> Regenerate</Btn>
                </div>
              </div>
            )}
          </Panel>
        </div>

        {/* ---------- right rail ---------- */}
        <div className="flex flex-col gap-3 min-h-0">
          <Panel title="SESSION HISTORY" c="flex-1 min-h-0" pad={false}>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {history.length === 0 && <Empty icon={<IcDoc s={20} />} title="Nothing generated yet" />}
              {history.map(r => (
                <button key={r.id} onClick={() => { setResult(r); setTitleIdx(0); }}
                  className={`w-full text-left rounded-[6px] border p-2 transition-all cursor-pointer ${result?.id === r.id ? 'border-amber/50 bg-amber/[.05]' : 'border-line bg-bg2 hover:border-line2'}`}>
                  <div className="text-[11px] font-medium text-ink leading-snug">{r.titles[0]}</div>
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    <Chip t="amber">{r.words}w</Chip>
                    <Chip t="cyan">{fmtDur(r.seconds)}</Chip>
                    {r.personaId && <Chip t="vio">{PERSONAS.find(p => p.id === r.personaId)?.name}</Chip>}
                    <span className="ml-auto font-mono text-[8.5px] text-dim">{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="TRENDING POOL · LIVE" c="shrink-0">
            <div className="flex flex-wrap gap-1">
              {TRENDING.slice(0, 12).map(t => (
                <button key={t.topic} onClick={() => { setTopic(t.topic); setMode('related'); toast(`Angle engine armed for "${t.topic}"`, 'info'); }}
                  className="px-1.5 py-1 rounded-[4px] border border-line bg-bg2 text-[10px] text-mut hover:text-cyan hover:border-cyan/40 transition-colors cursor-pointer">
                  {t.topic}
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
