import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isAdminSession } from '@/server/features';
import { getUserProfileStatus } from '@/server/features/auth/getUserProfileStatus';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Global security headers
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Admin-only route protection
  if (pathname.startsWith('/admin')) {
    if (!session) {
      // User not connected, redirect to login
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    } else if (!(await isAdminSession())) {
      // User connected but not admin, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Profile completion check for authenticated users
  if (session && !pathname.startsWith('/admin') && !pathname.startsWith('/onboarding')) {
    // Protected pages that require a complete profile
    const protectedPages = ['/', '/dashboard', '/match', '/matches'];
    const isProtectedPage = protectedPages.some((page) => pathname.startsWith(page));

    if (isProtectedPage) {
      const profileStatus = await getUserProfileStatus();

      if (profileStatus.type === 'success' && !profileStatus.data.profileComplete) {
        // Redirect to onboarding if profile is not complete
        const redirectUrl = new URL('/onboarding', request.url);
        redirectUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/(.*)'],
};
