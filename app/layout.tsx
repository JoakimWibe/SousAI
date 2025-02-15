import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/navbar';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import ReactQueryClientProvider from '@/components/react-query-client-provider';
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SousAI",
  description: "Transform your daily meals with AI-powered personalized meal plans. Save time, eat better, and reach your health goals without the hassle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
           <ReactQueryClientProvider>
              <Navbar />
              {children}
              <Footer />
              <Toaster />
             </ReactQueryClientProvider>  
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
