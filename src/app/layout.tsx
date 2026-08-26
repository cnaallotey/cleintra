import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { NavigationShell } from "@/components/NavigationShell";
import { JsonLd } from "@/components/JsonLd";

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://simplecrm.app"),
  title: {
    default: "Simple CRM — Sales Lead Tracker & Spreadsheet Alternative",
    template: "%s | Simple CRM",
  },
  description:
    "The lightweight, ultra-simple CRM for small businesses, shops, and traders. Import contacts from CSV, log customer calls, launch WhatsApp chats, and track deals in minutes without enterprise clutter.",
  keywords: [
    "simple crm",
    "sales spreadsheet alternative",
    "lead tracker for small business",
    "lightweight crm",
    "whatsapp crm tracker",
    "ghana crm small business",
    "excel to crm converter",
    "customer call logger",
  ],
  authors: [{ name: "Simple CRM Team" }],
  creator: "Simple CRM",
  publisher: "Simple CRM",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://simplecrm.app",
    siteName: "Simple CRM",
    title: "Simple CRM — Turn Messy Spreadsheets into Closed Deals",
    description:
      "Lightweight sales lead tracker for small businesses. CSV import, 1-tap WhatsApp and call logging, and customizable pipelines without enterprise clutter.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple CRM — Lightweight Sales & Lead Tracker",
    description:
      "Stop losing leads in spreadsheets and WhatsApp chats. Manage your customer pipeline in 60 seconds.",
  },
  alternates: {
    canonical: "https://simplecrm.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <AuthProvider>
          <NavigationShell>
            {children}
          </NavigationShell>
        </AuthProvider>
      </body>
    </html>
  );
}
