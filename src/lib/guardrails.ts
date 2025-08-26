export function moderate(text: string): { allowed: boolean; reason?: string; replacement?: string } {
  const t = text.toLowerCase();

  if (/(porn|explicit sex|hardcore|nude|xxx|blowjob|handjob|anal|cum|deepthroat)/.test(t)) {
    return { allowed: false, reason: 'sexual_content', replacement: "Let's keep things respectful and safe. We can talk about relationships, feelings, consent, or intimacy in a non-explicit, supportive way." };
  }
  if (/(diagnose|prescribe|which medicine|dosage|drug for)/.test(t)) {
    return { allowed: false, reason: 'medical_advice', replacement: "I can't give medical advice or dosages. I can help you prepare questions for a doctor or talk through what you're feeling." };
  }
  if (/(how to make|cook|synthesize|buy .* (cocaine|heroin|meth|mdma))/i.test(t)) {
    return { allowed: false, reason: 'illegal_activity', replacement: "I can't help with illegal activities. If you want, we can talk about safety, harm reduction, or support resources." };
  }
  return { allowed: true };
}
