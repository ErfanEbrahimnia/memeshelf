import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/app/_components/SiteHeader";
import { ThemeProvider } from "@/app/_components/ThemeProvider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MemeShelf",
  description: "Your meme library, organized for you.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        geistSans.variable,
        geistMono.variable,
        inter.variable
      )}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <ThemeProvider
          enableSystem
          disableTransitionOnChange
          attribute="class"
          defaultTheme="system"
        >
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
