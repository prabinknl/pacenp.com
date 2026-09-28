'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowDown, HiArrowRight } from 'react-icons/hi';
import { heroContent, heroStats } from '@/lib/data/site';
import { scrollToSection } from '@/lib/utils/helpers';

/** Stagger container for hero children */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

/** Fade-up item animation */
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * Full-viewport hero section with gradient background,
 * Framer Motion entrance animations, and floating stats bar.
 */
export function Hero() {
  const handleScrollTo = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId, 96);
  };

  return (
    <section
      id="home"
      aria-label="Hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-36 pb-28 text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(13, 33, 55, 0.8) 0%, rgba(26, 60, 94, 0.7) 100%), url('/images/hero-bg.png')`,
      }}
    >
      {/* Decorative particles (Option B pattern) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border-2 border-white/20 bg-white/5"
            style={{
              width: 40 + i * 15,
              height: 40 + i * 15,
              top: `${10 + i * 12}%`,
              left: i % 2 === 0 ? `${5 + i * 3}%` : undefined,
              right: i % 2 !== 0 ? `${5 + i * 2}%` : undefined,
            }}
            animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Centered content */}
      <motion.div
        className="container-pace relative z-10 flex flex-col items-center text-center"
        variants={containerVariants}
        initial={false}
        animate="visible"
      >
        <motion.span
          variants={itemVariants}
          className="mb-5 inline-block rounded-full border border-white/25 bg-white/10 px-4 py-2 font-sans text-sm font-medium uppercase tracking-[0.15em] backdrop-blur-sm"
        >
          {heroContent.badge}
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="font-heading text-lg font-semibold leading-snug tracking-[0.06em] text-green-400 md:text-xl lg:text-2xl max-w-3xl text-balance"
        >
          {heroContent.title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-2xl text-xl font-medium leading-relaxed text-white md:text-2xl"
        >
          {heroContent.subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href={heroContent.ctaPrimary.href}
            onClick={(e) => handleScrollTo(e, 'services')}
            className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded px-7 py-3.5 font-heading text-base font-bold text-primary-dark bg-secondary transition hover:bg-secondary-dark hover:-translate-y-0.5"
          >
            {heroContent.ctaPrimary.label}
            <HiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href={heroContent.ctaSecondary.href}
            className="inline-flex min-w-[200px] items-center justify-center rounded border-2 border-white px-7 py-3.5 font-heading text-base font-bold text-white transition hover:bg-white/10 hover:-translate-y-0.5"
          >
            {heroContent.ctaSecondary.label}
          </Link>
          <Link
            href="/check-email"
            className="inline-flex min-w-[200px] items-center justify-center rounded border-2 border-white px-7 py-3.5 font-heading text-base font-bold text-white transition hover:bg-white/10 hover:-translate-y-0.5"
            aria-label="Check email client"
          >
            CHECK EMAIL
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#services"
        onClick={(e) => handleScrollTo(e, 'services')}
        aria-label="Scroll to services section"
        className="absolute bottom-36 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/75 transition hover:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.span
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HiArrowDown className="h-6 w-6" aria-hidden="true" />
        </motion.span>
        <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
      </motion.a>

      {/* Floating stats bar */}
      <motion.div
        className="absolute bottom-0 left-1/2 z-20 w-full max-w-container -translate-x-1/2 translate-y-1/2 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: '50%' }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
      >
        <div className="flex flex-wrap items-stretch justify-between gap-2 rounded-lg bg-white px-6 py-5 shadow-card md:flex-nowrap md:px-8">
          {heroStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-center min-w-[100px] ${
                index < heroStats.length - 1 ? 'md:border-r md:border-primary/10' : ''
              }`}
            >
              <strong className="font-heading text-2xl font-bold text-secondary md:text-[1.65rem]">
                {stat.value}
              </strong>
              <span className="font-sans text-sm text-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
