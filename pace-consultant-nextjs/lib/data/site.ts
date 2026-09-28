import type { HeroStat, NavLink, SiteConfig } from '@/types';

/** Global site configuration — single source of truth for contact & brand */
export const siteConfig: SiteConfig = {
  name: 'PACE Consultant',
  legalName: 'PACE Consultant (P). Ltd.',
  tagline: "Strong Foundations for Nepal's Future",
  url: 'https://pacenp.com',
  email: 'paceconsultant@gmail.com',
  phone: {
    office: '+977-1-4720565',
    mobile: '+977-1-4720718',
  },
  address: {
    street: 'Maharajgunj',
    city: 'Kathmandu',
    postalCode: '',
    country: 'NP',
  },
  founded: 2001,
  social: {
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/9779800000000',
  },
};

/** Primary navigation links */
export const navLinks: NavLink[] = [
  { href: '/#home', label: 'Home', sectionId: 'home' },
  { href: '/#about', label: 'About Us', sectionId: 'about' },
  { href: '/#services', label: 'Services', sectionId: 'services' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact#team', label: 'Our Team' },
  { href: '/contact', label: 'Contact Us' },
];

/** Hero floating stats bar */
export const heroStats: HeroStat[] = [
  { value: '20+', label: 'Years' },
  { value: '200+', label: 'Projects' },
  { value: '50+', label: 'Clients' },
  { value: '15+', label: 'Experts' },
];

/** Hero section copy */
export const heroContent = {
  badge: 'Engineering Excellence Since 2001',
  title: "Strong Foundations for Nepal's Future",
  subtitle:
    'Expert Architectural Design & Infrastructure Supervision — Trusted nationally and internationally for over 20 years',
  ctaPrimary: { label: 'Explore Our Services', href: '/#services' },
  ctaSecondary: { label: 'View Our Projects', href: '/projects' },
};
