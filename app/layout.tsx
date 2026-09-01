import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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
  openGraph: {
    title: "BlumBlast - Customer Acquisition Engine",
    description: "Transform leads into BusinessBlum customers with intelligent automation",
    type: "website",
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
        {children}
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
