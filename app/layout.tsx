import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "BlumBlast - Customer Acquisition Engine for BusinessBlum",
  description:
    "Centralized platform to ingest leads from email and SMS, engage at scale with bulk messaging, and convert prospects into BusinessBlum customers through intelligent automation.",
  keywords: [
    "lead management",
    "customer acquisition",
    "marketing automation",
    "email campaigns",
    "SMS campaigns",
    "lead nurturing",
    "sales pipeline",
    "businessblum",
    "crm automation",
  ],
  authors: [{ name: "BlumBlast Team" }],
  icons: {
    icon: "/images/logoBlumBlast.png",
    shortcut: "/images/logoBlumBlast.png",
    apple: "/images/logoBlumBlast.png",
  },
  openGraph: {
    title: "BlumBlast - Customer Acquisition Engine",
    description: "Transform leads into BusinessBlum customers with intelligent automation",
    type: "website",
    images: ["/images/logoBlumBlast.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-gray-50" suppressHydrationWarning>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          expand={false}
          duration={4000}
        />
      </body>
    </html>
  );
}
