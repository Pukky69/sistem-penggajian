"use client";

import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export function NotificationMenu() {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
      >
        <Bell size={20} />
      </DropdownMenuTrigger>


      <DropdownMenuContent
        align="end"
        className="w-72"
      >

        <div className="p-4">

          <p className="font-semibold">
            Notification
          </p>


          <p className="text-sm text-muted-foreground mt-2">
            Belum ada notifikasi
          </p>

        </div>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}