export type ApiScriptRequest = {
  topic: string;
  mode: 'exact' | 'related' | 'dice';
  duration_sec: number;
  target_words?: number;
  audience?: string;
};

export type ApiScriptResult = {
  titles: string[];
  sections: Array<{ heading: string; lines: string[]; words: number; sec: number; note: string }>;
  hashtags: string[];
  notes: string[];
  words: number;
  seconds: number;
  topic: string;
  description: string;
  scenes: Array<{ text: string; visual_query: string }>;
  full_text: string;
};

export type ApiProductionResult = {
  ok: boolean;
  topic: string;
  title: string;
  path: string;
  video_url: string;
  voice_path: string;
  captions_path: string;
  words: number;
  duration_sec: number;
};

export type VoiceEngine = 'gemini' | 'kokoro';

export type ApiVoiceRequest = {
  text: string;
  engine: VoiceEngine;
  voice_id: string;
  style: string;
  emotion: string;
  speed: number;
  pitch: number;
  preview?: boolean;
};

export type ApiVoiceResult = {
  ok: boolean;
  engine: VoiceEngine;
  voice_id: string;
  engine_voice: string | null;
  audio_url: string;
  path: string;
  duration_sec: number;
  preview: boolean;
};

export type ApiHealthResult = {
  ok: boolean;
  service: string;
  voice: {
    default_engine: VoiceEngine;
    available_engines: VoiceEngine[];
  };
};

const API_BASE = 'http://127.0.0.1:8000';

export async function generateFreeFacelessScript(
  request: ApiScriptRequest,
  signal?: AbortSignal,
): Promise<ApiScriptResult> {
  const response = await fetch(`${API_BASE}/api/script`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  });

  let payload: any = null;
  try { payload = await response.json(); } catch { /* handled below */ }

  if (!response.ok) {
    throw new Error(payload?.detail || `FreeFaceless API returned HTTP ${response.status}`);
  }

  return payload as ApiScriptResult;
}

export async function synthesizeFreeFacelessVoice(
  request: ApiVoiceRequest,
  signal?: AbortSignal,
): Promise<ApiVoiceResult> {
  const response = await fetch(`${API_BASE}/api/voice/synthesize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  });

  let payload: any = null;
  try { payload = await response.json(); } catch { /* handled below */ }

  if (!response.ok) {
    throw new Error(payload?.detail || `FreeFaceless voice API returned HTTP ${response.status}`);
  }

  return payload as ApiVoiceResult;
}

export function freeFacelessOutputUrl(relativeUrl: string): string {
  return `${API_BASE}${relativeUrl}`;
}

export async function produceLastFreeFacelessVideo(
  signal?: AbortSignal,
): Promise<ApiProductionResult> {
  const response = await fetch(`${API_BASE}/api/produce-last`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
  });

  let payload: any = null;
  try { payload = await response.json(); } catch { /* handled below */ }

  if (!response.ok) {
    throw new Error(payload?.detail || `FreeFaceless production returned HTTP ${response.status}`);
  }

  return payload as ApiProductionResult;
}

export async function getFreeFacelessHealth(): Promise<ApiHealthResult | null> {
  try {
    const response = await fetch(API_BASE + '/api/health');
    if (!response.ok) return null;
    return (await response.json()) as ApiHealthResult;
  } catch {
    return null;
  }
}

export async function checkFreeFacelessHealth(): Promise<boolean> {
  return (await getFreeFacelessHealth()) !== null;
}
