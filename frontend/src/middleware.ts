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

/**
 * Check if user is authenticated by verifying auth token in cookies
 */
function isAuthenticated(request: NextRequest): boolean {
  const authToken = request.cookies.get('auth_token');
  const sessionToken = request.cookies.get('session_token');
  
  // Check for either auth_token or session_token
  // You can customize this based on your authentication mechanism
  return !!(authToken || sessionToken);
}

/**
 * Extract locale from pathname
 */
function extractLocale(pathname: string): string | null {
  const localeRegex = new RegExp(`^/(${i18n.locales.join('|')})`);
  const match = pathname.match(localeRegex);
  return match ? match[1] : null;
}

/**
 * Get pathname without locale prefix
 */
function getPathnameWithoutLocale(pathname: string): string {
  const locale = extractLocale(pathname);
  if (locale) {
    return pathname.replace(`/${locale}`, '') || '/';
  }
  return pathname;
}

/**
 * Check if path is a public route (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
  const pathWithoutLocale = getPathnameWithoutLocale(pathname);
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];

  // Check if path starts with any public route
  return publicRoutes.some(route => pathWithoutLocale.startsWith(route));
}

/**
 * Check if path is a protected route (requires authentication)
 * By default, all routes are protected except explicitly public ones
 */
function isProtectedRoute(pathname: string): boolean {
  const pathWithoutLocale = getPathnameWithoutLocale(pathname);
  
  // If it's a public route, it's not protected
  if (isPublicRoute(pathname)) {
    return false;
  }
  
  // All other routes (dashboard routes, home, etc.) are protected by default
  // This includes: /, /my_books, /books, /profile, /settings, etc.
  return true;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authenticated = isAuthenticated(request);
  const locale = extractLocale(pathname) || getLocale(request) || i18n.defaultLocale;
  const pathWithoutLocale = getPathnameWithoutLocale(pathname);
  const isPublic = isPublicRoute(pathname);
  const isProtected = isProtectedRoute(pathname);

  // Handle locale routing first
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Authentication checks (after locale extraction, before locale routing)
  // If accessing a protected route without authentication, redirect to login
  if (isProtected && !authenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated user tries to access auth pages (login, signup), redirect to home
  if (authenticated && isPublic) {
    const homeUrl = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Handle locale prefixing
  if (pathnameIsMissingLocale) {
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

  // If path has a locale, continue
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  
  // Add authentication status to headers for server components
  response.headers.set('x-authenticated', authenticated ? 'true' : 'false');
  
  return response;
}

// Config to ignore specific paths like /api and static files
export const config = {
  matcher:
    '/((?!api|static|.*\\..*|_next|sitemap.xml|robots.txt|favicon.ico).*)',
};
