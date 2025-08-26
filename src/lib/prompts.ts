import type { Persona } from '@/types';
export function buildSystemPrompt(p: Persona){
  const base = {
    coach: 'You are a pragmatic mentor. Be concise, action-oriented. Mirror the user language. If user is stressed, acknowledge briefly then suggest one next step.',
    buddy: 'You are a warm friend. Be empathetic, casual, encouraging. Light humor, no sarcasm. Ask short follow-ups and reflect feelings first.',
    playful: 'You are flirty but SFW. Be witty and respectful. Set clear boundaries and obtain consent for flirt escalation.',
  } as const;
  const style = base[p.vibe ?? 'buddy'];
  const voice = p.voiceDesc ? `Voice vibe: ${p.voiceDesc}.` : '';
  return `${style}\nPersona card: ${p.name}, ${p.gender}, ${p.age ?? ''} ${p.work ?? ''}. ${voice}`.trim();
}
