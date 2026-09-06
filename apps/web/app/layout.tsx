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
  title: {
    default: "AURIX | Advance Unit Research for Xcellence",
    template: "%s | AURIX",
  },
  description: "Official portal for AURIX — Advance Unit Research for Xcellence at Dr. Ambedkar Institute of Technology, Bengaluru.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${montserrat.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white text-zinc-900 font-sans antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
