/* ============================================================
   OmniForge — Premium Content Script Engine
   Segment-weighted writer with persona mimicry, discovery modes,
   word-budget pacing and platform-tuned hooks.
   ============================================================ */

export type SegType = 'hook' | 'intro' | 'value' | 'story' | 'demo' | 'engage' | 'cta' | 'outro';

export const SEG_META: Record<SegType, { label: string; hint: string; w: number; head: string }> = {
  hook:   { label: 'Hook',          hint: 'Stop the scroll in under 3 seconds', w: 1.15, head: 'PATTERN INTERRUPT' },
  intro:  { label: 'Intro',         hint: 'Context, stakes and the promise',    w: 1.0,  head: 'SETUP & PROMISE' },
  value:  { label: 'Value Point',   hint: 'The core insight / teaching beat',   w: 1.7,  head: 'THE PAYLOAD' },
  story:  { label: 'Story Beat',    hint: 'Proof through narrative',            w: 1.4,  head: 'PROOF & STORY' },
  demo:   { label: 'Demonstration', hint: 'Show it live — no fluff',            w: 1.3,  head: 'LIVE DEMO' },
  engage: { label: 'Engagement',    hint: 'Comments are algorithm fuel',        w: 0.9,  head: 'ENGAGEMENT SPIKE' },
  cta:    { label: 'Call To Action',hint: 'Convert the attention',              w: 0.9,  head: 'THE ASK' },
  outro:  { label: 'Outro',         hint: 'Land the plane, seed the next one',  w: 0.9,  head: 'SIGN-OFF' },
};
export const SEG_ORDER: SegType[] = ['hook', 'intro', 'value', 'story', 'demo', 'engage', 'cta', 'outro'];

export interface Segment { id: string; type: SegType; note: string }

export interface Persona {
  id: string; name: string; kind: 'real' | 'fictional'; vibe: string;
  openers: string[]; adlibs: string[]; signoffs: string[]; emoji: string[]; hype?: boolean;
}

