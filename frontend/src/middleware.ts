import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';
import { i18n } from '@/i18n.config';
import { NextResponse } from 'next/server';

function getLocale(request: NextRequest): string | undefined {
  // First check if a locale is set in cookies (manual selection)
  const cookieLocale = request.cookies.get('NEXT_LOCALE');
  if (cookieLocale) return cookieLocale.value;

  // If no locale is found in the cookies, fallback to browser preferences
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  // Make sure locales are in proper format for matchLocale function
  const locales: string[] = i18n.locales.map((locale) => String(locale));
  const defaultLocale = String(i18n.defaultLocale);

  // Get languages from request headers
  let languages: string[];
  try {
    languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    // Ensure we have valid languages to match against
    if (!languages || languages.length === 0) {
      return defaultLocale;
    }
  } catch (error) {
    console.error('Error getting languages from headers:', error);
    return defaultLocale;
  }

  // Match the best language from the browser's preference
  try {
    // Ensure all inputs are strings
    const locale = matchLocale(
      languages.map((lang) => String(lang)),
      locales,
      defaultLocale
    );
    return locale;
  } catch (error) {
    console.error('Error matching locale:', error);
    return defaultLocale; // Fallback to default locale if matching fails
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the path is missing the locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // Get the locale (from cookie or fallback to browser preferences)
    const locale = getLocale(request) || i18n.defaultLocale;

    // For default locale, rewrite internally (don't redirect)
    if (locale === i18n.defaultLocale) {
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = `/${i18n.defaultLocale}${pathname}`;
      const response = NextResponse.rewrite(newUrl);
      response.headers.set('x-pathname', pathname);
      return response;
    }

    // For non-default locales, redirect to the localized URL
    request.nextUrl.pathname = `/${locale}${
      pathname.startsWith('/') ? '' : '/'
    }${pathname}`;
    const response = NextResponse.redirect(request.nextUrl);
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // If path has a locale, just continue
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

// Config to ignore specific paths like /api and static files
export const config = {
  matcher:
    '/((?!api|static|.*\\..*|_next|sitemap.xml|robots.txt|favicon.ico).*)',
};
