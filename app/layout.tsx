import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://guem.org.mx"),
  title: {
    default: "GUEM - Gimnasios Unidos del Estado de México",
    template: "%s | GUEM",
  },
  description: "Plataforma oficial de Gimnasios Unidos del Estado de México (GUEM). Noticias, eventos, torneos, clubes afiliados y modalidades de gimnasia rítmica, artística y trampolín.",
  keywords: [
    "gimnasia",
    "GUEM",
    "gimnasia Estado de México",
    "gimnasia rítmica",
    "gimnasia artística",
    "gimnasia trampolín",
    "clubes gimnasia edomex",
    "eventos gimnasia",
    "asociación gimnasia"
  ],
  authors: [{ name: "GUEM" }],
  creator: "Gimnasios Unidos del Estado de México",
  publisher: "GUEM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: "GUEM",
    title: "GUEM - Gimnasios Unidos del Estado de México",
    description: "Plataforma oficial de Gimnasios Unidos del Estado de México. Noticias, eventos y modalidades de gimnasia.",
    images: [
      {
        url: "/logo-gimnasios.png",
        width: 800,
        height: 600,
        alt: "Logo GUEM - Gimnasios Unidos del Estado de México",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GUEM - Gimnasios Unidos del Estado de México",
    description: "Plataforma oficial de Gimnasios Unidos del Estado de México.",
    images: ["/logo-gimnasios.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.conjurnet.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.conjurnet.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=drive_export" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
