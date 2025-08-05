import { z } from 'zod';
import { COMMON_PASSWORDS } from '@/constants';

export const RegisterUserDTO = z
  .object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Adresse email invalide' }),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
      .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/,
        'Le mot de passe doit contenir au moins un caractère spécial',
      )
      .refine((password) => !COMMON_PASSWORDS.includes(password.toLowerCase()), {
        message: 'Ce mot de passe est trop courant, veuillez en choisir un plus complexe',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type RegisterUserDTO = z.infer<typeof RegisterUserDTO>;
