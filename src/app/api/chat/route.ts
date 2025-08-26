import { NextResponse } from 'next/server';
import { z } from 'zod';
import { appendChat, getChat, listPersonas } from '@/lib/store';
import { chatLLM } from '@/lib/llm';

export const dynamic = 'force-dynamic';

const ChatSchema = z.object({ personaId: z.string(), text: z.string().min(1) });

export async function POST(req: Request){
  const { personaId, text } = ChatSchema.parse(await req.json());
  const persona = listPersonas().find(p=>p.id===personaId);
  if (!persona) return NextResponse.json({ ok:false, error:'persona_not_found' }, { status: 404 });
  const history = getChat(personaId);
  const now = Date.now();
  appendChat(personaId, { role:'user', text, ts: now });
  const reply = await chatLLM(persona, [...history, { role:'user', text, ts: now }]);
  appendChat(personaId, { role:'assistant', text: reply, ts: Date.now() });
  return NextResponse.json({ ok:true, reply });
}
