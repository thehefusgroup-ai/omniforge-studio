export interface Source {
  id: string;
  kind: 'script' | 'voice' | 'visual' | 'timeline' | 'final' | 'import';
  name: string;
  meta: string;
  duration: number;
  createdAt: number;
}

export type TaskType = 'script' | 'voice' | 'visual' | 'compile';

export interface Task {
  id: string;
  type: TaskType;
  label: string;
  at: number;
  status: 'pending' | 'running' | 'done';
  result?: string;
}

export interface Settings {
  providers: { tts: string; llm: string; img: string };
  keys: { tts: string; llm: string; img: string };
  verified: { tts: boolean; llm: boolean; img: boolean };
}
