import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";
import { signToken } from "@/lib/jwt";
import type { LoginInput } from "@/validations/auth.validation";

export async function loginService(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Email atau password salah");
  }

  const isValidPassword = await comparePassword(
    data.password,
    user.password
  );

  if (!isValidPassword) {
    throw new Error("Email atau password salah");
  }

  if (!user.isActive) {
    throw new Error("Akun tidak aktif");
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}