export const PERSONAS: Persona[] = [
  { id: 'mrbeast', name: 'MrBeast', kind: 'real', vibe: 'Escalating stakes, absurd numbers, relentless pace', hype: true, emoji: ['💸', '🔥', '🤯'],
    openers: ['I spent 50 hours on this so you get it in 60 seconds — and what we found broke our brains.', "We're doing the thing every expert said was impossible. Watch what happens."],
    adlibs: ['And yes — it gets crazier.', 'Nobody believed us. Nobody.', "Here's where it flips completely.", 'We doubled it. Obviously.'],
    signoffs: ['Subscribe or the algorithm wins. Your call.'] },
  { id: 'ramsay', name: 'Gordon Ramsay', kind: 'real', vibe: 'Blunt, passionate, brutally exacting', emoji: ['🔥'],
    openers: ['Right. Stop what you are doing, because this is about to get brutally honest.', 'Listen to me — most content about this is raw, undercooked nonsense. Not today.'],
    adlibs: ['Wake up!', "That's how it's done. Finally.", 'Unbelievable. Simply unbelievable.', 'No shortcuts. Ever.'],
    signoffs: ['Now get in there and absolutely nail it.'] },
  { id: 'rock', name: 'Dwayne "The Rock" Johnson', kind: 'real', vibe: 'Motivational powerhouse, eyebrow-raising charm', hype: true, emoji: ['💪', '⚡'],
    openers: ['Can you smell what this is cooking? Good — because this one changes the game.', 'Let me tell you something — this right here is the difference between dreaming and doing.'],
    adlibs: ['Let that sink in.', 'Boom. Just like that.', "It's that simple — and that hard.", 'Bring the intensity.'],
    signoffs: ['Know your role, put in the work, and enjoy the show.'] },
  { id: 'attenborough', name: 'David Attenborough', kind: 'real', vibe: 'Hushed wonder, patient gravitas, natural-world framing', emoji: [],
    openers: ['In the vast theatre of the everyday, one small thing performs an extraordinary trick.', 'Here, in the wild landscape of your feed, a rare phenomenon is about to unfold.'],
    adlibs: ['Astonishing.', 'And here — the real magic begins.', 'Few ever stop to notice.', 'Remarkable.'],
    signoffs: ['The world, as always, rewards the curious.'] },
  { id: 'oprah', name: 'Oprah Winfrey', kind: 'real', vibe: 'Warm, revelatory, you-deserve-this energy', emoji: ['✨'],
    openers: ['I want you to really hear this — because it changed everything for me, and it can change it for you.', 'There is a moment in every journey where the fog lifts. This is that moment.'],
    adlibs: ['And that — that is the moment.', 'Say yes to that.', 'You deserve that win.', 'Feel that? That is growth.'],
    signoffs: ['Live your best life — starting right now.'] },
  { id: 'kevinhart', name: 'Kevin Hart', kind: 'real', vibe: 'Hyper self-deprecating, escalating panic-comedy', hype: true, emoji: ['😭', '💀'],
    openers: ['Okay okay okay — you are NOT ready for how wild this is. I was not ready, and it was my life.', 'So I tried this, right? Big mistake. Beautiful, hilarious, life-changing mistake.'],
    adlibs: ["I'm being serious! ...mostly.", 'My chest hurt from this one.', 'Come on, now!', 'Why am I like this?!'],
    signoffs: ["Alright, I'm out. Stay dangerous — but like, safely."] },
  { id: 'snoop', name: 'Snoop Dogg', kind: 'real', vibe: 'Laid-back, smooth-talking, effortlessly cool', emoji: ['😎', '🍃'],
    openers: ['Yo — kick back and vibe, because we about to make this real smooth.', 'Check it — this one right here? Straight fire, served ice cold.'],
    adlibs: ['Fo shizzle, that is fire.', 'Stay smooth with it.', "That's the vibe, baby.", 'Big energy, zero stress.'],
    signoffs: ['Peace, love, and good content. We out.'] },
  { id: 'reynolds', name: 'Ryan Reynolds', kind: 'real', vibe: 'Deadpan meta-humor, fourth-wall demolition', emoji: ['🫠'],
    openers: ["Let's be honest — you clicked because the thumbnail was ridiculous. Stay anyway; the content is better.", 'This video was going to be normal. Then my ego got involved.'],
    adlibs: ['Legally, I must say that was not advice.', "Narrator: it was, in fact, a terrible idea.", 'Sponsored by my own confidence.', 'Cut that part. Actually, keep it.'],
    signoffs: ['Follow along. The chaos is free.'] },
  { id: 'freeman', name: 'Morgan Freeman', kind: 'real', vibe: 'Omniscient narrator, cosmic patience', emoji: [],
    openers: ['There are moments in every story when everything quietly changes. This is one of them.', 'They say knowledge is power. What they do not say... is how strange the journey gets.'],
    adlibs: ['And so it was.', 'Time, as always, would tell.', 'But that — is another story.', 'As it always has been.'],
    signoffs: ['Until next time — keep the story going.'] },
  { id: 'trailer', name: 'Trailer Titan', kind: 'fictional', vibe: 'The legendary movie-trailer voice, weaponized for feeds', hype: true, emoji: ['🎬'],
    openers: ['In a world where everyone scrolls past everything... one video dares to stop the thumb.', 'This season, the algorithm chose... you.'],
    adlibs: ['This summer.', 'One creator. Zero mercy.', "Critics are calling it: 'a video.'", 'The stakes have never been higher.'],
    signoffs: ['Coming soon to your feed. Rated V for Viral.'] },
  { id: 'wizard', name: 'The Grey Wizard', kind: 'fictional', vibe: 'Ancient sage dropping lore like quest items', emoji: ['🧙'],
    openers: ['Gather close, traveler, for I shall speak of a thing both small and mighty.', 'Many scroll past wisdom. You — you have chosen the harder, better path.'],
    adlibs: ['A wizard is never late with content.', 'The lore runs deep here.', 'Even the wisest nearly missed this.'],
    signoffs: ['Go now. The algorithm favors the bold.'] },
  { id: 'darklord', name: 'The Dark Lord', kind: 'fictional', vibe: 'Ominous, commanding, imperial engagement demands', emoji: ['⚫'],
    openers: ['You have scrolled far to find this. Impressive... most impressive.', 'I find your lack of views... disturbing. We shall fix that.'],
    adlibs: ['The power of this hook is undeniable.', 'Your engagement means nothing. (It means everything.)', 'Do not underestimate the dark side of consistency.'],
    signoffs: ['The feed will be ours. Soon.'] },
  { id: 'hypebot', name: 'HYPE-BOT 9000', kind: 'fictional', vibe: 'Malfunctioning hype machine, maximum caps', hype: true, emoji: ['🤖', '⚡'],
    openers: ['BEEP BOOP — VIRAL CONTENT DETECTED. INITIATING HYPE PROTOCOL.', 'ATTENTION HUMAN: YOUR FEED IS ABOUT TO BE UPGRADED.'],
    adlibs: ['HYPE LEVELS: MAXIMUM.', 'ERROR: TOO FIRE TO PROCESS.', 'RECALCULATING COOLNESS... OFF THE CHARTS.'],
    signoffs: ['END TRANSMISSION. STAY CHARGED, HUMANS.'] },
  { id: 'novela', name: 'The Telenovela Flame', kind: 'fictional', vibe: 'Overwrought drama, gasps, destiny, betrayal', emoji: ['🌹', '😱'],
    openers: ['Alejandro... no. This cannot be. This content — it changes EVERYTHING.', 'Destiny brought you to this video. Destiny... and a very good thumbnail.'],
    adlibs: ['*dramatic gasp*', 'The betrayal! The drama! The lighting!', 'How could the algorithm do this to us?!', 'My heart... and my watch time...'],
    signoffs: ['Continues tomorrow... if you can bear to wait. (You cannot.)'] },
];

