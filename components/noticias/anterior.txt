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
                        variant={activeCategory === category ? "default" : "outline"}
                        onClick={() => setActiveCategory(category)}
                        className="rounded-full transition-all duration-300"
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
                        <div key={i} className="rounded-xl bg-primary/5 animate-pulse h-72" />
                    ))}
                </div>
            ) : filteredNews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3 text-muted-foreground">
                    <span className="text-4xl">📰</span>
                    <p className="text-base font-medium">No hay noticias disponibles por el momento.</p>
                    <p className="text-sm">Sin noticias por el momento.</p>
                </div>
            ) : (
                <>
                <div className="overflow-y-auto max-h-[720px] pr-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {visibleNews.map((news, index) => (
                            <motion.div
                                key={news.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (index % PAGE_SIZE) * 0.05 }}
                            >
                                <Card
                                    onClick={() => handleNewsClick(news)}
                                    className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 border-none bg-primary/5 hover:bg-primary/10"
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "/logo-gimnasios.png";
                                            }}
                                        />
                                        <Badge className="absolute top-4 left-4 font-medium backdrop-blur-md bg-primary/80 border-none">
                                            {news.category}
                                        </Badge>
                                    </div>
                                    <CardHeader className="space-y-2">
                                        <div className="flex items-center text-xs text-muted-foreground gap-1.5 font-medium">
                                            <Calendar className="h-3 w-3" />
                                            {news.date}
                                        </div>
                                        <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                            {news.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                                            {news.description}
                                        </CardDescription>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            variant="link"
                                            className="px-0 text-primary font-bold group-hover:gap-2 transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNewsClick(news);
                                            }}
                                        >
                                            Leer más <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                                        </Button>
                                    </CardFooter>
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
