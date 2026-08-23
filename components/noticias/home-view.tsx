"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Menu, X, Sun, Moon, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  CarouselSkeleton,
  GallerySkeleton,
  NewsGridSkeleton,
  EventsSkeleton,
  SitesSkeleton,
} from "@/components/noticias/section-skeletons";
import { NoticiasFooter } from "@/components/noticias/noticias-footer";
import { motion, AnimatePresence } from "framer-motion";
import { RhythmicBackground } from "@/components/ui/rhythmic-background";
import { NewsCarousel } from "@/components/noticias/news-carousel";
import { NewsSection } from "@/components/noticias/news-section";
import { UpcomingEvents } from "@/components/noticias/upcoming-events";
import { SitesOfInterest } from "@/components/noticias/sites-of-interest";

// Modalities Gallery contains 3D/Canvas (CircularGallery) - keep client dynamic import
const ModalitiesGallery = dynamic(
  () => import("@/components/noticias/modalities-gallery").then((mod) => mod.ModalitiesGallery),
  {
    loading: () => <GallerySkeleton />,
    ssr: false,
  }
);

// ClubesList is loaded on-demand when the user clicks the "Clubes" tab
const ClubesList = dynamic(
  () => import("@/components/clubes/clubes-list").then((mod) => mod.ClubesList),
  {
    loading: () => (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Cargando clubes...</p>
      </div>
    ),
  }
);

export function HomeView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("inicio");
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(["inicio"]));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setVisitedTabs((prev) => {
      if (!prev.has(value)) {
        const next = new Set(prev);
        next.add(value);
        return next;
      }
      return prev;
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950 relative overflow-x-hidden">
        <RhythmicBackground />

        {/* Header / Navigation */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 py-3 shadow-sm"
              : "bg-transparent py-5"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-lg bg-white p-1">
                <Image
                  src="/logo-gimnasios.png"
                  alt="GUEM Logo - Gimnasios Unidos del Estado de México"
                  width={200}
                  height={200}
                  priority
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-xl italic md:text-2xl tracking-tighter transition-colors text-gray-900 dark:text-white">
                GUEM
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6" aria-label="Navegación principal">
                <Link
                  href="#noticias"
                  className="text-sm font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Noticias
                </Link>
                <Link
                  href="#modalidades"
                  className="text-sm font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Modalidades
                </Link>
                <Link
                  href="#eventos"
                  className="text-sm font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Eventos
                </Link>
              </nav>

              <div className="flex items-center gap-4 border-l pl-8 border-gray-100 dark:border-zinc-800">
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Cambiar tema de color"
                  >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                )}

                <Button
                  asChild
                  className="bg-[#008f80]/90 dark:bg-[#008f80]/30 hover:bg-[#008f80] text-white rounded-full px-6 shadow-md transition-all hover:scale-105"
                >
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Intranet
                  </Link>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 overflow-hidden"
              >
                <div className="px-4 py-6 space-y-4 flex flex-col items-center">
                  <Link
                    href="#noticias"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    Noticias
                  </Link>
                  <Link
                    href="#modalidades"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    Modalidades
                  </Link>
                  <Link
                    href="#eventos"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    Eventos
                  </Link>

                  <div className="flex flex-col items-center gap-4 w-full pt-4 border-t border-gray-100 dark:border-zinc-800">
                    {mounted && (
                      <Button
                        variant="outline"
                        className="w-full max-w-[200px] rounded-full gap-2"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="h-4 w-4" />
                            Modo Claro
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4" />
                            Modo Oscuro
                          </>
                        )}
                      </Button>
                    )}

                    <Button asChild className="w-full max-w-[200px]">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-20 relative z-10">
          <div className="max-w-[1400px] bg-gray-50 dark:bg-zinc-950 mx-auto px-4 md:px-8 py-8 space-y-8 rounded-xl border border-gray-200/50 dark:border-zinc-900/50">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="flex justify-center w-full mb-8">
                <TabsList className="grid w-[120px] grid-cols-2 h-11 shadow-sm rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value="inicio"
                        aria-label="Pestaña de Inicio"
                        className="rounded-full h-full w-full flex items-center justify-center p-0 data-[state=active]:bg-[#008f80]/10 data-[state=active]:text-[#008f80] dark:data-[state=active]:bg-[#008f80]/20 dark:data-[state=active]:text-teal-400 transition-all cursor-pointer"
                      >
                        <Home className="h-5 w-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs font-medium">
                      <p>Inicio</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value="clubes"
                        aria-label="Pestaña de Clubes"
                        className="rounded-full h-full w-full flex items-center justify-center p-0 data-[state=active]:bg-[#008f80]/10 data-[state=active]:text-[#008f80] dark:data-[state=active]:bg-[#008f80]/20 dark:data-[state=active]:text-teal-400 transition-all cursor-pointer"
                      >
                        <Building2 className="h-5 w-5" />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs font-medium">
                      <p>Ver Clubes</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsList>
              </div>

              <TabsContent
                value="inicio"
                className={cn("space-y-16 animate-in fade-in-50 duration-500 mt-0", activeTab !== "inicio" && "hidden")}
                forceMount={true}
              >
                {visitedTabs.has("inicio") && (
                  <>
                    {/* Hero Header Section */}
                    <div className="pt-8 pb-10 md:pt-12 md:pb-14 flex flex-col items-center justify-center space-y-4">
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white text-center max-w-4xl mx-auto leading-[1.1] font-sans">
                        La plataforma oficial <br />
                        para la <span className="font-serif italic font-normal text-teal-600 dark:text-teal-400">Gimnasia</span> Mexiquense
                      </h1>

                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mx-auto mt-2 font-medium tracking-wide">
                        Gimnasios Unidos del Estado de México. Fomentando el desarrollo integral, la disciplina y el alto rendimiento.
                      </p>
                    </div>

                    {/* Section 1: Hero Carousel */}
                    <section id="carousel" aria-label="Carrusel de noticias y destacados" className="relative">
                      <Suspense fallback={<CarouselSkeleton />}>
                        <NewsCarousel />
                      </Suspense>
                    </section>

                    {/* Section 2: Modalities Gallery */}
                    <section id="modalidades" aria-label="Modalidades deportivas de gimnasia" className="relative">
                      <Suspense fallback={<GallerySkeleton />}>
                        <ModalitiesGallery />
                      </Suspense>
                    </section>

                    {/* Section 3: News Grid & Categories */}
                    <section id="noticias" aria-label="Últimas noticias de gimnasia" className="relative">
                      <Suspense fallback={<NewsGridSkeleton />}>
                        <NewsSection />
                      </Suspense>
                    </section>

                    {/* Section 4: Upcoming Events */}
                    <section id="eventos" aria-label="Próximos eventos y competencias" className="relative">
                      <Suspense fallback={<EventsSkeleton />}>
                        <UpcomingEvents />
                      </Suspense>
                    </section>

                    {/* Section 5: Sites of Interest */}
                    <section id="interes" aria-label="Sitios de interés y federaciones" className="relative">
                      <Suspense fallback={<SitesSkeleton />}>
                        <SitesOfInterest />
                      </Suspense>
                    </section>
                  </>
                )}
              </TabsContent>

              <TabsContent
                value="clubes"
                className={cn("animate-in fade-in-50 duration-500 mt-0", activeTab !== "clubes" && "hidden")}
                forceMount={true}
              >
                {visitedTabs.has("clubes") && <ClubesList />}
              </TabsContent>
            </Tabs>
          </div>

          <NoticiasFooter />
        </main>

        <ScrollToTop />
      </div>
    </TooltipProvider>
  );
}
