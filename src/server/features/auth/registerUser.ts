'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/prisma';
import { validateWithZodResult } from '@/lib/validation';
import { retryUntilTruthy } from '@/utils';
import { createClient } from '@/utils/supabase/serverClient';
import { RegisterUserDTO } from './RegisterUserDTO';

export async function registerUser(data: unknown) {
  try {
    // 1. Data validation with Zod
    const validationResult = validateWithZodResult(RegisterUserDTO, data, 'registerUser');
    if (!validationResult.success) {
      return { success: false, error: validationResult.error, code: validationResult.code };
    }

    const { email, password } = validationResult.data;

    // 2. Supabase account creation
    const supabase = createClient(await cookies());
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData?.user) {
      return {
        success: false,
        error: authError?.message ?? 'Erreur lors de la création du compte',
        code: 'SUPABASE_ERROR',
      };
    }

    const authId = authData.user.id;

    // 3. Wait for the player creation (trigger Supabase)
    const player = await retryUntilTruthy(() => db.player.findUnique({ where: { authId } }));

    if (!player) {
      return {
        success: false,
        error: 'Erreur lors de la création du profil joueur',
        code: 'DATABASE_ERROR',
      };
    }

    return {
      success: true,
      data: {
        emailConfirmed: authData.user.email_confirmed_at !== null,
        message: 'Compte créé avec succès ! Redirection vers la page connexion...',
      },
    };
  } catch (error) {
    console.error('[registerUser]', error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite",
      code: 'INTERNAL_ERROR',
    };
  }
}
