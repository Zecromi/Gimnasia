"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        title: "Resultados del Clasificatorio Estatal",
        date: "12 de Octubre, 2026",
        description: "Se han publicado los resultados oficiales de la competencia estatal de gimnasia artística. Más de 200 atletas participaron.",
        category: "Artística Femenil",
        image: "https://images.unsplash.com/photo-1547844111-da4ca4fc1f23?q=80&w=400&h=250&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Nueva actualización del reglamento técnico",
        date: "10 de Octubre, 2026",
        description: "La federación ha emitido una circular con cambios importantes en el sistema de puntuación para el ciclo olímpico.",
        category: "Rítmica",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&h=250&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Gala de Verano: Todo listo para el show",
        date: "05 de Septiembre, 2026",
        description: "Acompáñanos en una noche llena de magia y destreza física. Las entradas ya están a la venta de forma digital.",
        category: "Acrobática",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&h=250&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Entrevistas: El camino hacia la excelencia",
        date: "28 de Agosto, 2026",
        description: "Hablamos con los entrenadores más destacados de la región sobre sus métodos y visión del deporte.",
        category: "Trampolín",
        image: "https://images.unsplash.com/photo-1547844111-da4ca4fc1f23?q=80&w=400&h=250&auto=format&fit=crop",
    },
];

export function NewsSection() {
    const [activeCategory, setActiveCategory] = useState("Todos");

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
                        <Card className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 border-none bg-accent/50 dark:bg-accent/10">
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
                                <Button variant="link" className="px-0 text-primary font-bold group-hover:gap-2 transition-all">
                                    Leer más <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
