"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Award, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  hoverVideo?: string;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "GUEM",
    description: "Bienvenido a nuestra asociación.",
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3GrlsnmUHawxTNFLvsORTy85Fbo/hf_20260802_195527_dc0ff293-9cba-4b8f-b293-ca268545ea4b.png",
    category: "Gimnasia Rítmica",
    hoverVideo: "/gimnasia_video.mp4",
  },
  {
    id: 2,
    title: "Afiliados GUEM",
    description: "Los afiliados son el corazón de nuestra asociación.",
    image: "/gimnasia-5.jpeg",
    category: "Afiliados",
  },
  {
    id: 3,
    title: "POR LA SUPERACIÓN DE LA GIMNASIA MEXIQUENSE",
    description: "Gimnasios Unidos del Estado de México.",
    image: "/gimnasia-7.jpeg",
    category: "Institucional",

  },
  {
    id: 4,
    title: "Próximos Eventos y Torneos",
    description: "Mira los próximos eventos de la asociación y participa en ellos.",
    image: "/gimnasia-6.jpeg",
    category: "Eventos",
  },
  {
    id: 5,
    title: "Evolución y Disciplina Deportiva",
    description: "Desarrollo integral en gimnasia artística, rítmica y trampolín.",
    image: "/gimnasia-8.jpeg",
    category: "Deporte",
  },
];


export function NewsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Parallax scroll effect for background depth
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 0.4], ["-2%", "5%"]);

  const startTimer = React.useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
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
    if (!isHovered) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [isHovered, startTimer, stopTimer]);

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

  const activeSlide = slides[current];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[440px] md:h-[540px] overflow-hidden rounded-3xl shadow-md border border-gray-200 dark:border-zinc-800 bg-zinc-950 group"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {/* Media Layer (Mexican Gymnast Image - Stable and smooth background) */}
          <motion.div style={{ y: backgroundY }} className="absolute inset-0 w-full h-[114%] -top-[6%]">
            <div
              className={`absolute inset-0 w-full h-full bg-cover bg-center filter contrast-[1.05] transition-all duration-700 group-hover:scale-105 ${isHovered && activeSlide.hoverVideo ? "opacity-0" : "opacity-100"}`}
              style={{ backgroundImage: `url(${activeSlide.image})` }}
            />
            {activeSlide.hoverVideo && isHovered && (
              <video
                src={activeSlide.hoverVideo}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100"
              />
            )}
          </motion.div>

          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-zinc-950/5 to-transparent pointer-events-none" />

          {/* Interactive Badge Indicator */}
          {activeSlide.hoverVideo && (
            <div className={`absolute top-6 right-6 z-20 transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-black/50 text-gray-200 border border-white/20 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Acerca el mouse para ver video</span>
              </div>
            </div>
          )}

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-14 text-white z-10">
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-3xl space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-teal-600 text-white rounded-full backdrop-blur-md shadow-sm">
                  {activeSlide.category}
                </span>
          
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-lg">
                {activeSlide.title}
              </h2>

              <p className="text-base md:text-xl text-gray-200 line-clamp-2 font-medium max-w-2xl drop-shadow">
                {activeSlide.description}
              </p>

              <div className="pt-2">
                <Button size="lg" className="rounded-full px-8 font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-all hover:scale-105">
                  Ver detalles
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex items-center gap-2 z-20">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-11 w-11 bg-black/40 border-white/20 hover:bg-white/20 text-white backdrop-blur-md transition-all"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-11 w-11 bg-black/40 border-white/20 hover:bg-white/20 text-white backdrop-blur-md transition-all"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? "w-8 bg-teal-400" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
