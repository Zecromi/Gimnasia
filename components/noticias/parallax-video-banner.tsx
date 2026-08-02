"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Trophy, Flame } from "lucide-react";

interface ParallaxVideoBannerProps {
  videoUrl?: string;
}

export function ParallaxVideoBanner({
  videoUrl = "https://d8j0ntlcm91z4.cloudfront.net/user_3GrlsnmUHawxTNFLvsORTy85Fbo/hf_20260802_194546_8e015e9b-59ad-4c23-b6c4-3de75b633c01.mp4",
}: ParallaxVideoBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect using framer-motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform video position slightly as page scrolls
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[420px] overflow-hidden rounded-3xl my-8 shadow-2xl border border-teal-500/20 dark:border-teal-500/30 group"
    >
      {/* Background Parallax Video */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-[130%] -top-[15%]">
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1] dark:brightness-[0.65] transition-all duration-700 group-hover:scale-105"
        />
      </motion.div>

      {/* Gradient Overlays matching site palette */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/40 z-10" />

      {/* Decorative Glow accents */}
      <div className="absolute top-1/2 left-12 -translate-y-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none z-10" />

      {/* Banner Content */}
      <div className="relative z-20 h-full max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col justify-center items-start text-white space-y-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 backdrop-blur-md text-teal-300 text-xs md:text-sm font-semibold tracking-wide uppercase"
        >
          <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>Pasión y Excelencia en Gimnasia</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight max-w-2xl drop-shadow-md"
        >
          Donde la agilidad se convierte en <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-400 bg-clip-text text-transparent">Arte en Movimiento</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-200 text-sm md:text-base max-w-xl line-clamp-2 md:line-clamp-none font-medium leading-relaxed drop-shadow"
        >
          Sigue cada disciplina, torneos oficiales y la evolución de nuestros deportistas rumbo a los máximos torneos nacionales e internacionales.
        </motion.p>

        {/* Micro-Stats / Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-6 pt-2 text-xs md:text-sm text-gray-300 font-medium"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-teal-400" />
            <span>Alto Rendimiento</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400/50" />
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>Todas las Modalidades</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
