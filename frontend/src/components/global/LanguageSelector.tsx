'use client';

import { Globe } from 'lucide-react';
import { i18n, Locale } from '@/i18n.config';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface LanguageSelectorProps {
  collapse: boolean;
  locale: Locale;
}

export default function LanguageSelector({
  collapse,
  locale,
}: LanguageSelectorProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getRedirectPathName = (loc: string) => {
    if (!pathname) return '/';

    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
      if (loc === i18n.defaultLocale) return pathname;
      return `/${loc}${pathname}`;
    }
    if (loc === i18n.defaultLocale) {
      const segments = pathname.split('/');
      const isHome = segments.length === 2;
      if (isHome) return '/';

      segments.splice(1, 1);
      return segments.join('/');
    }

    const segments = pathname.split('/');
    segments[1] = loc;
    return segments.join('/');
  };

  const setLocaleAndNavigate = (loc: string) => {
    // Set the cookie for locale preference
    document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000`;

    const newPath = getRedirectPathName(loc);

    // Use Next.js router for navigation
    router.push(newPath);

    // Optional: Use router.refresh() to ensure the locale change is fully applied
    // This might be needed depending on your i18n setup
    router.refresh();
  };

  return (
    <Popover>
      <PopoverTrigger asChild className='p-4'>
        <Button
          variant={'default'}
          className='flex items-center justify-between w-full hover:cursor-pointer p-5'
        >
          <p
            className={`text-white transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden ${
              collapse ? 'opacity-0 w-0' : 'opacity-100 w-auto'
            }`}
          >
            {locale === Locale.EN ? 'English' : '日本語'}
          </p>
          <Globe className='-ml-2 h-5 w-5' />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='w-full min-w-40'
        align='end'
        side='right'
        sideOffset={10}
      >
        <div className='flex flex-col items-start space-y-2 w-full'>
          {i18n.locales.map((lang) => (
            <Button
              key={lang}
              variant={'link'}
              className={`justify-start w-full hover:no-underline ${
                lang === locale ? 'bg-neutral-200' : ''
              }`}
              onClick={() => setLocaleAndNavigate(lang)}
            >
              {lang === Locale.EN ? 'English' : '日本語'}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
