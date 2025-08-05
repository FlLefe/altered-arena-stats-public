import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/';
  }

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user profile is complete
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let finalRedirectPath = next;

      if (user) {
        // Check if user profile is complete
        const { data: player, error: playerError } = await supabase
          .from('Player')
          .select('profileComplete')
          .eq('authId', user.id)
          .is('deletedAt', null)
          .single();

        // If profile is not complete and user is not already going to onboarding, redirect to onboarding
        if ((playerError || !player || !player.profileComplete) && next !== '/onboarding') {
          finalRedirectPath = '/onboarding';
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      const redirectUrl = isLocalEnv
        ? `${origin}${finalRedirectPath}`
        : forwardedHost
          ? `https://${forwardedHost}${finalRedirectPath}`
          : `${origin}${finalRedirectPath}`;

      return NextResponse.redirect(redirectUrl);
    } else {
      console.error("Erreur lors de l'échange du code:", error);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
