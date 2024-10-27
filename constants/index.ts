// sidebarLinks.ts
export const sidebarLinks = [
  {
    icon: "Home", // Use identifier string
    route: "/",
    label: "Dashboard",
  },
  {
    icon: "CalendarClock",
    route: "/upcoming",
    label: "Upcoming",
  },
  {
    icon: "FolderOpen",
    route: "/previous",
    label: "Previous",
  },
  {
    icon: "Video",
    route: "/recordings",
    label: "Recordings",
  },
  {
    icon: "UserPlus",
    route: "/personal-room",
    label: "Personal Room",
  },
] as const;

export const avatarImages = [
  "/images/avatar-1.jpeg",
  "/images/avatar-2.jpeg",
  "/images/avatar-3.png",
  "/images/avatar-4.png",
  "/images/avatar-5.png",
];
