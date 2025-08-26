import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Persona, ChatTurn } from '@/types';

const DIR = process.env.DATA_DIR || (process.env.NODE_ENV === 'production' ? '/tmp' : join(process.cwd(), '.data'));
const PERSONAS = join(DIR, 'personas.json');
const CHATS = (id: string) => join(DIR, `chat_${id}.json`);

function ensure(){
  if(!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
  if(!existsSync(PERSONAS)) writeFileSync(PERSONAS, '[]');
}

export function listPersonas(): Persona[] { ensure(); return JSON.parse(readFileSync(PERSONAS,'utf8')||'[]'); }
export function savePersona(p: Persona){
  const arr=listPersonas();
  const i=arr.findIndex(x=>x.id===p.id);
  if(i>=0) arr[i]=p; else arr.push(p);
  writeFileSync(PERSONAS, JSON.stringify(arr,null,2));
}
export function getChat(id: string): ChatTurn[]{
  ensure();
  const file = CHATS(id);
  if(!existsSync(file)) writeFileSync(file, '[]');
  return JSON.parse(readFileSync(file,'utf8')||'[]');
}
export function appendChat(id: string, turn: ChatTurn){
  const arr=getChat(id);
  arr.push(turn);
  writeFileSync(CHATS(id), JSON.stringify(arr,null,2));
}
