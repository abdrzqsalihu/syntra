"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import {
  Home,
  CalendarClock,
  FolderOpen,
  Video,
  UserPlus,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  // Map icon names to Lucide components
  const iconMap = {
    Home,
    CalendarClock,
    FolderOpen,
    Video,
    UserPlus,
  };

  const pathname = usePathname();

  return (
    <section className="w-full max-w-[260px]">
      <Sheet>
        <SheetTrigger asChild>
          <button className="lg:hidden" aria-label="Open navigation menu">
            <Menu size={27} className="text-white cursor-pointer mt-1.5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-1 text-white">
          <SheetTitle className="text-white sr-only">
            Navigation Menu
          </SheetTitle>
          <Link href="/" className="flex items-center gap-1">
            <Image src="/logo-2.png" width={100} height={100} alt="yoom logo" />
          </Link>

          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav
                className="flex h-full flex-col gap-5 pt-16 text-white"
                aria-label="Mobile navigation"
              >
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route;
                  const IconComponent = iconMap[item.icon];

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn(
                          "flex gap-3.5 items-center p-2.5 rounded-lg w-full max-w-64",
                          {
                            "bg-dark-2": isActive,
                          }
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <IconComponent
                          size={18}
                          className="text-gray-100 -mt-0.5"
                          aria-hidden="true"
                        />
                        <p className="text-medium">{item.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
