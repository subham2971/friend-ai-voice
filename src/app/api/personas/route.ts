import { NextResponse } from 'next/server';
import { z } from 'zod';
import { customAlphabet } from 'nanoid';
import { listPersonas, savePersona } from '@/lib/store';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);

const PersonaSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  gender: z.enum(['male','female','androgynous','custom']),
  age: z.number().int().min(13).max(120).optional(),
  work: z.string().optional(),
  language: z.enum(['auto','en','hi','or']).optional().default('auto'),
  vibe: z.enum(['coach','buddy','playful']).default('buddy'),
  voiceRef: z.string().optional(),
  voiceDesc: z.string().optional(),
  voiceConsent: z.boolean().optional().default(false),
});

export async function GET(){ return NextResponse.json(listPersonas()); }
export async function POST(req: Request){
  const body = await req.json();
  const data = PersonaSchema.parse(body);
  if (data.voiceRef && !data.voiceConsent) {
    return NextResponse.json({ ok:false, error:'voice_consent_required' }, { status: 400 });
  }
  const id = data.id ?? nanoid();
  savePersona({ ...data, id });
  return NextResponse.json({ ok:true, id });
}
