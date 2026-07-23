import { Role } from "@prisma/client";

export function isAdmin(role?: Role) {
  return role === Role.ADMIN;
}

export function isEmployee(role?: Role) {
  return role === Role.KARYAWAN;
}

export function canAccess(
  role: Role | undefined,
  allowedRoles: Role[],
) {
  if (!role) return false;

  return allowedRoles.includes(role);
}