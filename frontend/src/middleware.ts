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
    // console.error('Error getting languages from headers:', error);
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
    // console.error('Error matching locale:', error);
    return defaultLocale; // Fallback to default locale if matching fails
  }
}

// These are the *unlocalized* base paths that are protected.
const PROTECTED_UNLOCALIZED_PATHS = ['/', '/books', '/my_books'];

// --- Placeholder for Authentication Check ---
function isAuthenticated(): boolean { 
  // TODO: Replace this with actual check logic.
  // When Spring Boot successfully authenticates, it sets a session cookie (usually JSESSIONID).
  // Check for the presence of the session cookie to simulate being signed in.
  // For example: return request.cookies.has('JSESSIONID');
  
  // Currently simulates being unauthenticated to enforce the redirect to /login.
  return false; 
}


export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let resolvedLocale = getLocale(request) || i18n.defaultLocale;
  
  // --- 1. Handle Locale Prefixing ---
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // If locale is missing, rewrite to the localized path
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = `/${resolvedLocale}${pathname}`;
    
    const response = (resolvedLocale === i18n.defaultLocale)
      ? NextResponse.rewrite(newUrl) // Rewrite internally for default locale
      : NextResponse.redirect(newUrl); // Redirect for non-default locale
      
    response.headers.set('x-pathname', pathname);
    return response;
  }
  
  // Extract the current locale from the path
  const segments = pathname.split('/').filter(Boolean);
  resolvedLocale = segments[0] as string;
  
  // Get the path *without* the locale prefix (e.g., '/en/books' -> '/books')
  const unlocalizedPath = pathname.replace(`/${resolvedLocale}`, '') || '/';


  // --- 2. Handle Authentication Gate ---
  const isAuthPath = unlocalizedPath === '/login' || unlocalizedPath === '/signup';
  
  // Check if the unlocalized path is one of the protected routes (or starts with one)
  const isProtectedPath = PROTECTED_UNLOCALIZED_PATHS.includes(unlocalizedPath) || 
                          PROTECTED_UNLOCALIZED_PATHS.some(path => unlocalizedPath.startsWith(path + '/'));

  const loginUrl = `/${resolvedLocale}/login`;
  const homeUrl = `/${resolvedLocale}/`;

  if (isAuthenticated()) {
    // User IS authenticated: If they try to access /login or /signup, redirect them to home.
    if (isAuthPath) {
      return NextResponse.redirect(new URL(homeUrl, request.url));
    }
  } else {
    // User IS NOT authenticated: If they try to access any protected dashboard route, redirect them to login.
    if (isProtectedPath) { // Check if path is protected (covers root URL /)
      // Check if they are already on the login page to prevent infinite redirects
      if (!isAuthPath) { 
        return NextResponse.redirect(new URL(loginUrl, request.url));
      }
    }
  }

  // If the path is not protected or the user is in the correct state, proceed.
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

// Config to ignore specific paths like /api and static files
export const config = {
  matcher:
    '/((?!api|static|.*\\..*|_next|sitemap.xml|robots.txt|favicon.ico).*)',
};
