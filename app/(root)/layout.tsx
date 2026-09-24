import StreamVideoProvider from "@/providers/StreamClientProvider";
import React, { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <StreamVideoProvider>{children}</StreamVideoProvider>;
}
