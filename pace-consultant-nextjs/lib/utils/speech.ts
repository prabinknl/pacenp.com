import type { AssistantLanguage } from '@/lib/data/assistant-i18n';

/** Strip HTML tags so spoken text matches what users read. */
export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const LANG_BCP47: Record<AssistantLanguage, string> = {
  en: 'en-US',
  ne: 'ne-NP',
};

function isFemaleVoice(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.includes('female') ||
    lower.includes('zira') ||
    lower.includes('samantha') ||
    lower.includes('hazel') ||
    lower.includes('susan') ||
    lower.includes('karen') ||
    lower.includes('veena') ||
    lower.includes('heera') ||
    lower.includes('lekha') ||
    lower.includes('swara') ||
    lower.includes('kalpana') ||
    lower.includes('neha') ||
    lower.includes('priya')
  );
}

function langMatches(voiceLang: string, prefixes: string[]): boolean {
  const lower = voiceLang.toLowerCase().replace('_', '-');
  return prefixes.some((prefix) => lower === prefix || lower.startsWith(`${prefix}-`) || lower.startsWith(prefix));
}

/** Prefer native Nepali (ne-NP), never English for Nepali text. Hindi is last Devanagari fallback. */
function pickAssistantVoice(lang: AssistantLanguage): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();

  if (lang === 'ne') {
    return (
      voices.find((voice) => langMatches(voice.lang, ['ne-np']) && isFemaleVoice(voice.name)) ??
      voices.find((voice) => langMatches(voice.lang, ['ne']) && isFemaleVoice(voice.name)) ??
      voices.find((voice) => langMatches(voice.lang, ['ne-np', 'ne'])) ??
      voices.find((voice) => langMatches(voice.lang, ['hi-in', 'hi']) && isFemaleVoice(voice.name)) ??
      voices.find((voice) => langMatches(voice.lang, ['hi-in', 'hi'])) ??
      null
    );
  }

  return (
    voices.find((voice) => langMatches(voice.lang, ['en-us', 'en-gb', 'en']) && isFemaleVoice(voice.name)) ??
    voices.find((voice) => langMatches(voice.lang, ['en-us', 'en-gb', 'en'])) ??
    null
  );
}

/** Warm up browser voices for smoother live speech. */
export function preloadSpeechVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.getVoices();

  const handleVoicesChanged = () => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
  };

  window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
}

export type SpeakCallbacks = {
  onStart?: () => void;
  onBoundary?: (spokenSoFar: string) => void;
  onEnd?: () => void;
};

const SPEECH_RATES: Record<AssistantLanguage, number> = {
  en: 0.92,
  ne: 0.86,
};

const SPEECH_PITCH: Record<AssistantLanguage, number> = {
  en: 1.0,
  ne: 0.98,
};

function splitIntoSentences(text: string): string[] {
  const parts = text.match(/[^.!?।]+[.!?।]?/g);
  if (!parts) return [text];
  return parts.map((part) => part.trim()).filter(Boolean);
}

function speakSingleUtterance(
  text: string,
  lang: AssistantLanguage,
  callbacks?: SpeakCallbacks
): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text.trim()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const startSpeaking = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickAssistantVoice(lang);

      utterance.lang = lang === 'ne' ? 'ne-NP' : LANG_BCP47[lang];
      if (voice) {
        utterance.voice = voice;
        if (lang === 'ne' && voice.lang) {
          const vl = voice.lang.toLowerCase().replace('_', '-');
          if (vl.startsWith('ne')) utterance.lang = voice.lang;
          else if (vl.startsWith('hi')) utterance.lang = voice.lang;
          else utterance.lang = 'ne-NP';
        }
      }

      utterance.rate = SPEECH_RATES[lang];
      utterance.pitch = SPEECH_PITCH[lang];
      utterance.volume = 1;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      startSpeaking();
      return;
    }

    const handleVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      startSpeaking();
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
  });
}

/** Speak text live with a language-aware female assistant voice. */
export function speakText(
  text: string,
  lang: AssistantLanguage = 'en',
  callbacks?: SpeakCallbacks
): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text.trim()) {
    return Promise.resolve();
  }

  const sentences = splitIntoSentences(text);
  let spokenSoFar = '';
  let started = false;

  return (async () => {
    window.speechSynthesis.cancel();

    for (let index = 0; index < sentences.length; index += 1) {
      const sentence = sentences[index];
      if (!sentence) continue;

      if (!started) {
        started = true;
        callbacks?.onStart?.();
      }

      await speakSingleUtterance(sentence, lang);
      spokenSoFar = spokenSoFar ? `${spokenSoFar} ${sentence}` : sentence;
      callbacks?.onBoundary?.(spokenSoFar);
    }

    callbacks?.onBoundary?.(text);
    callbacks?.onEnd?.();
  })();
}

/** Stop any in-progress assistant speech. */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
