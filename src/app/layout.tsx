import type { Metadata } from "next";
import { Inter, Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";
import AnnouncementBar from "@/components/AnnouncementBar";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Booti Natural - Premium Organic Health Products",
  description:
    "Your trusted source for 100% organic and natural health products.",
};

import SiteChrome from "@/components/SiteChrome";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${playfair.variable} font-inter antialiased bg-cream text-gray-800 flex flex-col min-h-screen`}
      >
        <ClientProviders>
          <SiteChrome>{children}</SiteChrome>
        </ClientProviders>
      </body>
    </html>
  );
}
