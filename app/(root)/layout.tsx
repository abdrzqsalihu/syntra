import { Toaster } from "@/components/ui/toaster";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Syntra",
  description:
    "Manage, join, schedule meetings, and access past recordings, all in one app.",
  icons: {
    icon: "/logo.png",
  },
};

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
      <Toaster />
    </main>
  );
}

export default RootLayout;
