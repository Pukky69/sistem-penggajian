"use client";

import { Role } from "@prisma/client";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      }
    }

    getUser();
  }, []);

  return user;
}