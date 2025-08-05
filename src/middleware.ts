import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is not connected, continue
  if (!session) {
    return response;
  }

  const { pathname } = req.nextUrl;

  // Protected routes that require a complete profile
  const protectedRoutes = ['/dashboard', '/admin'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Onboarding and authentication routes
  const authRoutes = ['/login', '/register', '/onboarding'];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Check if the user has a complete profile
    const { data: player } = await supabase
      .from('Player')
      .select('profileComplete')
      .eq('authId', session.user.id)
      .single();

    // If the profile is not complete, redirect to onboarding
    if (player && !player.profileComplete) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }

  // If the user is connected and on an auth route, redirect to the dashboard
  if (isAuthRoute && pathname !== '/onboarding') {
    const { data: player } = await supabase
      .from('Player')
      .select('profileComplete')
      .eq('authId', session.user.id)
      .single();

    if (player?.profileComplete) {
      return NextResponse.redirect(new URL('/dashboard/profile', req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
