'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HiCheck } from 'react-icons/hi';
import { aboutHighlights, aboutMiniStats, aboutMvCards } from '@/lib/data/about';
import { scrollToSection } from '@/lib/utils/helpers';

export function About() {
  const handleScroll = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId, 80);
  };

  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 bg-white pt-24 pb-12">
      <div className="container-pace">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
              About Us
            </p>
            <h2
              id="about-heading"
              className="font-heading text-3xl font-bold text-primary md:text-4xl text-balance"
            >
              Two Decades of Engineering Excellence in Nepal
            </h2>

            <p className="mt-5 text-base leading-relaxed text-muted">
              <strong className="text-primary">PACE Consultant (P). Ltd.</strong> is a Kathmandu-based
              engineering consultancy established in 2001, specializing in architectural design and
              infrastructure supervision. For more than two decades, we have partnered with developers,
              institutions, and government agencies to deliver technically sound, buildable solutions
              nationally and internationally.
            </p>

            <p className="mt-4 text-base leading-relaxed text-muted">
              Our work is guided by Nepal&apos;s building codes, seismic design standards, and practical site
              realities. We combine rigorous engineering with clear documentation and responsive project
              support.
            </p>

            <ul className="mt-6 space-y-3">
              {aboutHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-primary">
                  <HiCheck className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/#services"
                onClick={(e) => handleScroll(e, 'services')}
                className="inline-flex items-center justify-center rounded bg-secondary px-6 py-3 font-heading text-sm font-semibold text-white transition hover:bg-secondary-dark"
              >
                Our Services
              </Link>
              <Link
                href="/contact#team"
                className="inline-flex items-center justify-center rounded border-2 border-primary px-6 py-3 font-heading text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Meet Our Team
              </Link>
            </div>
          </div>

          <div>
            <div className="relative overflow-hidden rounded-lg bg-primary/5 shadow-card">
              <Image
                src="/images/about-office.jpg"
                alt="PACE Consultant engineering team reviewing architectural plans"
                width={600}
                height={400}
                className="h-auto w-full object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded bg-secondary px-4 py-2 font-heading text-sm font-semibold text-white">
                20+ Years of Trust
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {aboutMiniStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-primary/10 bg-gray-50 px-4 py-5 text-center"
                >
                  <span className="block text-xs font-medium uppercase tracking-wide text-muted">
                    {stat.label}
                  </span>
                  <strong className="mt-1 block font-heading text-2xl font-bold text-secondary">
                    {stat.value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {aboutMvCards.map((card) => (
            <article
              key={card.id}
              className="rounded-lg border border-primary/10 bg-gray-50 p-7 shadow-card"
            >
              <h3 className="font-heading text-xl font-semibold text-primary">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
