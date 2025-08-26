import { buildSystemPrompt } from './prompts';
import { moderate } from './guardrails';
import type { Persona, ChatTurn } from '@/types';

export async function chatLLM(p: Persona, history: ChatTurn[]): Promise<string> {
  const lastUserTurn = [...history].reverse().find(x=>x.role==='user');
  const lastUser = lastUserTurn?.text ?? '';
  const mod = moderate(lastUser);
  if (!mod.allowed) return mod.replacement || "I can't help with that, but I'm here to chat about safer topics.";

  const sys = buildSystemPrompt(p);
  return `[${p.name}${p.voiceDesc ? ' · custom voice' : ''} · ${p.vibe}] ${lastUser}`;
}
