# Friend AI (Voice-ready Starter with Consent & Safety)

This website lets a user:
- Add a **Friend** with name, gender, age, work, language, vibe (buddy/coach/playful).
- **Optionally upload a voice reference** (only if they have permission) and describe the vibe.
- Chat in a simple box.

This starter **does not clone voices** or break rules. The upload is stored temporarily and is meant to be used *later* when connecting a compliant TTS provider that requires consent. It includes **basic guardrails** (no explicit porn, no illegal instructions, no medical dosing).

## Deploy free on Vercel
1) Create GitHub → make a repo `friend-ai-voice`
2) Upload all files from this folder to the repo
3) Create Vercel account → **New Project** → import repo → **Deploy**
4) Open your live URL

## Local run (optional)
```
npm install
npm run dev
# http://localhost:3000
```

## Where to change things
- UI & modal: `src/app/page.tsx`
- Persona types: `src/types.ts`
- Voice upload API: `src/app/api/voice/route.ts` (saves to /tmp on serverless)
- Personas API: `src/app/api/personas/route.ts`
- Chat API (with safety): `src/app/api/chat/route.ts`
- Prompts/persona style: `src/lib/prompts.ts`
- Guardrails: `src/lib/guardrails.ts`
- LLM stub: `src/lib/llm.ts`

## Next steps (when ready)
- Connect a **compliant TTS** that supports custom voices with explicit consent.
- Replace `chatLLM` with a real LLM API.
- Use a database (e.g., Supabase) instead of temp files so data persists.

