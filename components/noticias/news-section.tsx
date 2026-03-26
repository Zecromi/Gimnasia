"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { useNoticiasStore } from "@/lib/store/noticias-store";
import { useCatalogStore } from "@/lib/store/catalog-store";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NewsDetailDialog = dynamic(() => import("./news-detail-dialog").then(mod => mod.NewsDetailDialog), {
    ssr: false,
});

// Removed static categories array
const PAGE_SIZE = 8;

export function NewsSection() {
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [selectedNews, setSelectedNews] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [loadingMore, setLoadingMore] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const { noticias, isLoading, fetchNoticias } = useNoticiasStore();
    const { Modalidades, fetchCatalogs } = useCatalogStore();

    useEffect(() => {
        fetchNoticias();
        fetchCatalogs();
    }, [fetchNoticias, fetchCatalogs]);

    // Build dynamic categories array from Modalidades
    const categories = ["Todos", ...(Modalidades?.map((m: any) => m.Nombre) || [])];

    const filteredNews = activeCategory === "Todos"
        ? noticias
        : noticias.filter(item => item.category === activeCategory);

    const visibleNews = filteredNews.slice(0, visibleCount);
    const hasMore = visibleCount < filteredNews.length;

    // Reset visible count when category changes
    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [activeCategory]);

    // IntersectionObserver — loads next 8 when sentinel enters viewport
    const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loadingMore) {
            setLoadingMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + PAGE_SIZE);
                setLoadingMore(false);
            }, 400);
        }
    }, [hasMore, loadingMore]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [handleIntersect]);

    const handleNewsClick = (news: any) => {
        setSelectedNews(news);
        setIsDialogOpen(true);
    };

    return (
        <section className="py-12 space-y-8">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 pb-2">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant="outline"
                        onClick={() => setActiveCategory(category)}
                        className={`rounded-full transition-all duration-300 ${
                          activeCategory === category 
                            ? "bg-[#008f80] text-white hover:bg-teal-700 border-[#008f80] hover:text-white" 
                            : "text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 hover:text-[#008f80] dark:hover:bg-zinc-800"
                        }`}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">Últimas Noticias</h3>
            </div>

            {/* News Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 animate-pulse h-[380px]" />
                    ))}
                </div>
            ) : filteredNews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 border-dashed text-center">
                    <span className="text-5xl opacity-80 mb-4">📰</span>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-200">No hay noticias disponibles</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Intenta con otra categoría de búsqueda.</p>
                </div>
            ) : (
                <>
                <div className="overflow-y-auto max-h-[720px] pr-2 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {visibleNews.map((news, index) => (
                            <motion.div
                                key={news.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (index % PAGE_SIZE) * 0.05 }}
                                className="h-full"
                            >
                                <Card
                                    onClick={() => handleNewsClick(news)}
                                    className="h-full flex flex-col hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden relative group cursor-pointer"
                                >
                                    <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "/logo-gimnasios.png";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm text-[#00A389] text-[11px] font-bold tracking-wider uppercase rounded-md shadow-sm">
                                            {news.category}
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <CardHeader className="pt-5 pb-3 px-5">
                                            <div className="flex items-center text-[12px] text-gray-500 dark:text-gray-400 gap-1.5 font-medium mb-3">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {news.date}
                                            </div>
                                            <CardTitle className="text-[17px] font-bold leading-snug group-hover:text-[#008f80] transition-colors line-clamp-2">
                                                {news.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-5 pb-4 flex-1">
                                            <CardDescription className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                                {news.description}
                                            </CardDescription>
                                        </CardContent>
                                        <CardFooter className="px-5 pb-5 pt-0 mt-auto">
                                            <Button
                                                variant="link"
                                                className="px-0 h-auto py-0 text-[#008f80] font-semibold hover:no-underline group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNewsClick(news);
                                                }}
                                            >
                                                Leer más <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </CardFooter>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Infinite scroll sentinel */}
                    {hasMore && (
                        <div ref={sentinelRef} className="flex justify-center py-6">
                            {loadingMore && (
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            )}
                        </div>
                    )}
                </div>
                </>
            )}

            <Suspense fallback={null}>
                <NewsDetailDialog
                    news={selectedNews}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </Suspense>
        </section>
    );
}
