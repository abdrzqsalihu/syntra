import type { Metadata } from "next";
import "./globals.css";

import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import ServiceWorker from "@/components/ServiceWorker";
import { Analytics } from "@vercel/analytics/next";

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
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
        </head>
        <body
          className={`${nunito.className} antialiased bg-dark-1`}
          suppressHydrationWarning={true}
        >
          {children}
          <Analytics />
          <ServiceWorker />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
