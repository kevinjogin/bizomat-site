import { BRAND, PLATFORM_LINKS, platformLinkProps } from '../../lib/brand';
import { BrandMark } from '../ui/Icon';

type Link = { readonly label: string; readonly href: string; readonly title: string };

function LinkList({ links, label }: { links: readonly Link[]; label: string }) {
  return (
    <ul aria-label={label}>
      {links.map((l) => (
        <li key={l.href}>
          <a {...platformLinkProps(l.href)} title={l.title}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Sidebar footer: "Part of the BIZOMAT platform" with the platform's products and legal pages (same tab). */
export function PlatformFooter() {
  return (
    <div className="brand-foot">
      <div className="brand-foot-line">
        <BrandMark size={16} /> <span>Part of the <strong>{BRAND.platform}</strong> platform</span>
      </div>
      <nav className="platform-links" aria-label={`${BRAND.platform} platform`}>
        <LinkList links={PLATFORM_LINKS.products} label="Platform" />
        <LinkList links={PLATFORM_LINKS.legal} label="Legal" />
      </nav>
    </div>
  );
}

/** Legal links of the platform (Privacy, Terms, Disclaimer), for the sign-in pages and the privacy notice. */
export function PlatformLegalLinks() {
  return (
    <nav aria-label={`${BRAND.platform} legal`}>
      <LinkList links={PLATFORM_LINKS.legal} label="Legal" />
    </nav>
  );
}
