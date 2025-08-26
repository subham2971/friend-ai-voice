export type Persona = {
  id: string;
  name: string;
  gender: 'male'|'female'|'androgynous'|'custom';
  age?: number;
  work?: string;
  language?: 'auto'|'en'|'hi'|'or';
  vibe?: 'coach'|'buddy'|'playful';
  voiceRef?: string;
  voiceDesc?: string;
  voiceConsent?: boolean;
};

export type ChatTurn = { role: 'user'|'assistant'; text: string; ts: number };
