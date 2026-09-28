import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'modern-villa',
    title: 'Modern Villa Design',
    category: 'residential',
    location: 'Kathmandu',
    image: '/images/project-1.svg',
    alt: 'Modern Villa Design — residential project in Kathmandu',
  },
  {
    id: 'office-complex',
    title: 'Office Complex',
    category: 'commercial',
    location: 'Lalitpur',
    image: '/images/project-2.svg',
    alt: 'Office Complex project in Lalitpur',
  },
  {
    id: 'bridge-supervision',
    title: 'Bridge Supervision',
    category: 'infrastructure',
    location: 'Chitwan',
    image: '/images/project-3.svg',
    alt: 'Bridge supervision project in Chitwan',
  },
  {
    id: 'government-housing',
    title: 'Government Housing',
    category: 'government',
    location: 'Pokhara',
    image: '/images/project-1.svg',
    alt: 'Government housing project in Pokhara',
  },
];
