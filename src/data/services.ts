// Engineering and technical project categories offered in the contact form (src/components/ContactForm.astro).
// Their values match SERVICES in src/lib/contact.ts, so links with ?service=<slug> from the Engine Room's case studies
// preselect the right one.
export const SERVICE_OPTIONS = [
  { value: 'Engineering / CAD', slug: 'engineering-cad' },
  { value: 'Manufacturing Support', slug: 'manufacturing' },
  { value: 'Operations Improvement', slug: 'operations' },
  { value: 'Project Support', slug: 'project-support' },
  { value: 'Factory Fix', slug: 'factory-fix' },
  { value: 'Ongoing Support', slug: 'ongoing-support' },
  { value: 'Other', slug: 'other' },
] as const;
