import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Logeeka Admin Dashboard",
  description: "Sistem Manajemen Berita dan Portofolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}