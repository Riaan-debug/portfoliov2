import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Riaan van Rhyn - Full-Stack Web Developer Portfolio",
  description: "Full-stack web developer transitioning from teaching to web development. Specializing in React, Next.js, TypeScript, and modern web technologies. View my projects and get in touch for collaboration opportunities.",
  keywords: [
    "Full-Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "South Africa",
    "Portfolio",
    "Web Development",
    "Frontend Developer",
    "Backend Developer"
  ],
  authors: [{ name: "Riaan van Rhyn" }],
  creator: "Riaan van Rhyn",
  publisher: "Riaan van Rhyn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://riaanvanrhyn.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Riaan van Rhyn - Full-Stack Web Developer Portfolio",
    description: "Full-stack web developer transitioning from teaching to web development. Specializing in React, Next.js, TypeScript, and modern web technologies.",
    url: "https://riaanvanrhyn.dev",
    siteName: "Riaan van Rhyn Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Riaan van Rhyn - Full-Stack Web Developer Portfolio",
    description: "Full-stack web developer transitioning from teaching to web development. Specializing in React, Next.js, TypeScript, and modern web technologies.",
    creator: "@RiaanDebug",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Content Security Policy */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
