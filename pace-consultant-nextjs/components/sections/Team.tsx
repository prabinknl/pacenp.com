'use client';

import Link from 'next/link';
import { HiMail } from 'react-icons/hi';
import { FaLinkedinIn } from 'react-icons/fa';
import { teamMembers } from '@/lib/data/team';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function Team() {
  return (
    <section aria-labelledby="team-heading" className="bg-gray-50 py-24">
      <div className="container-pace">
        <SectionHeader
          label="Our Team"
          title="Meet the Experts Behind Our Success"
          titleId="team-heading"
          subtitle="A multidisciplinary team of licensed engineers, architects, and project specialists — united by a shared commitment to safe, standards-compliant design nationally and internationally."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.id}
              className="rounded-lg bg-white p-7 text-center shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                {member.initials}
              </div>
              <h3 className="font-heading text-lg font-semibold text-primary">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-secondary">{member.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>
              <hr className="my-5 border-primary/10" />
              <div className="flex items-center justify-center gap-3">
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
                  >
                    <FaLinkedinIn className="h-4 w-4" />
                  </a>
                ) : null}
                <a
                  href={`mailto:${member.email}`}
                  aria-label={`Email ${member.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
                >
                  <HiMail className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-lg bg-primary px-8 py-8 text-center text-white md:flex-row md:text-left">
          <p className="font-heading text-lg font-semibold">
            We&apos;re always looking for talented engineers.
          </p>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center rounded bg-secondary px-6 py-3 font-heading text-sm font-semibold text-white transition hover:bg-secondary-dark"
          >
            See Open Positions
          </Link>
        </div>
      </div>
    </section>
  );
}
