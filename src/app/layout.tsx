import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "./providers";

export const metadata: Metadata = {
  title: "Instagram Clone",
  description: "Instagram clone built with Next.js, TypeScript, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
