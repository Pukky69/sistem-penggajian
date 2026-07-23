import { Breadcrumb } from "./breadcrumb";
import { NotificationMenu } from "./notification-menu";
import { UserMenu } from "./user-menu";
import { MobileSidebar } from "./mobile-sidebar";


export function AppNavbar() {

  return (

    <header className="h-16 border-b flex items-center justify-between px-4 lg:px-6">


      <div className="flex items-center gap-3">

        <MobileSidebar />

        <Breadcrumb />

      </div>


      <div className="flex items-center gap-2">

        <NotificationMenu />

        <UserMenu />

      </div>


    </header>

  );
}