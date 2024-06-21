import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { appWithTranslation } from "next-i18next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welto",
  description: "Generated your own personal Room Directory Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
