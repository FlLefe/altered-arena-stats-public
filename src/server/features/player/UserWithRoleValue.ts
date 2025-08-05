import { UserWithRoleDTO } from './PlayerDTO';

export function mapToUserWithRole(raw: unknown): UserWithRoleDTO | null {
  const parsed = UserWithRoleDTO.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function isAdmin(user: UserWithRoleDTO): boolean {
  return user.role === 'admin';
}
