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

export async function checkFreeFacelessHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
