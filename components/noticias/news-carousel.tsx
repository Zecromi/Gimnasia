"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
    {
        id: 1,
        title: "Gran Campeonato Nacional de Gimnasia 2026",
        description: "Los mejores atletas del país se reúnen para competir por el oro en las diferentes modalidades.",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop",
        category: "Evento Nacional",
    },
    {
        id: 2,
        title: "Nueva Escuela de Gimnasia Rítmica",
        description: "Inauguramos nuevas instalaciones con equipamiento de nivel internacional.",
        image: "https://images.unsplash.com/photo-1547844111-da4ca4fc1f23?q=80&w=1467&auto=format&fit=crop",
        category: "Institucional",
    },
    {
        id: 3,
        title: "Capacitación para Entrenadores de Trampolín",
        description: "Seminario especializado dictado por jueces internacionales de la FIG.",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop",
        category: "Capacitación",
    },
];

export function NewsCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    return (
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-white">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-primary rounded-full mb-4 inline-block">
                                {slides[current].category}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-2xl leading-tight">
                                {slides[current].title}
                            </h2>
                            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
                                {slides[current].description}
                            </p>
                            <Button size="lg" className="rounded-full px-8 font-semibold">
                                Leer más
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute bottom-8 right-8 flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-md"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-md"
                    onClick={nextSlide}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 left-8 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-primary" : "w-2 bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
