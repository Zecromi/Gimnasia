"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Menu, X, Sun, Moon, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { useTheme } from "next-themes";
import {
  CarouselSkeleton,
  GallerySkeleton,
  NewsGridSkeleton,
  EventsSkeleton,
  SitesSkeleton
} from "@/components/noticias/section-skeletons";
import { LazySection } from "@/components/noticias/lazy-section";
import { NoticiasFooter } from "@/components/noticias/noticias-footer";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic imports with skeletons as fallbacks
const NewsCarousel = dynamic(() => import("@/components/noticias/news-carousel").then(mod => mod.NewsCarousel), {
  loading: () => <CarouselSkeleton />,
});

const ModalitiesGallery = dynamic(() => import("@/components/noticias/modalities-gallery").then(mod => mod.ModalitiesGallery), {
  loading: () => <GallerySkeleton />,
  ssr: false,
});

const NewsSection = dynamic(() => import("@/components/noticias/news-section").then(mod => mod.NewsSection), {
  loading: () => <NewsGridSkeleton />,
});

const UpcomingEvents = dynamic(() => import("@/components/noticias/upcoming-events").then(mod => mod.UpcomingEvents), {
  loading: () => <EventsSkeleton />,
});

const SitesOfInterest = dynamic(() => import("@/components/noticias/sites-of-interest").then(mod => mod.SitesOfInterest), {
  loading: () => <SitesSkeleton />,
});

const ClubesList = dynamic(() => import("@/components/clubes/clubes-list").then(mod => mod.ClubesList), {
  loading: () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-medium">Cargando clubes...</p>
    </div>
  ),
});

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950 ">
      {/* Header / Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/60 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 py-3 shadow-sm" : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-lg bg-white p-1">
              <Image
                src="/logo-gimnasios.png"
                alt="GUEM Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className={`font-bold text-xl md:text-2xl tracking-tighter transition-colors ${scrolled ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"
              }`}>
              GUEM
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <Link href="#noticias" className="text-sm font-medium hover:text-teal-600 dark:hover:text-teal-600 transition-colors">Noticias</Link>
              <Link href="#modalidades" className="text-sm font-medium hover:text-teal-600 dark:hover:text-teal-600 transition-colors">Modalidades</Link>
              <Link href="#eventos" className="text-sm font-medium hover:text-teal-600 dark:hover:text-teal-600 transition-colors">Eventos</Link>
            </nav>

            <div className="flex items-center gap-4 border-l pl-8 border-gray-100 dark:border-zinc-800">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}

              <Button asChild className="bg-[#008f80]/90 dark:bg-[#008f80]/20 text-white rounded-full px-6 shadow-md transition-all hover:scale-105">
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
              className="md:hidden bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 overflow-hidden "
            >
              <div className="px-4 py-6 space-y-4 flex flex-col items-center">
                <Link href="#noticias" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium hover:text-teal-600 dark:hover:text-teal-600">Noticias</Link>
                <Link href="#modalidades" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium hover:text-teal-600 dark:hover:text-teal-600">Modalidades</Link>
                <Link href="#eventos" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium hover:text-teal-600 dark:hover:text-teal-600">Eventos</Link>

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
      <main className="flex-1 pt-20 ">
        <div className="max-w-[1400px] bg-gray-50 dark:bg-zinc-950 mx-auto px-4 md:px-8 py-8 space-y-8 rounded-xl">
          <Tabs defaultValue="inicio" className="w-full">
            <div className="flex justify-center w-full mb-8">
              <TabsList className="grid w-[120px] grid-cols-2 h-11 shadow-sm rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="inicio" className="rounded-full h-full w-full flex items-center justify-center p-0 data-[state=active]:bg-[#008f80]/10 data-[state=active]:text-[#008f80] dark:data-[state=active]:bg-[#008f80]/20 dark:data-[state=active]:text-teal-400 transition-all cursor-pointer">
                      <Home className="h-5 w-5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs font-medium">
                    <p>Inicio</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="clubes" className="rounded-full h-full w-full flex items-center justify-center p-0 data-[state=active]:bg-[#008f80]/10 data-[state=active]:text-[#008f80] dark:data-[state=active]:bg-[#008f80]/20 dark:data-[state=active]:text-teal-400 transition-all cursor-pointer">
                      <Building2 className="h-5 w-5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs font-medium">
                    <p>Ver Clubes</p>
                  </TooltipContent>
                </Tooltip>
              </TabsList>
            </div>

            <TabsContent value="inicio" className="space-y-16 animate-in fade-in-50 duration-500 mt-0">
              {/* Section 1: Hero Carousel */}
              <section id="carousel">
                <Suspense fallback={<CarouselSkeleton />}>
                  <NewsCarousel />
                </Suspense>
              </section>

              {/* Section 1.5: Modalities Gallery */}
              <section id="modalidades">
                <LazySection fallback={<GallerySkeleton />} rootMargin="100px">
                  <Suspense fallback={<GallerySkeleton />}>
                    <ModalitiesGallery />
                  </Suspense>
                </LazySection>
              </section>

              {/* Section 2: News Grid & Categories */}
              <section id="noticias">
                <LazySection fallback={<NewsGridSkeleton />} rootMargin="100px">
                  <Suspense fallback={<NewsGridSkeleton />}>
                    <NewsSection />
                  </Suspense>
                </LazySection>
              </section>

              {/* Section 3: Upcoming Events */}
              <section id="eventos">
                <LazySection fallback={<EventsSkeleton />} rootMargin="100px">
                  <Suspense fallback={<EventsSkeleton />}>
                    <UpcomingEvents />
                  </Suspense>
                </LazySection>
              </section>

              {/* Section 4: Sites of Interest */}
              <section id="interes">
                <LazySection fallback={<SitesSkeleton />} rootMargin="100px">
                  <Suspense fallback={<SitesSkeleton />}>
                    <SitesOfInterest />
                  </Suspense>
                </LazySection>
              </section>
            </TabsContent>

            <TabsContent value="clubes" className="animate-in fade-in-50 duration-500 mt-0">
              <ClubesList />
            </TabsContent>
          </Tabs>
        </div>

        <NoticiasFooter />
      </main>

      <ScrollToTop />
    </div>
  );
}
