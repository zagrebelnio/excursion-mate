import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Excursion Mate",
  description: "Create and manage your excursions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