export const TRENDING: { topic: string; niche: string }[] = [
  { topic: 'AI side hustles', niche: 'tech' }, { topic: 'morning routines of millionaires', niche: 'lifestyle' },
  { topic: 'budget travel hacks', niche: 'travel' }, { topic: 'gym transformation in 90 days', niche: 'fitness' },
  { topic: 'street food hidden gems', niche: 'food' }, { topic: 'tiny home living', niche: 'lifestyle' },
  { topic: 'retro gaming comebacks', niche: 'gaming' }, { topic: 'passive income myths', niche: 'finance' },
  { topic: 'productivity systems that fail', niche: 'productivity' }, { topic: 'thrift flip makeovers', niche: 'diy' },
  { topic: 'cold plunge science', niche: 'fitness' }, { topic: 'van life reality check', niche: 'travel' },
  { topic: 'no-code app building', niche: 'tech' }, { topic: 'sourdough for beginners', niche: 'food' },
  { topic: 'capsule wardrobe rules', niche: 'fashion' }, { topic: 'sleep optimization', niche: 'health' },
  { topic: 'digital declutter method', niche: 'productivity' }, { topic: 'indie game dev diaries', niche: 'gaming' },
  { topic: 'plant-based meal prep', niche: 'food' }, { topic: 'first apartment mistakes', niche: 'lifestyle' },
  { topic: 'negotiation scripts that work', niche: 'finance' }, { topic: 'journaling for focus', niche: 'productivity' },
  { topic: 'home studio on a budget', niche: 'music' }, { topic: 'urban photography tricks', niche: 'photo' },
];

