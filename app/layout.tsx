import type { Metadata } from "next";
import "./globals.css";

import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Syntra",
  description:
    "Manage, join, schedule meetings, and access past recordings, all in one app.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "/logo-2.png",
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorText: "#fff",
          colorPrimary: "#CB3CFF",
          colorBackground: "#000519",
          // colorInputBackground: "#252A41",
          // colorInputText: "#fff",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${nunito.className} antialiased bg-dark-1`}
          suppressHydrationWarning={true}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
