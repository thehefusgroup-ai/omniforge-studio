import { useEffect, useMemo, useRef, useState } from 'react';
import { VOICES, VOICE_STYLES, VOICE_EMOTIONS, type VoiceModel } from './voices';
import {
  Btn, Lbl, Panel, Chip, Range, Seg, SelWrap, Empty, Bar,
  IcPlay, IcStop, IcWave, IcTrash, IcCheck, IcSpark, IcSend, IcRefresh, Spinner, IcSearch,
} from './ui';

export interface Take {
  id: string; voiceId: string; voiceName: string; chars: number; secs: number;
  style: string; emotion: string; at: number; text: string;
}

const hash = (s: string) => s.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const estSecs = (chars: number, rate: number) => Math.max(2, Math.round(chars / 15 / rate));

export default function VoiceStudio({ addSource, toast, incoming, consumeIncoming }: {
  addSource: (s: { kind: string; name: string; meta: string; duration: number }) => void;
  toast: (msg: string, kind?: 'ok' | 'info' | 'err') => void;
  incoming: string | null;
  consumeIncoming: () => void;
}) {
  const [gender, setGender] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [q, setQ] = useState('');
  const [voiceId, setVoiceId] = useState('m1');
  const [text, setText] = useState(
    "Welcome to OmniForge Studio — the all-in-one media creation suite. Paste your script here, pick a voice model, and render studio-grade narration in seconds. Let's make something people can't stop watching."
  );
  const [rateMul, setRateMul] = useState(1);
  const [pitchMul, setPitchMul] = useState(1);
  const [stability, setStability] = useState(72);
  const [clarity, setClarity] = useState(80);
  const [style, setStyle] = useState('Conversational');
  const [emotion, setEmotion] = useState('None');
  const [speaking, setSpeaking] = useState<null | 'preview' | 'render'>(null);
  const [takes, setTakes] = useState<Take[]>([]);
  const [queuePct, setQueuePct] = useState(0);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const qTimer = useRef<number | null>(null);

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  useEffect(() => {
    if (!synth) return;
    const load = () => { voicesRef.current = synth.getVoices(); };
    load();
    synth.addEventListener?.('voiceschanged', load);
    return () => { synth.cancel(); if (qTimer.current) window.clearInterval(qTimer.current); };
  }, [synth]);

  useEffect(() => {
    if (incoming) {
      setText(incoming);
      toast('Script loaded into voice synth from Script Studio', 'info');
      consumeIncoming();
    }
  }, [incoming, consumeIncoming, toast]);

  const model = VOICES.find(v => v.id === voiceId) ?? VOICES[0];

  const speak = (txt: string, m: VoiceModel, onEnd?: () => void) => {
    if (!synth) { toast('Speech engine unavailable in this browser', 'err'); onEnd?.(); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    const list = voicesRef.current;
    if (list.length) u.voice = list[hash(m.id) % list.length];
    u.pitch = clamp(m.pitch * pitchMul, 0.1, 2);
    u.rate = clamp(m.rate * rateMul, 0.1, 4);
    u.onend = () => { setSpeaking(null); onEnd?.(); };
    u.onerror = () => { setSpeaking(null); onEnd?.(); };
    setSpeaking(txt.length > 90 ? 'render' : 'preview');
    synth.speak(u);
  };

  const stop = () => { synth?.cancel(); setSpeaking(null); if (qTimer.current) window.clearInterval(qTimer.current); setQueuePct(0); };

  const renderTake = () => {
    if (!text.trim()) { toast('Script is empty — nothing to render', 'err'); return; }
    setQueuePct(4);
    if (qTimer.current) window.clearInterval(qTimer.current);
    qTimer.current = window.setInterval(() => setQueuePct(p => Math.min(96, p + Math.random() * 9)), 220);
    speak(text, model, () => {
      if (qTimer.current) window.clearInterval(qTimer.current);
      setQueuePct(100);
      const chars = text.trim().length;
      const secs = estSecs(chars, model.rate * rateMul);
      const take: Take = {
        id: Math.random().toString(36).slice(2, 9), voiceId: model.id, voiceName: model.name,
        chars, secs, style, emotion, at: Date.now(), text: text.trim(),
      };
      setTakes(t => [take, ...t]);
      addSource({ kind: 'voice', name: `VO Take — ${model.name} (${style})`, meta: `${chars} chars · ${secs}s · ${emotion !== 'None' ? emotion : 'neutral'} delivery`, duration: secs });
      toast(`Take rendered with ${model.name} — sent to Media Library`, 'ok');
      window.setTimeout(() => setQueuePct(0), 900);
    });
  };

  const filtered = VOICES.filter(v =>
    (gender === 'ALL' || v.gender === gender) &&
    (v.name.toLowerCase().includes(q.toLowerCase()) || v.tags.join(' ').toLowerCase().includes(q.toLowerCase()))
  );

  const bars = useMemo(() => Array.from({ length: 44 }, (_, i) => 22 + ((hash(model.id + i) * 37) % 74)), [model.id]);

  return (
    <div className="h-full flex flex-col gap-3 p-3 min-h-0 area-enter">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-disp font-bold text-[19px] leading-tight tracking-tight">Voice Synthesis</h1>
          <div className="text-[11px] text-dim mt-0.5">API text-to-speech · NeuralForge 3.2 engine · 18 production models</div>
        </div>
        <div className="flex items-center gap-2">
          <Chip t="cyan"><IcSpark s={10} /> NEURAL TTS v3.2</Chip>
          <Chip t="grn"><span className="w-1.5 h-1.5 rounded-full bg-grn live-dot" /> ENGINE ONLINE</Chip>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[300px_1fr_280px] gap-3 min-h-0">
        {/* ---------- voice library ---------- */}
        <Panel title={`VOICE MODELS · ${filtered.length}`} c="min-h-0" pad={false}
          right={
            <Seg opts={[{ v: 'ALL' as const, label: 'ALL' }, { v: 'M' as const, label: '♂ 9' }, { v: 'F' as const, label: '♀ 9' }]}
              value={gender} onChange={setGender} c="p-[2px]!" />
          }>
          <div className="p-2 border-b border-line shrink-0">
            <div className="relative">
              <input className="field pl-7!" placeholder="Search models or tags…" value={q} onChange={e => setQ(e.target.value)} />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dim"><IcSearch s={12} /></span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filtered.map(v => {
              const active = v.id === voiceId;
              return (
                <button key={v.id} onClick={() => setVoiceId(v.id)}
                  className={`w-full text-left rounded-[6px] border p-2.5 transition-all duration-150 cursor-pointer group ${active ? 'border-amber/60 bg-amber/[.06] shadow-[0_0_0_1px_rgba(255,178,36,.2)]' : 'border-line bg-bg2 hover:border-line2 hover:bg-bg3'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-7 h-7 rounded-[5px] flex items-center justify-center font-disp font-bold text-[11px] shrink-0 ${v.gender === 'M' ? 'bg-cyan/12 text-cyan border border-cyan/25' : 'bg-amber/12 text-amber border border-amber/25'}`}>
                        {v.name.slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <div className={`font-disp font-semibold text-[12px] tracking-wide ${active ? 'text-amber' : 'text-ink'}`}>{v.name}</div>
                        <div className="font-mono text-[9px] text-dim">{v.code} · {v.accent}</div>
                      </div>
                    </div>
                    {active && <span className="text-amber shrink-0"><IcCheck s={13} /></span>}
                  </div>
                  <p className="text-[10.5px] text-mut leading-snug mt-1.5">{v.desc}</p>
                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    {v.tags.map(t => <Chip key={t} t={v.gender === 'M' ? 'cyan' : 'amber'}>{t}</Chip>)}
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9.5px] font-mono text-cyan"
                      onClick={e => { e.stopPropagation(); speak(v.sample, v); }}>
                      <IcPlay s={9} /> SAMPLE
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        {/* ---------- center: script + settings + transport ---------- */}
        <div className="flex flex-col gap-3 min-h-0 min-w-0">
          <Panel title="SCRIPT / NARRATION INPUT" c="shrink-0"
            right={
              <div className="flex items-center gap-2">
                <button className="text-[10px] font-mono text-dim hover:text-cyan transition-colors cursor-pointer"
                  onClick={() => { setText(t => t + ' <break time="0.5s"/> '); toast('SSML pause marker inserted', 'info'); }}>+ PAUSE 0.5s</button>
                <button className="text-[10px] font-mono text-dim hover:text-cyan transition-colors cursor-pointer"
                  onClick={() => { setText(t => t + ' <emphasis level="strong">key point</emphasis> '); toast('SSML emphasis inserted', 'info'); }}>+ EMPHASIS</button>
              </div>
            }>
            <textarea className="field text-[12.5px]! h-[130px]" value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste the narration to synthesize…" />
            <div className="flex items-center justify-between mt-1.5">
              <span className="font-mono text-[9.5px] text-dim">{text.length} chars · ~{estSecs(text.length, model.rate * rateMul)}s at current speed</span>
              <span className="font-mono text-[9.5px] text-dim">SSML supported · <span className="text-cyan">{model.feats[0]}</span></span>
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <Panel title="DELIVERY PARAMETERS">
              <div className="space-y-3">
                <Range label="Speed" value={rateMul} min={0.5} max={2} step={0.05} onChange={setRateMul} fmt={n => n.toFixed(2) + '×'} />
                <Range label="Pitch" value={pitchMul} min={0.5} max={2} step={0.05} onChange={setPitchMul} fmt={n => n.toFixed(2) + '×'} cy />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Lbl c="mb-1">Speaking style</Lbl>
                    <SelWrap><select className="field" value={style} onChange={e => setStyle(e.target.value)}>{VOICE_STYLES.map(s => <option key={s}>{s}</option>)}</select></SelWrap>
                  </div>
                  <div>
                    <Lbl c="mb-1">Emotion <span className="text-cyan normal-case">(new)</span></Lbl>
                    <SelWrap><select className="field" value={emotion} onChange={e => setEmotion(e.target.value)}>{VOICE_EMOTIONS.map(s => <option key={s}>{s}</option>)}</select></SelWrap>
                  </div>
                </div>
              </div>
            </Panel>
            <Panel title="ENGINE QUALITY">
              <div className="space-y-3">
                <Range label="Stability" value={stability} min={0} max={100} onChange={setStability} fmt={n => n + '%'} />
                <Range label="Clarity + Similarity" value={clarity} min={0} max={100} onChange={setClarity} fmt={n => n + '%'} cy />
                <div className="flex items-center justify-between pt-0.5">
                  <Lbl>Model capabilities</Lbl>
                </div>
                <div className="flex gap-1 flex-wrap -mt-1">
                  {model.feats.map(f => <Chip key={f} t="vio">{f}</Chip>)}
                </div>
              </div>
            </Panel>
          </div>

          <Panel title="RENDER MONITOR" c="flex-1 min-h-0">
            <div className="flex items-center gap-2">
              <Btn v="cyan" s="sm" onClick={() => speak(text.split(/[.!?\n]/)[0] || text, model)} disabled={!!speaking}>
                <IcPlay s={11} /> Preview line
              </Btn>
              <Btn v="amber" s="md" className="flex-1" onClick={renderTake} disabled={!!speaking}>
                {speaking === 'render' ? <Spinner s={13} /> : <IcWave s={13} />}
                {speaking === 'render' ? 'Rendering take…' : 'Render full take'}
              </Btn>
              <Btn v="danger" s="md" onClick={stop} disabled={!speaking}><IcStop s={12} /> Stop</Btn>
            </div>

            <div className="mt-3 h-[72px] rounded-[6px] bg-bg0 border border-line flex items-center gap-[3px] px-3 overflow-hidden">
              {bars.map((h, i) => (
                <span key={i}
                  className={`flex-1 rounded-full ${speaking ? 'wv-bar bg-amber' : 'bg-bg4'}`}
                  style={{ height: `${h}%`, animationDelay: `${(i % 11) * 0.05}s`, animationDuration: `${0.35 + (i % 5) * 0.09}s` }} />
              ))}
            </div>

            <div className="flex items-center justify-between mt-2.5">
              <div className="font-mono text-[10px] text-dim">
                {speaking
                  ? <span className="text-amber flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red rec-dot" /> {speaking === 'render' ? 'STREAMING TO ENGINE…' : 'PREVIEW PLAYBACK…'}</span>
                  : <span>IDLE · {model.name} armed · {model.code}</span>}
              </div>
              <div className="w-[180px]"><Bar pct={queuePct} tone={queuePct >= 100 ? 'grn' : 'amber'} h={4} /></div>
            </div>
          </Panel>
        </div>

        {/* ---------- takes ---------- */}
        <Panel title={`RENDER HISTORY · ${takes.length}`} c="min-h-0" pad={false}
          right={<Chip t="amber">→ MEDIA LIBRARY</Chip>}>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {takes.length === 0 && (
              <Empty icon={<IcWave s={26} />} title="No takes rendered yet"
                sub="Render a full take and it lands here — and in the Compiler's source list automatically." />
            )}
            {takes.map((t, i) => (
              <div key={t.id} className="rounded-[6px] border border-line bg-bg2 p-2.5 pop-in">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-disp font-semibold text-[11.5px] text-ink">Take {String(takes.length - i).padStart(2, '0')} · {t.voiceName}</span>
                  <Chip t="cyan">{t.secs}s</Chip>
                </div>
                <p className="text-[10.5px] text-dim mt-1 line-clamp-2 leading-snug">{t.text}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Btn v="ghost" s="xs" onClick={() => speak(t.text, VOICES.find(v => v.id === t.voiceId) ?? model)}><IcPlay s={9} /> Replay</Btn>
                  <Btn v="ghost" s="xs" onClick={() => { setText(t.text); toast('Take script loaded', 'info'); }}><IcRefresh s={9} /> Load</Btn>
                  <Btn v="ghost" s="xs" className="ml-auto text-red!" onClick={() => setTakes(x => x.filter(y => y.id !== t.id))}><IcTrash s={9} /></Btn>
                </div>
                <div className="flex gap-1 mt-1.5">
                  <Chip>{t.style}</Chip>{t.emotion !== 'None' && <Chip t="vio">{t.emotion}</Chip>}
                  <span className="ml-auto font-mono text-[9px] text-dim self-center">{new Date(t.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-line shrink-0">
            <div className="flex items-center gap-1.5 text-[10px] text-dim"><IcSend s={10} c="text-cyan" /> Every take auto-registers as a compiler source.</div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