const RELATED_TEMPLATES = [
  'the 5 biggest {t} mistakes (and the fixes)',
  '{t} tier list nobody asked for (everyone needed)',
  'I tried {t} for 30 days — honest results',
  'the truth about {t} experts won\'t post',
  '{t} in 2026: what actually changed',
  'beginner {t}: the only 3 rules that matter',
  'how {t} quietly changed my whole year',
  '{t} hacks the top 1% gatekeep',
];

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export const wc = (t: string) => t.split(/\s+/).filter(Boolean).length;
export const fmtDur = (s: number) => {
  const m = Math.floor(s / 60), r = Math.round(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
};

/* ---------- sentence banks (slots filled at build time) ---------- */
const fill = (tpl: string, t: string) => tpl
  .replace(/\{t\}/g, t)
  .replace(/\{n\}/g, String(ri(7, 90)))
  .replace(/\{pct\}/g, String(ri(28, 74)))
  .replace(/\{x\}/g, pick(['the fundamentals', 'one repeatable system', 'the first 30 days', 'a boring daily ritual']));

const BANKS: Record<SegType, string[]> = {
  hook: [
    'Stop scrolling — {t} is about to make a lot more sense in the next few seconds.',
    "Everyone is getting {t} wrong, and honestly? It's kind of embarrassing.",
    "I tested {t} for {n} days straight so you don't have to.",
    'Nobody talks about this side of {t} — and it changes everything.',
    'What if I told you {t} has a cheat code hiding in plain sight?',
    'This is your sign to finally figure out {t} for good.',
  ],
  intro: [
    "Quick context before we dive in: {t} blew up for a reason, and most of what you've heard is noise.",
    "Here's the deal with {t} — the basics take two minutes, the secrets take years. We're doing both, fast.",
    "By the end of this, you'll know more about {t} than 90% of people posting about it.",
    "I'm not selling you {t}. I'm handing you the map I wish someone gave me.",
  ],
  value: [
    'First: the 80/20 of {t}. Focus on {x} and ignore the rest — that alone puts you ahead.',
    'The biggest mistake? Overcomplicating {t}. Strip it down to three moves and repeat them daily.',
    'Here is a number that matters: people who nail this one habit with {t} improve {pct}% faster.',
    'Think of {t} like compound interest — tiny boring reps today, absurd results in {n} weeks.',
    'Pro move: steal what works. Find the top 1% in {t}, reverse-engineer the pattern, then add your twist.',
    "Tools won't save you, but the right one saves hours. With {t}, the difference is night and day.",
    "Timing beats talent here. Hit {t} when the crowd isn't looking and the algorithm rewards you.",
    'Write this down: consistency with {t} beats intensity every single week.',
    'Rule of thumb — if a {t} tip needs a 20-minute explanation, it is probably a trap.',
    'The fastest win in {t} is subtraction: cut the {x} everyone insists you need. Watch what happens.',
  ],
  story: [
    'Real talk: I ignored {t} for two years. It cost me opportunities I still think about.',
    'A friend of mine went all-in on {t} with zero audience. Ninety days later — completely different life.',
    'I remember the exact moment {t} clicked for me. I had been doing everything backwards.',
    'Someone in my comments said {t} "doesn\'t work anymore." Their next video did 2M views. Coincidence?',
    'The day I stopped chasing trends and built a system around {t}, everything got easier and faster.',
  ],
  demo: [
    'Watch closely — this is the exact sequence, no fluff. Step one is where most people quit.',
    "I'm running it live, mistakes and all, so you can see what real actually looks like.",
    'Pause this and follow along — this part is worth rewinding twice.',
    'Screenshot this frame. Future-you doing {t} will send a thank-you note.',
  ],
  engage: [
    'Quick gut check: are you team "learn {t} fast" or team "master it slow"? Comment below — I read everything.',
    "If this is the first video that's actually useful about {t}, tell me. That decides what I make next.",
    'Tag someone who needs to hear this about {t}. They will thank you later. Probably.',
  ],
  cta: [
    'If this saved you time, the follow button is free — and the next one goes even deeper on {t}.',
    'Hit save on this one. Future-you, deep in {t}, will be grateful.',
    "Want the full breakdown? It's pinned. Want it faster? That's what the follow is for.",
  ],
  outro: [
    "That's the playbook on {t}. Small reps, sharp focus, zero drama.",
    'You now know more than most — the only gap left is action.',
    'Same time next week: we take {t} to the next level. Do not miss it.',
  ],
};

const VALUE_LEADS = ['Another one:', 'And this is the one people skip:', 'Layer this on top:', 'The advanced version:', 'Here is where it gets fun:'];

const TITLE_PATTERNS = [
  'The {t} Playbook Nobody Hands Out',
  'I Cracked {t} So You Don\'t Have To',
  '{t}: The 90-Second Masterclass',
  'Why {t} Works (And Why It Isn\'t Working for You)',
  'From Zero to {t}: The Honest Route',
  '7 Hard Truths About {t} (Truth #4 Hurts)',
];

export type GenMode = 'exact' | 'related' | 'dice';

export interface GenOpts {
  topic: string; mode: GenMode; durationSec: number; targetWords: number;
  segments: Segment[]; personaId: string | null;
}

export interface GenSection { type: SegType; heading: string; note: string; lines: string[]; words: number; sec: number }
export interface GenResult {
  id: string; topicUsed: string; niche: string; mode: GenMode; personaId: string | null;
  titles: string[]; sections: GenSection[]; hashtags: string[]; words: number; seconds: number;
  notes: string[]; createdAt: number;
}

function resolveTopic(opts: GenOpts): { topic: string; niche: string; modeNote: string } {
  if (opts.mode === 'dice') {
    const t = pick(TRENDING);
    return { topic: t.topic, niche: t.niche, modeNote: `Discovery roll — engine selected "${t.topic}" from the trending pool` };
  }
  const raw = opts.topic.trim();
  if (opts.mode === 'related') {
    const words = raw.toLowerCase().split(/\s+/);
    const sameNiche = TRENDING.filter(t => t.topic.toLowerCase() !== raw.toLowerCase() && words.some(w => w.length > 3 && t.topic.toLowerCase().includes(w)));
    if (sameNiche.length) {
      const t = pick(sameNiche);
      return { topic: t.topic, niche: t.niche, modeNote: `Related-angle engine pivoted "${raw}" → "${t.topic}"` };
    }
    const topic = pick(RELATED_TEMPLATES).replace(/\{t\}/g, raw || 'this niche');
    return { topic, niche: 'remix', modeNote: `Related-angle engine remixed "${raw || 'untitled niche'}" into a proven format` };
  }
  const match = TRENDING.find(t => t.topic.toLowerCase() === raw.toLowerCase());
  return { topic: raw || pick(TRENDING).topic, niche: match?.niche ?? 'custom', modeNote: raw ? 'Locked to your exact topic/niche' : 'Topic was empty — engine pulled a trending standby' };
}

export function generateScript(opts: GenOpts): GenResult {
  const { topic, niche, modeNote } = resolveTopic(opts);
  const t = topic;
  const persona = PERSONAS.find(p => p.id === opts.personaId) ?? null;

  const totalW = Math.max(40, opts.targetWords);
  const sumW = opts.segments.reduce((a, s) => a + SEG_META[s.type].w, 0) || 1;
  const wpm = 158;

  const sections: GenSection[] = opts.segments.map(seg => {
    const meta = SEG_META[seg.type];
    const budget = Math.max(14, Math.round(totalW * (meta.w / sumW)));
    const lines: string[] = [];
    let words = 0;
    const bank = [...BANKS[seg.type]];
    let guard = 0;

    if (seg.type === 'hook' && persona) { lines.push(pick(persona.openers)); words += wc(lines[0]); }

    while (words < budget && guard < 40) {
      guard++;
      let line: string;
      if (seg.type === 'value' && bank.length === 0) {
        line = `${pick(VALUE_LEADS)} ${fill(pick(BANKS.value), t)}`;
      } else {
        if (bank.length === 0) bank.push(...BANKS[seg.type]);
        const i = Math.floor(Math.random() * bank.length);
        line = fill(bank.splice(i, 1)[0], t);
      }
      lines.push(line);
      words += wc(line);
      if (persona && seg.type !== 'outro' && Math.random() < 0.3) {
        lines.push(pick(persona.adlibs));
        words += wc(lines[lines.length - 1]);
      }
    }

    if (seg.type === 'outro' && persona) { lines.push(pick(persona.signoffs)); words += wc(lines[lines.length - 1]); }
    if (persona?.hype) lines[0] = lines[0].toUpperCase().replace(/\.$/, '.');
    if (persona && persona.emoji.length && Math.random() < 0.8) {
      const at = Math.min(lines.length - 1, ri(0, lines.length - 1));
      lines[at] = `${lines[at]} ${pick(persona.emoji)}`;
    }

    return {
      type: seg.type,
      heading: `${meta.label.toUpperCase()} — ${meta.head}`,
      note: seg.note.trim(),
      lines,
      words,
      sec: Math.round((words / wpm) * 60),
    };
  });

  const words = sections.reduce((a, s) => a + s.words, 0);
  const seconds = Math.round((words / wpm) * 60);

  const titlePool = [...TITLE_PATTERNS];
  const titles: string[] = [];
  while (titles.length < 3 && titlePool.length) {
    const i = Math.floor(Math.random() * titlePool.length);
    titles.push(titlePool.splice(i, 1)[0].replace(/\{t\}/g, t.split(' ')[0].toUpperCase() + t.split(' ').slice(1).join(' ')));
  }

  const tag = t.replace(/[^a-z0-9\s]/gi, '').trim().split(/\s+/).filter(w => w.length > 2).slice(0, 3).join('');
  const hashtags = [`#${tag || 'content'}`, `#${niche}`, '#fyp', '#viral', '#creator', pick(['#howto', '#2026', '#growth', '#learnonTikTok'.toLowerCase(), '#shorts'])];

  const notes = [
    modeNote,
    persona ? `Persona mimicry: ${persona.name} — ${persona.vibe.toLowerCase()}` : 'Persona: none (brand-neutral delivery)',
    `Pacing target: ${wpm} wpm · segment budgets weighted by function`,
    `Word target ${totalW} → delivered ${words} (${words >= totalW ? '+' : ''}${words - totalW})`,
  ];

  return {
    id: Math.random().toString(36).slice(2, 9), topicUsed: t, niche, mode: opts.mode,
    personaId: persona?.id ?? null, titles, sections, hashtags, words, seconds, notes, createdAt: Date.now(),
  };
}

export function scriptToText(r: GenResult): string {
  return `${r.titles[0]}\n\n${r.sections.map(s =>
    `[${s.heading}]${s.note ? `\n(Director's note: ${s.note})` : ''}\n${s.lines.join(' ')}`).join('\n\n')}\n\n${r.hashtags.join(' ')}`;
}
