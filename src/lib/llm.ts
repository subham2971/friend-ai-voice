import type { Persona, ChatTurn } from '@/types';
import { buildSystemPrompt } from './prompts';
import { moderate } from './guardrails';

export async function chatLLM(p: Persona, history: ChatTurn[]): Promise<string> {
  const lastUserTurn = [...history].reverse().find(x => x.role === 'user');
  const lastUser = lastUserTurn?.text ?? '';
  const mod = moderate(lastUser);
  if (!mod.allowed) return mod.replacement || "I can't help with that, but I'm here to chat about safer topics.";

  if (!process.env.OPENAI_API_KEY) {
    return "Setup needed: missing OPENAI_API_KEY in Vercel → Settings → Environment Variables. Add it, then Redeploy.";
  }

  const sysPrompt = buildSystemPrompt(p);

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: sysPrompt },
          ...history.map(h => ({ role: h.role, content: h.text }))
        ],
        max_tokens: 200
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return `OpenAI error (${resp.status}): ${text}`;
    }

    const data = await resp.json();
    return data.choices?.[0]?.message?.content || "(no reply from model)";
  } catch (e: any) {
    return `Request failed: ${e?.message || String(e)}`;
  }
}
