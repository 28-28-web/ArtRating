import createMiddleware from 'next-intl/middleware';
import { auth as authMiddleware } from "@/auth";

// Create next-intl middleware with locale detection
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'bn'],
  
  // Used when no locale matches
  defaultLocale: 'bn',
  
  // Default to Bengali for Bangladesh IP, English for others
  localeDetection: true
});

// Combined middleware that handles both auth and internationalization
export default function middleware(request: any) {
  // First handle auth for protected routes
  if (request.nextUrl.pathname.startsWith('/payout') || 
      request.nextUrl.pathname.startsWith('/admin')) {
    return authMiddleware(request);
  }
  
  // Then handle internationalization
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|_vercel|.*\\..*).*)',
    // Re-include any internal paths that need to be internationalized
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Include auth routes
    '/payout/:path*',
    '/admin/:path*'
  ],
};
