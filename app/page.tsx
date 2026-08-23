import type { Metadata } from "next";
import { HomeView } from "@/components/noticias/home-view";

export const metadata: Metadata = {
  title: "Inicio | GUEM - Gimnasios Unidos del Estado de México",
  description:
    "Portal oficial de Gimnasios Unidos del Estado de México. Descubre noticias recientes, eventos, torneos, clubes afiliados y modalidades de gimnasia rítmica, artística y trampolín.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GUEM - Gimnasios Unidos del Estado de México | Plataforma Oficial",
    description:
      "Descubre las últimas noticias, torneos y eventos de gimnasia en el Estado de México. Conoce a nuestros atletas y clubes afiliados.",
    url: "/",
    siteName: "GUEM",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/logo-gimnasios.png",
        width: 800,
        height: 600,
        alt: "GUEM Logo - Gimnasios Unidos del Estado de México",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GUEM - Gimnasios Unidos del Estado de México",
    description: "Plataforma oficial de gimnasia en el Estado de México. Noticias, eventos y clubes.",
    images: ["/logo-gimnasios.png"],
  },
};

export default function HomePage() {
  // JSON-LD Structured Data for Google Search Engine Optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsOrganization",
        "@id": "https://guem.org.mx/#organization",
        "name": "Gimnasios Unidos del Estado de México",
        "alternateName": "GUEM",
        "url": "https://guem.org.mx",
        "logo": "https://guem.org.mx/logo-gimnasios.png",
        "description":
          "Asociación oficial que fomenta el desarrollo integral, la disciplina y el alto rendimiento de la gimnasia en el Estado de México.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Calle 2 de Marzo, Mz 34 Lt 38. Col. Jacalones I",
          "addressLocality": "Chalco",
          "addressRegion": "Estado de México",
          "postalCode": "56604",
          "addressCountry": "MX"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+52-55-6878-0440",
          "contactType": "customer support",
          "email": "guemasociacion@gmail.com"
        },
        "sameAs": [
          "https://www.instagram.com/guem.edomex"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://guem.org.mx/#website",
        "url": "https://guem.org.mx",
        "name": "GUEM - Gimnasia Mexiquense",
        "publisher": {
          "@id": "https://guem.org.mx/#organization"
        },
        "inLanguage": "es-MX"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeView />
    </>
  );
}
