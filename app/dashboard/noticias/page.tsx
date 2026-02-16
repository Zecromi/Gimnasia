"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import {
    CarouselSkeleton,
    GallerySkeleton,
    NewsGridSkeleton,
    EventsSkeleton,
    SitesSkeleton
} from "@/components/noticias/section-skeletons";
import { LazySection } from "@/components/noticias/lazy-section";
import { NoticiasFooter } from "@/components/noticias/noticias-footer";

// Dynamic imports with skeletons as fallbacks
const NewsCarousel = dynamic(() => import("@/components/noticias/news-carousel").then(mod => mod.NewsCarousel), {
    loading: () => <CarouselSkeleton />,
});

const ModalitiesGallery = dynamic(() => import("@/components/noticias/modalities-gallery").then(mod => mod.ModalitiesGallery), {
    loading: () => <GallerySkeleton />,
    ssr: false, // Circular gallery depends on browser APIs
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

export default function NoticiasPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Scrollable area with padding */}
            <div className="flex-1 overflow-y-auto w-full">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 space-y-16">

                    {/* Section 1: Hero Carousel (Keep Suspense but No LazySection for immediate load) */}
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

                </div>

                {/* Footer outside the max-w container to be full width if background color is used */}
                <NoticiasFooter />
            </div>
        </div>
    );
}
