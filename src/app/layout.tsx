import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Tutor Academy",
  description: "Personalized AI-powered learning platform for UK Maths and English.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
