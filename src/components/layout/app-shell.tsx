import { AppNavbar } from "./app-navbar";
import { AppSidebar } from "./app-sidebar";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <div className="lg:pl-64">
        <AppNavbar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}