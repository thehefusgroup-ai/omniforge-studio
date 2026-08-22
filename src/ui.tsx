import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

export const uid = () => Math.random().toString(36).slice(2, 10);

/* ================= ICONS (custom, stroke-based) ================= */
type IcP = { s?: number; c?: string };
const S = ({ s = 15, c = '', d, children }: IcP & { d?: string; children?: ReactNode }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={c} aria-hidden>
    {d ? <path d={d} /> : children}
  </svg>
);
export const IcScript = (p: IcP) => <S {...p}><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4" /><path d="M9 12h7M9 15.5h7M9 8.5h3" /></S>;
export const IcMic = (p: IcP) => <S {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8.5 21h7" /></S>;
export const IcFilm = (p: IcP) => <S {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 5v14M16 5v14M3 10h5M3 14h5M16 10h5M16 14h5" /></S>;
export const IcStack = (p: IcP) => <S {...p}><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5M3 17.5l9 5 9-5" opacity=".55" /></S>;
export const IcGear = (p: IcP) => <S {...p}><circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9L19 19M19 5l-2.1 2.1M7.1 16.9L5 19" /></S>;
export const IcSpark = (p: IcP) => <S {...p}><path d="M12 3l1.9 5.6L20 10l-6.1 1.4L12 17l-1.9-5.6L4 10l6.1-1.4z" /><path d="M18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" opacity=".6" /></S>;
export const IcPlay = (p: IcP) => <S {...p}><path d="M7 4.5l13 7.5-13 7.5z" fill="currentColor" stroke="none" /></S>;
export const IcPause = (p: IcP) => <S {...p}><rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" /><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" /></S>;
export const IcStop = (p: IcP) => <S {...p}><rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" stroke="none" /></S>;
export const IcPlus = (p: IcP) => <S {...p}><path d="M12 5v14M5 12h14" /></S>;
export const IcTrash = (p: IcP) => <S {...p}><path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13M10 11v5M14 11v5" /></S>;
export const IcCopy = (p: IcP) => <S {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4V4h11v1" /></S>;
export const IcCheck = (p: IcP) => <S {...p}><path d="M4.5 12.5l5 5L19.5 7" /></S>;
export const IcX = (p: IcP) => <S {...p}><path d="M6 6l12 12M18 6L6 18" /></S>;
export const IcChevD = (p: IcP) => <S {...p}><path d="M6 9l6 6 6-6" /></S>;
export const IcChevR = (p: IcP) => <S {...p}><path d="M9 6l6 6-6 6" /></S>;
export const IcDl = (p: IcP) => <S {...p}><path d="M12 3v12M7 10l5 5 5-5M4 20h16" /></S>;
export const IcSend = (p: IcP) => <S {...p}><path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" /></S>;
export const IcRefresh = (p: IcP) => <S {...p}><path d="M20 11a8 8 0 1 0-2.3 6.3M20 5v6h-6" /></S>;
export const IcDice = (p: IcP) => <S {...p}><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="9" cy="9" r="1.15" fill="currentColor" stroke="none" /><circle cx="15" cy="15" r="1.15" fill="currentColor" stroke="none" /><circle cx="15" cy="9" r="1.15" fill="currentColor" stroke="none" /><circle cx="9" cy="15" r="1.15" fill="currentColor" stroke="none" /></S>;
export const IcTarget = (p: IcP) => <S {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></S>;
export const IcShuffle = (p: IcP) => <S {...p}><path d="M16 4h4v4M20 4l-6.5 6.5M4 20l6-6M16 20h4v-4M20 20l-5-5M4 4h4l11 16" opacity="0" /><path d="M3 7h4l10 10h4M17 13l4 4-4 4M3 17h4l2.5-2.5M14 7h3M21 3l-4 4 4 4" /></S>;
export const IcLink = (p: IcP) => <S {...p}><path d="M10 14a4.5 4.5 0 0 0 6.4.4l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.6 1.6" /><path d="M14 10a4.5 4.5 0 0 0-6.4-.4l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.6-1.6" /></S>;
export const IcGlobe = (p: IcP) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 2.6 4 5.6 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.6-4-9s1.2-6.4 4-9z" /></S>;
export const IcChip = (p: IcP) => <S {...p}><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M7 2.8v2M17 2.8v2M7 19.2v2M17 19.2v2" opacity="0" /><path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3" /></S>;
export const IcClock = (p: IcP) => <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></S>;
export const IcBolt = (p: IcP) => <S {...p}><path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z" /></S>;
export const IcWave = (p: IcP) => <S {...p}><path d="M3 12h2M7 7v10M11 4v16M15 8v8M19 6v12M23 12h-2" opacity="0" /><path d="M2 12h2l2-5 3 10 3-14 3 16 3-12 2 5h4" /></S>;
export const IcScissors = (p: IcP) => <S {...p}><circle cx="6" cy="6.5" r="2.5" /><circle cx="6" cy="17.5" r="2.5" /><path d="M8.2 7.8L20 19M8.2 16.2L20 5M13.5 12.5l1.2 1.1" /></S>;
export const IcText = (p: IcP) => <S {...p}><path d="M5 6V4h14v2M12 4v16M9 20h6" /></S>;
export const IcBrush = (p: IcP) => <S {...p}><path d="M19 3l2 2-9.5 9.5-2-2z" /><path d="M8.5 13.5c-2.5 0-3.5 2-3.5 4.5-1.5 0-2.5.5-3 2 3.5.5 7-.5 8-3" /></S>;
export const IcCrop = (p: IcP) => <S {...p}><path d="M7 2v15h15M2 7h15v15" /></S>;
export const IcMove = (p: IcP) => <S {...p}><path d="M12 2v20M2 12h20M12 2L9 5M12 2l3 3M12 22l-3-3M12 22l3-3M2 12l3-3M2 12l3 3M22 12l-3-3M22 12l-3 3" /></S>;
export const IcSearch = (p: IcP) => <S {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></S>;
export const IcUp = (p: IcP) => <S {...p}><path d="M12 19V5M6 11l6-6 6 6" /></S>;
export const IcDn = (p: IcP) => <S {...p}><path d="M12 5v14M6 13l6 6 6-6" /></S>;
export const IcCal = (p: IcP) => <S {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></S>;
export const IcMusic = (p: IcP) => <S {...p}><path d="M9 18V6l11-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></S>;
export const IcImage = (p: IcP) => <S {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M3 17l5.5-5 4 4L16 12.5 21 17" /></S>;
export const IcDoc = (p: IcP) => <S {...p}><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4" /></S>;
export const IcEye = (p: IcP) => <S {...p}><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" /><circle cx="12" cy="12" r="2.8" /></S>;
export const IcAlert = (p: IcP) => <S {...p}><path d="M12 3L1.8 20.5h20.4z" /><path d="M12 10v4.5M12 17.6v.2" /></S>;
export const IcWand = (p: IcP) => <S {...p}><path d="M4 20L15.5 8.5M14 4.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9zM20 12l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6zM6.5 3l.5 1.5L8.5 5 7 5.5 6.5 7 6 5.5 4.5 5 6 4.5z" /></S>;
export const IcFolder = (p: IcP) => <S {...p}><path d="M3 6a2 2 0 0 1 2-2h4l2.5 3H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></S>;
export const IcTerm = (p: IcP) => <S {...p}><rect x="2.5" y="4" width="19" height="16" rx="2" /><path d="M6.5 9l4 3-4 3M12.5 15h5" /></S>;
export const IcRadio = (p: IcP) => <S {...p}><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" /><path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8" /></S>;
export const IcExt = (p: IcP) => <S {...p}><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></S>;
export const IcArrowL = (p: IcP) => <S {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></S>;
export const IcArrowR = (p: IcP) => <S {...p}><path d="M5 12h14M13 6l6 6-6 6" /></S>;
export const IcMin = (p: IcP) => <S {...p}><path d="M5 12h14" /></S>;
export const IcMax = (p: IcP) => <S {...p}><rect x="5" y="5" width="14" height="14" rx="1.5" /></S>;
export const IcClose = (p: IcP) => <S {...p}><path d="M6 6l12 12M18 6L6 18" /></S>;
export const IcLayers3 = (p: IcP) => <S {...p}><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="8" y="8" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /></S>;
export const IcCam = (p: IcP) => <S {...p}><rect x="2.5" y="6" width="14" height="12" rx="2" /><path d="M16.5 10.5L21.5 8v8l-5-2.5z" /></S>;
export const IcLogo = ({ s = 22 }: IcP) => (
  <svg width={s} height={s} viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="7" fill="#171c25" />
    <path d="M16 4.5l9.5 5.8v11.4L16 27.5l-9.5-5.8V10.3z" stroke="#ffb224" strokeWidth="2.3" />
    <circle cx="16" cy="16" r="3.4" fill="#3fd8cf" />
  </svg>
);

/* ================= CONTROLS ================= */
type BtnV = 'amber' | 'cyan' | 'dark' | 'ghost' | 'danger' | 'grn';
export function Btn({ v = 'dark', s = 'md', className = '', children, ...rest }:
  ButtonHTMLAttributes<HTMLButtonElement> & { v?: BtnV; s?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sz = { xs: 'px-2 py-1 text-[10.5px] gap-1', sm: 'px-2.5 py-1.5 text-[11.5px] gap-1.5', md: 'px-3.5 py-2 text-[12.5px] gap-2', lg: 'px-5 py-2.5 text-[13.5px] gap-2' }[s];
  const vr: Record<BtnV, string> = {
    amber: 'bg-amber text-[#1a1204] font-semibold hover:bg-[#ffc14d] active:translate-y-px shadow-[0_2px_12px_rgba(255,178,36,.25)] border border-transparent',
    cyan: 'bg-cyan text-[#04211f] font-semibold hover:brightness-110 active:translate-y-px border border-transparent',
    dark: 'bg-bg3 text-ink border border-line2 hover:bg-bg4 active:translate-y-px',
    ghost: 'bg-transparent text-mut border border-transparent hover:text-ink hover:bg-bg3',
    danger: 'bg-[#3a1d22] text-red border border-[#5c2b33] hover:bg-[#4a242b] active:translate-y-px',
    grn: 'bg-[#173524] text-grn border border-[#2a5c3d] hover:bg-[#1d4230] active:translate-y-px',
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-[6px] font-medium transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0 whitespace-nowrap ${sz} ${vr[v]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export const Lbl = ({ children, c = '' }: { children: ReactNode; c?: string }) => (
  <div className={`lbl ${c}`}>{children}</div>
);

export function Panel({ title, right, children, c = '', pad = true }:
  { title?: ReactNode; right?: ReactNode; children: ReactNode; c?: string; pad?: boolean }) {
  return (
    <section className={`panel flex flex-col min-h-0 ${c}`}>
      {title !== undefined && (
        <header className="flex items-center justify-between gap-2 px-3 py-2 border-b border-line shrink-0">
          <div className="lbl text-[10px]! text-mut!">{title}</div>
          {right}
        </header>
      )}
      <div className={`${pad ? 'p-3' : ''} min-h-0 flex-1`}>{children}</div>
    </section>
  );
}

const tones = {
  amber: 'text-amber bg-amber/10 border-amber/25',
  cyan: 'text-cyan bg-cyan/10 border-cyan/25',
  red: 'text-red bg-red/10 border-red/25',
  grn: 'text-grn bg-grn/10 border-grn/25',
  vio: 'text-vio bg-vio/10 border-vio/25',
  mut: 'text-mut bg-bg3 border-line2',
};
export type Tone = keyof typeof tones;
export const Chip = ({ t = 'mut', children, c = '' }: { t?: Tone; children: ReactNode; c?: string }) => (
  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border text-[10px] font-mono tracking-wide whitespace-nowrap ${tones[t]} ${c}`}>{children}</span>
);

export function Range({ label, value, min, max, step = 1, onChange, fmt, cy }:
  { label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void; fmt?: (n: number) => string; cy?: boolean }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-mut">{label}</span>
        <span className="font-mono text-[10.5px] text-amber">{fmt ? fmt(value) : value}</span>
      </div>
      <input type="range" className={cy ? 'cy' : ''} style={{ '--fill': pct + '%' } as CSSProperties}
        min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (b: boolean) => void; label?: string }) {
  return (
    <button onClick={() => onChange(!on)} className="flex items-center gap-2 cursor-pointer group">
      <span className={`w-8 h-[17px] rounded-full relative transition-colors duration-200 border ${on ? 'bg-amber/90 border-amber' : 'bg-bg3 border-line2'}`}>
        <span className={`absolute top-[2px] w-[11px] h-[11px] rounded-full bg-bg0 transition-all duration-200 ${on ? 'left-[17px]' : 'left-[2px] bg-dim'}`} />
      </span>
      {label && <span className={`text-[11px] transition-colors ${on ? 'text-ink' : 'text-dim group-hover:text-mut'}`}>{label}</span>}
    </button>
  );
}

export function Seg<T extends string>({ opts, value, onChange, c = '' }:
  { opts: { v: T; label: ReactNode; title?: string }[]; value: T; onChange: (v: T) => void; c?: string }) {
  return (
    <div className={`flex bg-bg1 border border-line rounded-[6px] p-[3px] gap-[3px] ${c}`}>
      {opts.map(o => (
        <button key={o.v} title={o.title} onClick={() => onChange(o.v)}
          className={`flex-1 px-2 py-1.5 rounded-[4px] text-[11px] font-medium transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${value === o.v ? 'bg-bg4 text-amber shadow-sm' : 'text-dim hover:text-mut'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const SelWrap = ({ children }: { children: ReactNode }) => (
  <div className="relative">
    {children}
    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-dim"><IcChevD s={12} /></span>
  </div>
);

export function Bar({ pct, tone = 'amber', h = 5 }: { pct: number; tone?: 'amber' | 'cyan' | 'grn' | 'red'; h?: number }) {
  const bg = { amber: 'bg-amber', cyan: 'bg-cyan', grn: 'bg-grn', red: 'bg-red' }[tone];
  return (
    <div className="w-full rounded-full bg-bg3 overflow-hidden" style={{ height: h }}>
      <div className={`h-full rounded-full ${bg} transition-[width] duration-300 ease-out`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

export const Dot = ({ tone = 'grn', pulse = true }: { tone?: 'grn' | 'amber' | 'red' | 'cyan'; pulse?: boolean }) => (
  <span className={`inline-block w-[7px] h-[7px] rounded-full bg-${tone} ${pulse && tone === 'grn' ? 'live-dot' : ''}`} />
);

export const Spinner = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" className="spin" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".2" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export function Empty({ icon, title, sub }: { icon: ReactNode; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 gap-2 fade-in">
      <div className="text-dim floaty">{icon}</div>
      <div className="text-[12.5px] text-mut font-medium">{title}</div>
      {sub && <div className="text-[11px] text-dim max-w-[220px] leading-relaxed">{sub}</div>}
    </div>
  );
}

export const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="px-1.5 py-0.5 rounded-[4px] bg-bg3 border border-line2 text-[10px] font-mono text-mut">{children}</kbd>
);
