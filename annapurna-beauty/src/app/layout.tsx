import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Annapurna Beauty Parlour | Enhance Your Natural Beauty",
  description:
    "Premium beauty services at Annapurna Beauty Parlour, Shakti Nagar Colony. Expert hair, skin, bridal, and makeup services in a serene, luxurious environment.",
  keywords: [
    "beauty parlour",
    "hair salon",
    "bridal makeup",
    "skin care",
    "Shakti Nagar Colony",
    "Annapurna Beauty",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
