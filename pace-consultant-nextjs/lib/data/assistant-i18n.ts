import { siteConfig } from '@/lib/data/site';

export type AssistantLanguage = 'en' | 'ne';

export const ASSISTANT_LANGUAGES = [{ code: 'en' as const, label: 'English' }];

/** Chat assistant is English-only. */
export function detectLanguage(_text: string, _fallbackLang: AssistantLanguage = 'en'): AssistantLanguage {
  return 'en';
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const DEFAULT_EN =
  "I don't have that detail right now — our team can help. Call us at " +
  siteConfig.phone.office +
  ' or visit the Contact page.';

export function getWelcomeMessage(_lang: AssistantLanguage = 'en'): string {
  return `${getTimeGreeting()}! I'm your PACE assistant. What can I help you with?`;
}

export function getBotResponse(query: string, _lang: AssistantLanguage = 'en'): string {
  const q = query.toLowerCase();

  if (
    /\b(service|services|architect|architecture|structural|engineering|infrastructure|supervision|design)\b/.test(
      q
    )
  ) {
    return 'We handle architectural design, structural engineering, and construction supervision nationally and internationally. Which service are you interested in?';
  }

  if (/\b(project|projects|work|portfolio|experience)\b/.test(q)) {
    return "We've delivered 200+ projects since 2001. Browse the Projects section to see our work.";
  }

  if (/\b(contact|email|phone|address|location|office|reach)\b/.test(q)) {
    return `Reach us at ${siteConfig.phone.office} or ${siteConfig.email}. More on the Contact page.`;
  }

  return DEFAULT_EN;
}
