'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCommentDots,
  FaTimes,
  FaPaperPlane,
  FaMicrophone,
  FaVolumeUp,
  FaVolumeMute,
} from 'react-icons/fa';
import {
  getBotResponse,
  getWelcomeMessage,
} from '@/lib/data/assistant-i18n';
import { speakText, stopSpeaking, stripHtml, preloadSpeechVoices } from '@/lib/utils/speech';
import {
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  readTranscript,
} from '@/lib/utils/listen';

interface ChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechError, setSpeechError] = useState('');

  const [voiceSupported, setVoiceSupported] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const welcomeSent = useRef(false);
  const recognitionRef = useRef<ReturnType<typeof createSpeechRecognition> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVoiceSupported(isSpeechRecognitionSupported());
    setSpeechSupported(typeof window.speechSynthesis !== 'undefined');
  }, []);

  const speakAsAssistant = useCallback(
    async (text: string) => {
      if (!voiceEnabled || !speechSupported) return;

      const plainText = stripHtml(text);
      if (!plainText) return;

      try {
        await speakText(plainText, 'en', {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
        });
      } finally {
        setIsSpeaking(false);
      }
    },
    [voiceEnabled, speechSupported]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const appendAssistantReply = useCallback(
    (text: string) => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'assistant', text }]);
      void speakAsAssistant(text);
    },
    [speakAsAssistant]
  );

  const processUserQuestion = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || isTyping || isSearching) return;

      setSpeechError('');
      setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: question }]);
      setInputValue('');
      setIsTyping(true);
      setIsSearching(true);

      const history = messages
        .filter((msg) => msg.text.trim())
        .map((msg) => ({
          role: msg.sender,
          content: msg.text,
        }));

      try {
        const response = await fetch('/api/assistant/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            language: 'en',
            history,
          }),
        });

        const data = (await response.json()) as { answer?: string; error?: string };
        const botResponse = data.answer?.trim() || getBotResponse(question, 'en');
        appendAssistantReply(botResponse);
      } catch {
        appendAssistantReply(getBotResponse(question, 'en'));
        setSpeechError('Search is temporarily unavailable. Showing a quick answer.');
      } finally {
        setIsTyping(false);
        setIsSearching(false);
      }
    },
    [isTyping, isSearching, messages, appendAssistantReply]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isSearching, isSpeaking]);

  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      stopListening();
      setIsSpeaking(false);
      return;
    }

    preloadSpeechVoices();
    if (welcomeSent.current) return;

    welcomeSent.current = true;
    const welcome = getWelcomeMessage('en');
    setMessages([{ id: Date.now(), sender: 'assistant', text: welcome }]);
    void speakAsAssistant(welcome);
  }, [isOpen, speakAsAssistant, stopListening]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, [stopListening]);

  const startListening = () => {
    if (!voiceSupported || isListening || isTyping || isSearching) return;

    setSpeechError('');
    stopSpeaking();
    stopListening();

    const recognition = createSpeechRecognition('en');
    if (!recognition) {
      setSpeechError('Voice input is not supported in this browser.');
      return;
    }

    recognitionRef.current = recognition;
    setIsListening(true);

    recognition.onresult = (event) => {
      const { combined, final } = readTranscript(event);
      if (!combined) return;
      setInputValue(combined);
      if (final) stopListening();
    };

    recognition.onerror = (event) => {
      stopListening();
      if (event.error !== 'aborted') {
        setSpeechError('Could not hear you. Please try again or type your message.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch {
      stopListening();
      setSpeechError('Microphone is busy. Please try again.');
    }
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    setVoiceEnabled((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stopListening();
    processUserQuestion(inputValue);
  };

  const closeChat = () => {
    stopSpeaking();
    stopListening();
    setIsSpeaking(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating chat button — bottom-right, clear of page CTAs */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="pace-assistant-fab fixed bottom-5 right-4 z-[998] flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-card transition hover:bg-green-700 hover:scale-105 active:scale-95 md:bottom-6 md:right-6 md:h-16 md:w-16"
        aria-label="Open PACE Assistant"
        aria-expanded={isOpen}
      >
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-green-600/40 animate-ping opacity-60" />
        )}
        <FaCommentDots className="relative z-10 h-6 w-6 md:h-7 md:w-7" />
        <span className="sr-only">PACE Assistant</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`pace-assistant-panel fixed bottom-[5.5rem] right-3 flex h-[min(560px,78vh)] w-[calc(100vw-1.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card-hover md:bottom-24 md:right-6 ${
              isSpeaking ? 'z-[1100]' : 'z-[999]'
            }`}
            role="dialog"
            aria-label="PACE Assistant chat"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
              <div className="relative shrink-0">
                <div
                  className={`relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/30 bg-white/10 ${
                    isSpeaking ? 'ring-2 ring-green-300 animate-pulse' : ''
                  }`}
                >
                  <Image
                    src="/images/pace-assistant.png"
                    alt="PACE Assistant"
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <span
                  className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-primary bg-green-400 animate-pulse"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base font-semibold leading-tight">PACE Assistant</h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-green-300">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online now
                </p>
              </div>

              <div className="flex items-center gap-1">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className="rounded-full p-2 text-white/85 transition hover:bg-white/10 hover:text-white"
                    aria-label={voiceEnabled ? 'Turn voice off' : 'Turn voice on'}
                    title={voiceEnabled ? 'Voice on' : 'Voice off'}
                  >
                    {voiceEnabled ? (
                      <FaVolumeUp className="h-4 w-4" />
                    ) : (
                      <FaVolumeMute className="h-4 w-4" />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeChat}
                  className="rounded-full p-2 text-white/85 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close chat"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Speaking indicator */}
            {isSpeaking && (
              <div className="flex items-center justify-end gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700">
                  <span className="inline-flex gap-0.5">
                    <span className="h-2 w-0.5 animate-pulse rounded-full bg-green-600 [animation-delay:-0.3s]" />
                    <span className="h-3 w-0.5 animate-pulse rounded-full bg-green-600 [animation-delay:-0.15s]" />
                    <span className="h-2 w-0.5 animate-pulse rounded-full bg-green-600" />
                  </span>
                  Speaking...
                </span>
              </div>
            )}

            {/* Speaking avatar brought to the front while audio plays */}
            {isSpeaking && (
              <div
                className="pace-assistant-speaking-front absolute inset-x-0 top-[7.25rem] z-[1200] flex justify-center px-3 pointer-events-none"
                aria-live="polite"
              >
                <div className="flex w-full max-w-[260px] flex-col items-center rounded-2xl border-2 border-green-400 bg-white/95 px-4 py-4 shadow-card-hover backdrop-blur-sm">
                  <div className="relative">
                    <span className="absolute -inset-2 rounded-full border border-green-300 animate-ping opacity-50" />
                    <span className="absolute -inset-1 rounded-full border border-green-400 animate-pulse opacity-70" />
                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-green-500 shadow-lg ring-4 ring-green-200">
                      <Image
                        src="/images/pace-assistant.png"
                        alt="PACE Assistant speaking"
                        fill
                        sizes="112px"
                        className="object-cover object-top animate-pulse"
                        priority
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-green-700">Live speaking...</p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="relative z-0 flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3 scroll-smooth">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="relative mr-2 mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full border border-green-200">
                      <Image
                        src="/images/pace-assistant.png"
                        alt=""
                        fill
                        sizes="28px"
                        className="object-cover object-top"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'rounded-br-none bg-primary text-white'
                        : 'rounded-bl-none border border-gray-200 bg-white text-text-dark'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="relative h-7 w-7 overflow-hidden rounded-full border border-green-200">
                    <Image
                      src="/images/pace-assistant.png"
                      alt=""
                      fill
                      sizes="28px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-col gap-1 rounded-2xl rounded-bl-none border border-gray-200 bg-white px-3 py-2">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                    </div>
                    {isSearching && (
                      <span className="text-[10px] text-muted">Searching pacenp.com and the web...</span>
                    )}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-gray-100 bg-white p-3"
            >
              {voiceSupported && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isTyping || isSearching}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition disabled:opacity-50 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 text-primary hover:bg-green-50 hover:text-green-700'
                  }`}
                  aria-label={isListening ? 'Stop listening' : 'Speak your message'}
                  title={isListening ? 'Stop' : 'Speak'}
                >
                  <FaMicrophone className="h-4 w-4" />
                </button>
              )}

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="min-w-0 flex-1 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-text-dark transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                aria-label="Type your message"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping || isSearching}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-white transition hover:bg-secondary-dark active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <FaPaperPlane className="h-3.5 w-3.5" />
              </button>
            </form>

            {speechError && (
              <p className="px-3 pb-2 text-center text-[11px] text-red-600" role="alert">
                {speechError}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
