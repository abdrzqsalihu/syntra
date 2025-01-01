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
    icon: "User",
    route: "/personal-room",
    label: "Personal Room",
  },
] as const;
