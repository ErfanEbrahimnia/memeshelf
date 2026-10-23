import { PwaInstall } from "@/app/_components/PwaInstall";
import { ThemeProvider } from "@/app/_components/ThemeProvider";
import { ConfirmationRoot } from "@/components/ui/Confirm";
import { Toaster } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

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
  applicationName: "MemeShelf",
  appleWebApp: {
    capable: true,
    title: "MemeShelf",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#252525" },
  ],
  colorScheme: "light dark",
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
      <body
        className="flex min-h-full flex-col bg-background font-sans text-foreground pt-[env(safe-area-inset-top)]"
      >
        <ThemeProvider
          enableSystem
          disableTransitionOnChange
          attribute="class"
          defaultTheme="system"
        >
          <NuqsAdapter>{children}</NuqsAdapter>
          <PwaInstall />
          <ConfirmationRoot />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
