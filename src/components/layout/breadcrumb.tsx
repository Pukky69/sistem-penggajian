"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumb() {
  const pathname = usePathname();

  const paths = pathname
    .split("/")
    .filter(Boolean);


  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">

      {paths.map((path, index) => {

        const href =
          "/" + paths.slice(0, index + 1).join("/");


        return (
          <div
            key={href}
            className="flex items-center gap-2"
          >

            {index > 0 && (
              <span>
                /
              </span>
            )}


            <Link
              href={href}
              className={
                index === paths.length - 1
                  ? "text-foreground font-medium"
                  : "hover:text-foreground"
              }
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </Link>


          </div>
        );
      })}

    </div>
  );
}