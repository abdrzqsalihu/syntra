"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Home, CalendarClock, FolderOpen, Video, UserPlus } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

function Sidebar() {
  // Map icon names to Lucide components
  const iconMap = {
    Home,
    CalendarClock,
    FolderOpen,
    Video,
    UserPlus,
  };
  const pathname = usePathname();
  const { user } = useUser();
  return (
    <div className="lg:flex h-screen flex-col justify-between border-e-2 border-dark-3 bg-dark-1 hidden md:w-[13%]">
      <div className="px-4 py-6">
        <ul className="mt-24 space-y-5">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.route || pathname.startsWith(`${link.route}/`);
            const IconComponent = iconMap[link.icon];
            return (
              <li key={link.label}>
                <Link
                  href={link.route}
                  className={cn(
                    "block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-100",
                    {
                      "bg-dark-2": isActive,
                    }
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent
                      size={18}
                      className="text-gray-100 -mt-0.5"
                    />{" "}
                    <span>{link.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center gap-2 p-4 border-t-2 border-dark-3">
        <UserButton />
        <div>
          <p className="text-xs">
            <strong className="block font-medium mb-[0.1rem] text-gray-50">
              {user?.fullName}
            </strong>
            <span className="text-gray-200">
              {" "}
              {user?.primaryEmailAddress?.emailAddress}{" "}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
