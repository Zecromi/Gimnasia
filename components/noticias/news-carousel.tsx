"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
    {
        id: 1,
        title: "Afiliados",
        description: "Los afiliados son el corazón de nuestra federación.",
        image: "/gimnasia_2.png",
        category: "Afiliados",
    },
    {
        id: 2,
        title: "POR LA SUPERACIÓN DE LA GIMNASIA MEXIQUENSE",
        description: "Gimnasios Unidos del Estado de México.",
        image: "/gimnasia_1.png",
        category: "Institucional",
    },
    {
        id: 3,
        title: "Eventos",
        description: "Mira los próximos eventos de la federación y participa en ellos",
        image: "/gimnasia_3.jpg",
        category: "Eventos",
    },
];

export function NewsCarousel() {
    const [current, setCurrent] = useState(0);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const startTimer = React.useCallback(() => {
        stopTimer();
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 6000);
    }, []);

    const stopTimer = React.useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const resetTimer = React.useCallback(() => {
        startTimer();
    }, [startTimer]);

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, [startTimer, stopTimer]);

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        resetTimer();
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        resetTimer();
    };

    const goToSlide = (index: number) => {
        setCurrent(index);
        resetTimer();
    };

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
                    {/* Blurred Background Layer */}
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-60 dark:opacity-40"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                    />

                    {/* Main Image Layer (no cropping) */}
                    <div className="absolute inset-0 flex items-center justify-center p-0 shadow-inner">
                        <img
                            src={slides[current].image}
                            alt={slides[current].title}
                            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain transition-all duration-300"
                        />
                    </div>

                    {/* Dark gradient overlay so text stays readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-white">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-primary text-white dark:bg-primary dark:text-black rounded-full mb-4 inline-block">
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
                        onClick={() => goToSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-primary" : "w-2 bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
