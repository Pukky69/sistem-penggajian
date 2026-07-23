"use client";

import { useRouter } from "next/navigation";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCurrentUser } from "@/hooks/use-current-user";


export function UserMenu() {
  const router = useRouter();

  const user = useCurrentUser();


  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }


  if (!user) {
    return null;
  }


  return (
    <DropdownMenu>

      <DropdownMenuTrigger className="outline-none">

        <div className="flex items-center gap-3">

          <Avatar>
            <AvatarFallback>
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>


          <div className="hidden md:block text-left">

            <p className="text-sm font-medium">
              {user.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {user.role}
            </p>

          </div>

        </div>

      </DropdownMenuTrigger>


      <DropdownMenuContent align="end">

        <DropdownMenuItem>
          Profile
        </DropdownMenuItem>


        <DropdownMenuItem
          onClick={handleLogout}
        >
          Logout
        </DropdownMenuItem>


      </DropdownMenuContent>


    </DropdownMenu>
  );
}