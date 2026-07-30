"use client";

import { Bell, CheckCircle2, UserPlus, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "PAYROLL" | "EMPLOYEE" | "SYSTEM";
};

type Props = {
  notifications?: NotificationItem[];
};

export function NotificationMenu({ notifications = [] }: Props) {
  const unreadCount = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-background" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4 border-b flex items-center justify-between">
          <p className="font-semibold text-sm">Notifikasi</p>
          {unreadCount > 0 && (
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
              {unreadCount} Baru
            </span>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada notifikasi
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="flex items-start gap-3 p-3 cursor-pointer border-b last:border-0"
              >
                <div className="mt-0.5 rounded-full p-1.5 bg-primary/10 shrink-0">
                  {item.type === "PAYROLL" ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : item.type === "EMPLOYEE" ? (
                    <UserPlus className="size-4 text-blue-600" />
                  ) : (
                    <FileText className="size-4 text-amber-600" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold leading-none">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {item.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {item.time}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}