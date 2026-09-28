'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { navLinks } from '@/lib/data/site';
import { cn, scrollToSection } from '@/lib/utils/helpers';

const SCROLL_THRESHOLD = 80;
const NAVBAR_HEIGHT = 96;

/**
 * Sticky navbar with scroll shadow, mobile menu, and scroll-spy active states.
 * Client component — requires scroll & intersection observers.
 */
export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [pathname]);


  /* Scroll effect: compact navbar with shadow */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Scroll Spy — highlight active nav link on homepage based on scroll position */
  useEffect(() => {
    if (!isHome) return;

    const sectionIds = ['home', 'about', 'services'];
    const sections = Array.from(document.querySelectorAll('section[id]')).filter((s) =>
      sectionIds.includes(s.id)
    ) as HTMLElement[];

    if (!sections.length) return;

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + NAVBAR_HEIGHT + 40; // Navbar height + scroll offset buffer
      let currentSection = 'home';

      for (const section of sections) {
        if (scrollPosition >= section.offsetTop) {
          currentSection = section.id;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy(); // Run initially

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [isHome]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId?: string, href?: string) => {
      if (isHome && sectionId) {
        e.preventDefault();
        scrollToSection(sectionId, NAVBAR_HEIGHT);
        setIsMobileOpen(false);
      } else if (href && href.startsWith('/contact')) {
        setTimeout(() => {
          window.dispatchEvent(new Event('hashchange'));
        }, 0);
        setIsMobileOpen(false);
      }
    },
    [isHome]
  );

  return (
    <header
      role="banner"
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-primary/10 bg-white transition-all duration-300',
        isScrolled && 'border-transparent shadow-card'
      )}
    >
      <div
        className={cn(
          'container-pace relative flex items-center justify-between gap-6 transition-all duration-300',
          isScrolled ? 'min-h-[80px] md:min-h-[96px]' : 'min-h-[100px] md:min-h-[140px]'
        )}
      >
        {/* Brand */}
        <Link
          href="/#home"
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center transition-all duration-300 shrink-0"
          aria-label={`${navLinks[0].label} — PACE Consultant home`}
        >
          <img
            src="/images/logo-with-name.png"
            alt="PACE Consultant (P). Ltd. Logo"
            className={cn(
              'w-auto object-contain transition-all duration-300',
              isScrolled ? 'h-16 md:h-20' : 'h-20 md:h-28'
            )}
          />
        </Link>

        {/* Desktop Navigation (Centered in remaining space) */}
        <nav className="hidden md:flex items-center justify-center flex-1" aria-label="Primary navigation">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const [linkPath, linkHash] = link.href.split('#');
              let isActive = false;
              if (isHome) {
                isActive = activeSection === link.sectionId;
              } else {
                if (pathname === linkPath) {
                  if (linkHash) {
                    isActive = hash === `#${linkHash}`;
                  } else {
                    isActive = !hash || hash === '#contact';
                  }
                }
              }
              const isContactLink = link.href.startsWith('/contact');
              return (
                <li key={link.label}>
                  {isContactLink ? (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.sectionId, link.href)}
                      className={cn(
                        'relative block whitespace-nowrap px-3.5 py-2 font-heading text-base font-semibold transition-colors duration-300',
                        isActive ? 'text-secondary' : 'text-primary hover:text-secondary',
                        /* Underline animation */
                        'after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-secondary after:transition-transform after:duration-300',
                        'hover:after:scale-x-100',
                        isActive && 'after:scale-x-100'
                      )}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.sectionId, link.href)}
                      className={cn(
                        'relative block whitespace-nowrap px-3.5 py-2 font-heading text-base font-semibold transition-colors duration-300',
                        isActive ? 'text-secondary' : 'text-primary hover:text-secondary',
                        /* Underline animation */
                        'after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-secondary after:transition-transform after:duration-300',
                        'hover:after:scale-x-100',
                        isActive && 'after:scale-x-100'
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop CTA (Right) */}
        <Link
          href="/contact"
          onClick={() => setIsMobileOpen(false)}
          className="hidden md:inline-block rounded px-6 py-3 font-heading text-base font-bold text-primary-dark bg-secondary transition hover:bg-secondary-dark hover:scale-[1.02]"
        >
          Get a Quote
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded text-primary md:hidden"
          aria-expanded={isMobileOpen}
          aria-controls="navbar-menu"
          aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMobileOpen((o) => !o)}
        >
          {isMobileOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </button>

        {/* Mobile Dropdown Menu */}
        <div
          id="navbar-menu"
          className={cn(
            'md:hidden',
            /* Mobile dropdown styles */
            'absolute left-0 right-0 top-full overflow-hidden bg-white shadow-lg transition-all duration-400',
            isMobileOpen
              ? 'max-h-[480px] opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          )}
        >
          <nav className="py-2" aria-label="Mobile navigation">
            <ul className="flex flex-col">
              {navLinks.map((link) => {
                const [linkPath, linkHash] = link.href.split('#');
                let isActive = false;
                if (isHome) {
                  isActive = activeSection === link.sectionId;
                } else {
                  if (pathname === linkPath) {
                    if (linkHash) {
                      isActive = hash === `#${linkHash}`;
                    } else {
                      isActive = !hash || hash === '#contact';
                    }
                  }
                }
                const isContactLink = link.href.startsWith('/contact');
                return (
                  <li key={link.label}>
                    {isContactLink ? (
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.sectionId, link.href)}
                        className={cn(
                          'block px-6 py-3 font-heading text-base font-semibold transition-colors duration-300',
                          isActive ? 'text-secondary' : 'text-primary hover:text-secondary'
                        )}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.sectionId, link.href)}
                        className={cn(
                          'block px-6 py-3 font-heading text-base font-semibold transition-colors duration-300',
                          isActive ? 'text-secondary' : 'text-primary hover:text-secondary'
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/contact"
            onClick={() => setIsMobileOpen(false)}
            className="my-3 mx-6 block rounded px-6 py-3 text-center font-heading text-base font-bold text-primary-dark bg-secondary transition hover:bg-secondary-dark"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
