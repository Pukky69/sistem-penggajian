import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function getCurrentUser() {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    console.log("TOKEN:", token);

    if (!token) {
        return null;
    }

  try {
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}