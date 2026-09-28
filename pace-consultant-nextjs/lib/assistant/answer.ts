import type { AssistantLanguage } from '@/lib/data/assistant-i18n';
import { getBotResponse } from '@/lib/data/assistant-i18n';
import { searchLocalKnowledge, type KnowledgeSnippet } from '@/lib/assistant/knowledge';
import { buildAssistantSystemPrompt, buildAssistantUserMessage } from '@/lib/assistant/prompt';
import { gatherSearchResults, type WebSnippet } from '@/lib/assistant/web-search';
import { siteConfig } from '@/lib/data/site';

export type AssistantHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

function trimToConversationalLength(text: string, maxLen = 320): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLen) return cleaned;

  const sentences = cleaned.match(/[^.!?।]+[.!?।]?/g) ?? [cleaned];
  let result = '';

  for (const sentence of sentences) {
    const next = result ? `${result} ${sentence.trim()}` : sentence.trim();
    if (next.length > maxLen) break;
    result = next;
  }

  return result || cleaned.slice(0, maxLen).trim();
}

function buildContextBlock(
  local: KnowledgeSnippet[],
  pacenp: WebSnippet[],
  web: WebSnippet[]
): string {
  const lines: string[] = [];

  for (const item of local.slice(0, 4)) {
    lines.push(`[${item.source}] ${item.title}: ${item.text}`);
  }
  for (const item of pacenp.slice(0, 2)) {
    lines.push(`[pacenp.com] ${item.title}: ${item.text}`);
  }
  for (const item of web.slice(0, 2)) {
    lines.push(`[web] ${item.title}: ${item.text}`);
  }

  return lines.join('\n');
}

function composeFallbackAnswer(
  query: string,
  lang: AssistantLanguage,
  local: KnowledgeSnippet[],
  pacenp: WebSnippet[]
): string {
  const keywordAnswer = getBotResponse(query, lang);
  const topLocal = local[0];
  const topPacenp = pacenp[0];

  if (topLocal) {
    return trimToConversationalLength(topLocal.text.slice(0, 240));
  }

  if (topPacenp) {
    return trimToConversationalLength(topPacenp.text.slice(0, 240));
  }

  return keywordAnswer;
}

async function generateWithOpenRouter(
  query: string,
  lang: AssistantLanguage,
  context: string,
  history: AssistantHistoryItem[]
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENROUTER_CHAT_MODEL ?? 'openai/gpt-4o-mini';

  const messages = [
    {
      role: 'system' as const,
      content: buildAssistantSystemPrompt(lang),
    },
    ...history.slice(-6).map((item) => ({
      role: item.role,
      content: item.content,
    })),
    {
      role: 'user' as const,
      content: buildAssistantUserMessage(query, context),
    },
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json; charset=utf-8',
        'HTTP-Referer': siteConfig.url,
        'X-Title': 'PACE Assistant',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 220,
        temperature: 0.35,
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    return content ? trimToConversationalLength(content, 400) : null;
  } catch {
    return null;
  }
}

export async function generateAssistantAnswer(
  query: string,
  _preferredLang?: AssistantLanguage,
  history: AssistantHistoryItem[] = []
): Promise<{ answer: string; language: AssistantLanguage }> {
  const trimmed = query.trim();
  const lang: AssistantLanguage = 'en';

  if (!trimmed) {
    return {
      language: lang,
      answer: 'Go ahead — what would you like to know?',
    };
  }

  const local = searchLocalKnowledge(trimmed, 6);
  const { pacenp, web } = await gatherSearchResults(trimmed);
  const context = buildContextBlock(local, pacenp, web);

  const aiAnswer = await generateWithOpenRouter(trimmed, lang, context, history);
  if (aiAnswer) {
    return { answer: aiAnswer, language: lang };
  }

  return {
    answer: composeFallbackAnswer(trimmed, lang, local, pacenp),
    language: lang,
  };
}
