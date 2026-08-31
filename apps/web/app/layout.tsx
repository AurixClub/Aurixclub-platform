import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURIX | Advanced Robotics & Innovation Club",
  description: "Official portal for the AURIX club.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${montserrat.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
