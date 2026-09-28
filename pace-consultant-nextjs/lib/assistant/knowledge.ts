import { aboutHighlights, aboutMiniStats, aboutMvCards } from '@/lib/data/about';
import { internationalClients, nationalClients } from '@/lib/data/clients';
import { projects } from '@/lib/data/projects';
import { services } from '@/lib/data/services';
import { heroContent, siteConfig } from '@/lib/data/site';

export type KnowledgeSnippet = {
  source: 'site' | 'services' | 'projects' | 'clients' | 'about';
  title: string;
  text: string;
  score: number;
};

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pacenp.com';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function scoreText(queryTokens: string[], text: string): number {
  const haystack = text.toLowerCase();
  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(token)) score += 2;
  }

  const phrase = queryTokens.join(' ');
  if (phrase.length > 4 && haystack.includes(phrase)) score += 5;

  return score;
}

function buildEntries(): { source: KnowledgeSnippet['source']; title: string; text: string }[] {
  const entries: { source: KnowledgeSnippet['source']; title: string; text: string }[] = [
    {
      source: 'site',
      title: siteConfig.legalName,
      text: `${siteConfig.legalName} (${siteConfig.name}) — ${siteConfig.tagline}. Founded ${siteConfig.founded}. Phone: ${siteConfig.phone.office}, ${siteConfig.phone.mobile}. Email: ${siteConfig.email}. Office: ${siteConfig.address.street}, ${siteConfig.address.city}. Website: ${SITE_BASE}. ${heroContent.subtitle}`,
    },
    {
      source: 'about',
      title: 'About PACE',
      text: `${aboutHighlights.join('. ')}. Stats: ${aboutMiniStats.map((s) => `${s.label} ${s.value}`).join(', ')}.`,
    },
    ...aboutMvCards.map((card) => ({
      source: 'about' as const,
      title: card.title,
      text: card.text,
    })),
    ...services.map((service) => ({
      source: 'services' as const,
      title: service.title,
      text: service.description,
    })),
    ...projects.map((project) => ({
      source: 'projects' as const,
      title: project.title,
      text: `${project.title} — ${project.category} project in ${project.location}.`,
    })),
    ...[...internationalClients, ...nationalClients].slice(0, 30).map((client) => ({
      source: 'clients' as const,
      title: client.name,
      text: `Client: ${client.name} (${client.type}).`,
    })),
  ];

  return entries;
}

export function searchLocalKnowledge(query: string, limit = 5): KnowledgeSnippet[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  return buildEntries()
    .map((entry) => ({
      ...entry,
      score: scoreText(queryTokens, `${entry.title} ${entry.text}`),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
