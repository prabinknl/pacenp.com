import type { AssistantLanguage } from '@/lib/data/assistant-i18n';

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
};

type SpeechRecognitionResultListLike = {
  length: number;
  [index: number]: {
    isFinal: boolean;
    [index: number]: { transcript: string };
  };
};

const RECOGNITION_LANG: Record<AssistantLanguage, string> = {
  en: 'en-US',
  ne: 'ne-NP',
};

function getSpeechRecognitionConstructor():
  | (new () => SpeechRecognitionInstance)
  | null {
  if (typeof window === 'undefined') return null;

  const win = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };

  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

/** Whether the browser supports microphone speech-to-text. */
export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null;
}

/** Create live speech recognition for English or Nepali questions. */
export function createSpeechRecognition(lang: AssistantLanguage = 'en'): SpeechRecognitionInstance | null {
  const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
  if (!SpeechRecognitionCtor) return null;

  const recognition = new SpeechRecognitionCtor();
  recognition.lang = RECOGNITION_LANG[lang];
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  return recognition;
}

/** Read live + final transcript chunks from a recognition result event. */
export function readTranscript(event: SpeechRecognitionEventLike): {
  interim: string;
  final: string;
  combined: string;
} {
  let interim = '';
  let final = '';

  for (let i = event.resultIndex; i < event.results.length; i += 1) {
    const result = event.results[i];
    const chunk = result[0]?.transcript ?? '';
    if (result.isFinal) final += `${chunk} `;
    else interim += `${chunk} `;
  }

  const combined = `${final}${interim}`.trim();
  return { interim: interim.trim(), final: final.trim(), combined };
}
