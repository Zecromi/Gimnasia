"use client";

import React, { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NewsDetailDialog = dynamic(() => import("./news-detail-dialog").then(mod => mod.NewsDetailDialog), {
    ssr: false,
});

const categories = [
    "Todos",
    "Artística Varonil",
    "Artística Femenil",
    "Rítmica",
    "Trampolín",
    "Aeróbica",
    "Acrobática",
];

const newsItems = [
    {
        id: 1,
        title: "Brillante desempeño en el Campeonato Nacional",
        date: "12 de Octubre, 2026",
        description: "Nuestras gimnastas logran podio en múltiples categorías. Consulta la tabla completa de posiciones y revive los mejores momentos de la competencia.",
        category: "Artística Femenil",
        image: "/gimnasia_1.png",
    },
    {
        id: 2,
        title: "Actualización Técnica de la FIG 2026",
        date: "10 de Octubre, 2026",
        description: "Descubre los cambios clave en el nuevo ciclo olímpico. Analizamos cómo el ajuste en los criterios de ejecución impactará las próximas participaciones internacionales.",
        category: "Rítmica",
        image: "/gimnasia_2.png",
    },
    {
        id: 3,
        title: "Gran Gala de Invierno: Venta de Boletos",
        date: "05 de Septiembre, 2026",
        description: "Prepárate para una noche de espectacularidad y elegancia. Asegura tu lugar en la gala anual donde se presentarán los mejores mosaicos acrobáticos del país.",
        category: "Acrobática",
        image: "/gimnasia_3.jpg",
    },
    {
        id: 4,
        title: "Convocatoria para el Seminario Superior",
        date: "28 de Agosto, 2026",
        description: "Inicia el registro para el programa de formación de alto rendimiento. Un espacio diseñado para entrenadores y jueces que buscan la excelencia técnica en trampolín.",
        category: "Para todos",
        image: "/gimnasia_4.jpg",
    },
];

export function NewsSection() {
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [selectedNews, setSelectedNews] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleNewsClick = (news: any) => {
        setSelectedNews(news);
        setIsDialogOpen(true);
    };

    const filteredNews = activeCategory === "Todos"
        ? newsItems
        : newsItems.filter(item => item.category === activeCategory);

    return (
        <section className="py-12 space-y-8">
            {/* Categories Horizontal Scroll/Flex */}
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
                <Button variant="ghost" className="gap-2">
                    Ver todas <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredNews.map((news, index) => (
                    <motion.div
                        key={news.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            onClick={() => handleNewsClick(news)}
                            className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 border-none bg-accent/50 dark:bg-accent/10"
                        >
                            <div className="relative h-48 w-full overflow-hidden">
                                <img
                                    src={news.image}
                                    alt={news.title}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
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
