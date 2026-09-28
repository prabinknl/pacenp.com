export type WebSnippet = {
  source: 'pacenp.com' | 'web';
  title: string;
  text: string;
  url?: string;
};

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pacenp.com';
const PACENP_PATHS = ['/', '/projects/', '/contact/'];
const FETCH_TIMEOUT_MS = 6000;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractRelevantParagraphs(text: string, query: string, limit = 3): string[] {
  const queryTokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);

  const chunks = text
    .split(/(?<=[.!?।])\s+/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 40);

  const scored = chunks
    .map((chunk) => {
      const lower = chunk.toLowerCase();
      let score = 0;
      for (const token of queryTokens) {
        if (lower.includes(token)) score += 2;
      }
      if (/pace|consultant|engineering|architect|nepal|project|service/i.test(chunk)) score += 1;
      return { chunk, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    return scored.slice(0, limit).map((item) => item.chunk);
  }

  return chunks.slice(0, limit);
}

async function fetchWithTimeout(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PACE-Assistant/1.0 (+https://pacenp.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function searchPacenpSite(query: string): Promise<WebSnippet[]> {
  const results: WebSnippet[] = [];

  await Promise.all(
    PACENP_PATHS.map(async (path) => {
      const url = `${SITE_BASE}${path}`;
      const html = await fetchWithTimeout(url);
      if (!html) return;

      const plain = stripHtml(html);
      const paragraphs = extractRelevantParagraphs(plain, query, 2);
      if (paragraphs.length === 0) return;

      const label = path === '/' ? 'Home' : path.replace(/\//g, ' ').trim() || 'Home';
      results.push({
        source: 'pacenp.com',
        title: `pacenp.com — ${label}`,
        text: paragraphs.join(' '),
        url,
      });
    })
  );

  return results;
}

type DuckDuckGoTopic = {
  Text?: string;
  FirstURL?: string;
};

type DuckDuckGoResponse = {
  AbstractText?: string;
  Heading?: string;
  RelatedTopics?: Array<DuckDuckGoTopic | { Topics?: DuckDuckGoTopic[] }>;
};

function flattenDuckTopics(
  topics: DuckDuckGoResponse['RelatedTopics'] = []
): DuckDuckGoTopic[] {
  const flat: DuckDuckGoTopic[] = [];

  for (const topic of topics) {
    if ('Topics' in topic && Array.isArray(topic.Topics)) {
      flat.push(...topic.Topics);
      continue;
    }
    flat.push(topic as DuckDuckGoTopic);
  }

  return flat;
}

export async function searchWeb(query: string): Promise<WebSnippet[]> {
  const results: WebSnippet[] = [];
  const scopedQuery = `${query} PACE Consultant Nepal site:pacenp.com OR engineering consultancy Kathmandu`;

  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(scopedQuery)}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) return results;

    const data = (await response.json()) as DuckDuckGoResponse;

    if (data.AbstractText) {
      results.push({
        source: 'web',
        title: data.Heading || 'Web search',
        text: data.AbstractText,
      });
    }

    for (const topic of flattenDuckTopics(data.RelatedTopics).slice(0, 4)) {
      if (!topic.Text) continue;
      results.push({
        source: 'web',
        title: 'Web search',
        text: topic.Text,
        url: topic.FirstURL,
      });
    }
  } catch {
    // Web search is best-effort; local knowledge still answers.
  }

  return results;
}

export async function gatherSearchResults(query: string) {
  const [pacenp, web] = await Promise.all([searchPacenpSite(query), searchWeb(query)]);
  return { pacenp, web };
}
