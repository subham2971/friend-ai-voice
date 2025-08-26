'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Persona } from '@/types';

async function fetchPersonas(): Promise<Persona[]> {
  const r = await fetch('/api/personas'); return r.json();
}

export default function Home(){
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [active, setActive] = useState<string|undefined>();
  const [chat, setChat] = useState<{role:'user'|'assistant',text:string}[]>([]);
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(()=>{ fetchPersonas().then(setPersonas); },[]);
  const current = useMemo(()=> personas.find(p=>p.id===active), [personas, active]);

  async function send(){
    if (!active || !input.trim()) return;
    const text = input.trim(); setChat(c=>[...c,{role:'user',text}]); setInput('');
    const r = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ personaId: active, text }) });
    const j = await r.json();
    if (j.reply) setChat(c=>[...c,{role:'assistant',text:j.reply}]);
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Friend AI</h1>
      <p className="text-sm text-gray-600 mt-1">Add a friend (optionally upload a voice reference <b>only if you have permission</b>), then chat.</p>

      <div className="my-4 flex gap-2">
        <select className="border rounded px-2 py-1" value={active||''} onChange={e=>setActive(e.target.value)}>
          <option value="">Select a friend…</option>
          {personas.map(p=> <option key={p.id} value={p.id}>{p.name} · {p.vibe}</option>)}
        </select>
        <button className="rounded bg-black text-white px-3 py-1" onClick={()=>setShowModal(true)}>+ Add Friend</button>
      </div>

      {current && (
        <div className="border rounded p-3 h-96 overflow-auto mb-3">
          {chat.map((m,i)=> (
            <div key={i} className={m.role==='user' ? 'text-right' : ''}>
              <span className={"inline-block my-1 px-3 py-2 rounded " + (m.role==='user'?'bg-blue-50':'bg-gray-100')}>{m.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" placeholder={current?`Message ${current.name}`:'Choose or add a friend…'} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') send();}}/>
        <button className="rounded bg-blue-600 text-white px-4" onClick={send}>Send</button>
      </div>

      {showModal && <AddFriendModal onClose={()=>setShowModal(false)} onSaved={(p)=>{ setPersonas(ps=>[...ps,p]); setActive(p.id); setShowModal(false); }}/> }
    </main>
  );
}

function AddFriendModal({ onClose, onSaved }:{ onClose:()=>void, onSaved:(p:Persona)=>void }){
  const [form, setForm] = useState({ name:'', gender:'androgynous', age:'', work:'', language:'auto', vibe:'buddy', voiceConsent:false, voiceDesc:''} as any);
  const [file, setFile] = useState<File|null>(null);
  const [uploading, setUploading] = useState(false);

  async function save(){
    let voiceRef: string | undefined = undefined;
    if (file) {
      if (!form.voiceConsent) { alert('To upload a voice, you must confirm permission.'); return; }
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/voice', { method:'POST', body: fd });
      const j = await r.json();
      setUploading(false);
      if (!j.ok) { alert('Upload failed'); return; }
      voiceRef = j.path;
    }
    const body = { ...form, age: form.age? Number(form.age): undefined, voiceRef };
    const r2 = await fetch('/api/personas', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const j2 = await r2.json();
    onSaved({ id: j2.id, ...body } as any);
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center">
      <div className="bg-white rounded p-4 w-full max-w-md">
        <h2 className="text-lg font-medium mb-2">Add Friend</h2>
        <div className="grid grid-cols-2 gap-2">
          <input className="border rounded px-2 py-1 col-span-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <select className="border rounded px-2 py-1" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="androgynous">Androgynous</option>
            <option value="custom">Custom</option>
          </select>
          <input className="border rounded px-2 py-1" placeholder="Age" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/>
          <input className="border rounded px-2 py-1 col-span-2" placeholder="Work (e.g., startup coach)" value={form.work} onChange={e=>setForm({...form,work:e.target.value})}/>
          <select className="border rounded px-2 py-1" value={form.language} onChange={e=>setForm({...form,language:e.target.value})}>
            <option value="auto">Auto</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="or">Odia</option>
          </select>
          <select className="border rounded px-2 py-1" value={form.vibe} onChange={e=>setForm({...form,vibe:e.target.value})}>
            <option value="buddy">Buddy</option>
            <option value="coach">Coach</option>
            <option value="playful">Playful (SFW)</option>
          </select>
          <div className="col-span-2 border rounded p-2 mt-1">
            <label className="text-sm font-medium">Optional: Reference voice (audio)</label>
            <input type="file" accept="audio/*" className="block mt-1" onChange={e=>setFile(e.target.files?.[0]||null)} />
            <textarea className="border rounded w-full px-2 py-1 mt-2" placeholder="Describe the person/voice vibe (optional)" value={form.voiceDesc} onChange={e=>setForm({...form,voiceDesc:e.target.value})}/>
            <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.voiceConsent} onChange={e=>setForm({...form,voiceConsent:e.target.checked})}/> I have explicit permission from this person to use their voice. No impersonation or deception.</label>
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading…</p>}
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button className="px-3 py-1" onClick={onClose}>Cancel</button>
          <button className="bg-black text-white rounded px-3 py-1" onClick={save} disabled={uploading}>Save</button>
        </div>
      </div>
    </div>
  );
}
