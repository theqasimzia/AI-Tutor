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
  title: {
    template: "%s | AI Tutor Academy",
    default: "AI Tutor Academy — Personalised AI Tutoring for UK Maths & English",
  },
  description:
    "Build confidence in Maths and English with a patient, voice-interactive AI tutor that adapts to your child's unique learning pace. Aligned with the UK National Curriculum (KS2 & KS3).",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://aitutoracademy.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "AI Tutor Academy",
  },
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
