import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: "BlumBlast - Marketing Automation Platform",
  description:
    "Transform your marketing with intelligent automation. Launch multi-channel campaigns, automate lead nurturing, and close more deals faster with BlumBlast.",
  keywords: [
    "marketing automation",
    "lead generation",
    "email campaigns",
    "customer acquisition",
    "marketing platform",
  ],
  authors: [{ name: "BlumBlast" }],
  openGraph: {
    title: "BlumBlast - Marketing Automation Platform",
    description: "Transform your marketing with intelligent automation",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
