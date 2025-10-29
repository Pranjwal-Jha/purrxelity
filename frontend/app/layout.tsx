import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
const font = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Purrxelity",
  description: "open source perplexity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={font.className}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
