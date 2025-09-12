'use client';
import { Locale } from '@/i18n.config';
import { usePathname } from 'next/navigation';
import CustomLink from './CustomLink';

interface SidebarLinkProps {
  link: {
    name: string;
    href: string;
    icon: React.ReactNode;
  };
  collapse?: boolean;
  locale: Locale;
}

export default function SidebarLink({
  link,
  collapse,
  locale,
}: SidebarLinkProps) {
  const pathname = usePathname();
  const normalizePathname = (path: string): string => {
    if (path === '/') return '/';

    const localePrefix = `/${locale}`;
    if (path.startsWith(localePrefix)) {
      const withoutLocale = path.slice(localePrefix.length);
      return withoutLocale || '/';
    }

    return path;
  };

  const normalizeLinkHref = (href: string): string => {
    if (href === '/') return '/';

    const localePrefix = `/${locale}`;
    if (href.startsWith(localePrefix)) {
      const withoutLocale = href.slice(localePrefix.length);
      return withoutLocale || '/';
    }

    return href;
  };

  const normalizedPathname = normalizePathname(pathname);
  const normalizedLinkHref = normalizeLinkHref(link.href);

  const isActive = (() => {
    if (normalizedPathname === normalizedLinkHref) {
      return true;
    }

    if (
      normalizedLinkHref === '/' &&
      normalizedPathname.startsWith('/books/')
    ) {
      return true;
    }

    if (
      normalizedLinkHref !== '/' &&
      normalizedPathname.startsWith(normalizedLinkHref)
    ) {
      const remainder = normalizedPathname.slice(normalizedLinkHref.length);
      return remainder === '' || remainder.startsWith('/');
    }

    return false;
  })();

  return (
    <CustomLink
      locale={locale}
      href={link.href}
      className={`flex items-center justify-start space-x-3 p-2 rounded-sm ${
        isActive
          ? 'bg-secondary border font-medium border-primary/60'
          : 'font-normal'
      }`}
    >
      <div>{link.icon}</div>
      <p className={`${collapse ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
        {link.name}
      </p>
    </CustomLink>
  );
}
