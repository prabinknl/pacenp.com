import Image from 'next/image';
import { HiLocationMarker } from 'react-icons/hi';
import { projects } from '@/lib/data/projects';
import { SectionHeader } from '@/components/ui/SectionHeader';

const categoryLabels: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  infrastructure: 'Infrastructure',
  government: 'Government',
};

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-24 py-24">
      <div className="container-pace">
        <SectionHeader
          label="Our Work"
          title="Featured Projects"
          titleId="projects-heading"
          subtitle="Delivering excellence nationally and internationally"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-lg bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <span className="absolute left-3 top-3 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-white">
                  {categoryLabels[project.category]}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-primary">{project.title}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                  <HiLocationMarker className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                  {project.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
