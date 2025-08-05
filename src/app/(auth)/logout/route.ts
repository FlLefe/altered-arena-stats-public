import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/serverClient';

export async function POST(request: NextRequest) {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();

  const redirectUrl = new URL('/', request.url);
  return NextResponse.redirect(redirectUrl);
}
