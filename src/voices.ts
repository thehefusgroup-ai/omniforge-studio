export interface VoiceModel {
  id: string;
  name: string;
  gender: 'M' | 'F';
  code: string;
  accent: string;
  tags: string[];
  desc: string;
  sample: string;
  pitch: number;
  rate: number;
  feats: string[];
}

export const VOICES: VoiceModel[] = [
  // ---- MALE ----
  { id: 'm1', name: 'ATLAS', gender: 'M', code: 'NF-3.2 · M-01', accent: 'American · Deep', tags: ['Narration', 'Documentary'], desc: 'Gravel-warm longform narrator with cinematic weight and gravitas.', sample: 'In a world of endless noise, the signal is you. This is the story they never told.', pitch: 0.68, rate: 0.9, feats: ['Longform 8k ctx', 'Emotion engine', '32 langs'] },
  { id: 'm2', name: 'REX', gender: 'M', code: 'NF-3.2 · M-02', accent: 'American · Trailer', tags: ['Promo', 'Epic'], desc: 'The stadium-shaking trailer titan. Built for reveals and drop-the-mic moments.', sample: 'This summer... one creator... changes everything. Are you ready?', pitch: 0.74, rate: 0.86, feats: ['Impact mode', 'Duck & punch', 'Stem export'] },
  { id: 'm3', name: 'JULIAN', gender: 'M', code: 'NF-3.2 · M-03', accent: 'Transatlantic · Smooth', tags: ['Commercial', 'Luxury'], desc: 'Velvet commercial read. Sell the dream without raising his voice.', sample: 'Some things are not bought. They are chosen. Choose extraordinarily.', pitch: 0.9, rate: 0.94, feats: ['Ad timing sync', 'Brand-safe', 'Multi-take'] },
  { id: 'm4', name: 'DASH', gender: 'M', code: 'NF-3.2 · M-04', accent: 'American · Energetic', tags: ['Hype', 'Shorts'], desc: 'High-octane creator energy tuned for retention graphs and hook culture.', sample: 'Yo — stop scrolling, this one is a banger, and it gets wild at the end!', pitch: 1.02, rate: 1.18, feats: ['Retention boost', 'Auto-pace', 'SRT out'] },
  { id: 'm5', name: 'MARCUS', gender: 'M', code: 'NF-3.2 · M-05', accent: 'American · Warm', tags: ['Storytelling', 'Podcast'], desc: 'The fireside storyteller. Makes every script feel like a memory.', sample: 'Let me tell you about the night everything changed. It started small, like it always does.', pitch: 0.86, rate: 0.95, feats: ['Chapter marks', 'Warmth ctrl', 'Breath model'] },
  { id: 'm6', name: 'HALE', gender: 'M', code: 'NF-3.2 · M-06', accent: 'British · Academic', tags: ['Explainer', 'Education'], desc: 'Precise professor cadence. Complex ideas, delivered like clockwork.', sample: 'Consider the humble algorithm: a set of rules that quietly decides what you see next.', pitch: 0.82, rate: 0.97, feats: ['Terminology mode', 'Citations', '16 langs'] },
  { id: 'm7', name: 'BLAZE', gender: 'M', code: 'NF-3.2 · M-07', accent: 'Urban · Youth', tags: ['Culture', 'Music'], desc: 'Street-smart delivery with rhythm. Made for culture-first content.', sample: 'Real talk — the game changed overnight, and most people are still sleeping on it.', pitch: 0.92, rate: 1.08, feats: ['Slang-aware', 'Beat sync', 'Ad-lib FX'] },
  { id: 'm8', name: 'VIKTOR', gender: 'M', code: 'NF-3.2 · M-08', accent: 'European · Dramatic', tags: ['Cinematic', 'Thriller'], desc: 'Slow-burn intensity. Every pause is a weapon, every line a cliffhanger.', sample: 'They said the door could not be opened. They were wrong. It was never locked.', pitch: 0.78, rate: 0.88, feats: ['Suspense map', 'Whisper layer', '5.1 ready'] },
  { id: 'm9', name: 'SAM', gender: 'M', code: 'NF-3.2 · M-09', accent: 'American · Friendly', tags: ['Tutorial', 'Tech'], desc: 'Your helpful neighbor who happens to explain software flawlessly.', sample: 'Alright, quick one — three clicks, that is literally all it takes. Watch.', pitch: 0.95, rate: 1.04, feats: ['Step pacing', 'Code-safe', 'Screen sync'] },
  // ---- FEMALE ----
  { id: 'f1', name: 'NOVA', gender: 'F', code: 'NF-3.2 · F-01', accent: 'American · Bright', tags: ['Commercial', 'Pop'], desc: 'Sunshine-in-a-voice. The read that makes brands feel human.', sample: 'Hey! Big news — your favorite thing just got a whole lot better. Come see.', pitch: 1.22, rate: 1.06, feats: ['Smile detect', 'Ad timing sync', 'Multi-take'] },
  { id: 'f2', name: 'SERAPHINA', gender: 'F', code: 'NF-3.2 · F-02', accent: 'Neutral · Calm', tags: ['Meditation', 'Wellness'], desc: 'A slow tide of calm. Lowers the heart rate of any timeline.', sample: 'Breathe in. Let the day loosen its grip. You have arrived exactly on time.', pitch: 1.08, rate: 0.82, feats: ['Sleep mode', 'Binaural bed', 'Breath model'] },
  { id: 'f3', name: 'ZARA', gender: 'F', code: 'NF-3.2 · F-03', accent: 'American · Sassy', tags: ['Social', 'Commentary'], desc: 'Quick-witted, zero filter, engineered for quote-tweets and stitches.', sample: 'Okay so... no, because why did nobody warn me about this? We need to talk.', pitch: 1.18, rate: 1.14, feats: ['Retention boost', 'Stitch cuts', 'Emphasis AI'] },
  { id: 'f4', name: 'IVY', gender: 'F', code: 'NF-3.2 · F-04', accent: 'Corporate · Crisp', tags: ['Business', 'eLearning'], desc: 'Boardroom-ready precision. KPIs have never sounded this confident.', sample: 'Q3 delivered above target on every metric that matters. Here is the roadmap ahead.', pitch: 1.05, rate: 1.0, feats: ['Terminology mode', 'Slide sync', 'SCORM out'] },
  { id: 'f5', name: 'LUNA', gender: 'F', code: 'NF-3.2 · F-05', accent: 'Soft · Intimate', tags: ['ASMR', 'Night'], desc: 'Whisper-close intimacy with studio-grade sibilance control.', sample: 'Hey... stay a while. The world can wait. This part is just for you.', pitch: 1.15, rate: 0.84, feats: ['Whisper layer', 'Proximity FX', 'Noise-safe'] },
  { id: 'f6', name: 'ROXY', gender: 'F', code: 'NF-3.2 · F-06', accent: 'Pop · Electric', tags: ['Music', 'Hype'], desc: 'Main-stage energy. Turns a voiceover into a chorus you cannot drop.', sample: 'Turn it UP — tonight we make the kind of content people screenshot!', pitch: 1.28, rate: 1.16, feats: ['Beat sync', 'Auto-pace', 'Stem export'] },
  { id: 'f7', name: 'ELOISE', gender: 'F', code: 'NF-3.2 · F-07', accent: 'British · Refined', tags: ['Luxury', 'Heritage'], desc: 'Received poise with a modern edge. Timeless reads, zero dust.', sample: 'Craft is not a department. It is a discipline — and this house keeps it beautifully.', pitch: 1.12, rate: 0.92, feats: ['Brand-safe', 'Longform 8k ctx', '12 langs'] },
  { id: 'f8', name: 'ARIA', gender: 'F', code: 'NF-3.2 · F-08', accent: 'Cinematic · Epic', tags: ['Trailer', 'Fantasy'], desc: 'Orchestral female lead. Prophecies, battle cries, and final stands.', sample: 'When the last light fades, one voice will remain. Listen — it is already calling.', pitch: 1.02, rate: 0.88, feats: ['Impact mode', '5.1 ready', 'Chorus FX'] },
  { id: 'f9', name: 'PIPER', gender: 'F', code: 'NF-3.2 · F-09', accent: 'American · Friendly', tags: ['Vlog', 'Lifestyle'], desc: 'The friend who narrates your day better than you could.', sample: 'Come with me — today is one of those days that starts ordinary and ends unforgettable.', pitch: 1.2, rate: 1.05, feats: ['Chapter marks', 'SRT out', 'Breath model'] },
];

export const VOICE_STYLES = ['Neutral', 'Conversational', 'News', 'Narration', 'Promo', 'Whisper'];
export const VOICE_EMOTIONS = ['None', 'Joy', 'Serious', 'Curious', 'Hype', 'Calm', 'Dramatic'];
