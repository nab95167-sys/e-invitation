import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "Royal E-Invitation | Luxury Digital Wedding Invitations",
  description: "Secure, elegant, and personalized wedding digital invitations with role management, RSVP tracking, and media gallery.",
  keywords: ["wedding", "e-invitation", "digital invitation", "wedding rsvp", "luxury invitation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAF8F5] text-[#2C2A29] selection:bg-[#F3E5AB] selection:text-[#AA7C11]">
        {children}
      </body>
    </html>
  );
}
