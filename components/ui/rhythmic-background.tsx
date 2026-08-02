"use client";

import React from "react";

export function RhythmicBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Wave ribbon paths spanning across the background */}
      <svg className="absolute w-full h-full min-h-screen opacity-[0.05] dark:opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Subtle dot pattern for texture */}
          <pattern id="rhythmic-dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" className="fill-teal-700/80 dark:fill-teal-400/80" />
          </pattern>
          
          {/* Ribbon paths gradients */}
          <linearGradient id="ribbon-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="ribbon-gradient-2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>

        {/* Tiled dot texture */}
        <rect width="100%" height="100%" fill="url(#rhythmic-dots)" />
        
        {/* Ribbon waves flowing behind the dashboard layout */}
        <path
          d="M -100,150 C 250,50 500,450 1000,200 C 1300,50 1600,350 2000,150"
          fill="none"
          stroke="url(#ribbon-gradient-1)"
          strokeWidth="4"
          strokeLinecap="round"
          className="blur-[1px]"
        />
        
        <path
          d="M -50,500 C 350,650 700,200 1200,600 C 1500,800 1750,450 2050,650"
          fill="none"
          stroke="url(#ribbon-gradient-2)"
          strokeWidth="3"
          strokeLinecap="round"
          className="blur-[1.5px]"
        />

        <path
          d="M 100,800 C 500,900 800,500 1400,950 C 1700,1100 1900,800 2200,900"
          fill="none"
          stroke="url(#ribbon-gradient-1)"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-75 blur-[0.5px]"
        />
      </svg>

      {/* Floating silhouettes of rhythmic gymnasts placed strategically around margins */}
      
      {/* Gymnast 1: Top Left - Grand Jeté Split Leap with Ribbon */}
      <div className="absolute top-[18vh] left-[2%] xl:left-[4%] w-56 h-56 xl:w-72 xl:h-72 opacity-[0.08] dark:opacity-[0.04] text-teal-600 dark:text-teal-400 transform -rotate-12 transition-all duration-1000 hover:scale-105 hover:rotate-[-8deg] hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
          {/* Gymnast body doing leap */}
          <path d="M 45,15 C 47,15 48.5,16.5 48.5,18.5 C 48.5,20.5 47,22 45,22 C 43,22 41.5,20.5 41.5,18.5 C 41.5,16.5 43,15 45,15 Z M 46.5,24 C 49,27 51,30 53,33 C 55,37 56,41 57,46 C 62,45 67,44.5 72,44 C 77,43.5 82,43.5 87,44 C 88,44 89,45 88.5,46 C 88,47 87,47.5 85,47 C 81,46.5 77,46.5 72.5,47.5 C 68,48.5 64,49.5 60,51.5 C 59.5,53.5 59,55.5 58.5,57.5 C 57.5,61.5 56,65.5 55,69.5 C 54,73.5 52.5,77.5 51.5,81.5 C 51,83 50,84 49,83 C 48,82 48.5,80.5 49,79 C 50.5,74.5 52,70.5 53,66.5 C 54,62.5 55,58.5 55.5,54.5 C 52.5,55 49.5,55.5 46.5,56 C 42.5,56.5 38.5,57 34.5,57.5 C 29.5,58 24.5,58.5 19.5,59 C 17.5,59.2 15.5,59.5 13.5,60 C 12.5,60.2 11.5,59.5 12,58.5 C 12.5,57.5 13.5,57 15,56.8 C 19,56.2 23,55.7 27,55.2 C 31.5,54.7 36,54.2 40.5,53.7 C 44.5,53.2 48.5,52.7 52.5,52 C 51.5,48 50,44 48,40 C 46.5,37 44.5,34.5 42.5,32 C 41.5,31 41,30 42,29 C 43,28 44.5,28.5 46,30 C 48,32 49.5,34.5 51,37 C 52,38.5 52.5,40 53,41.5 C 53.2,41.5 53.5,41 53.8,40.5 Z" />
          {/* Spiral ribbon around layout */}
          <path fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" d="M 87,44 C 98,38 105,48 100,56 C 94,65 82,58 78,68 C 73,78 85,86 76,93 C 67,100 54,92 46,96 C 39,99 30,95 24,98" className="text-teal-500/50 dark:text-teal-400/30" />
        </svg>
      </div>

      {/* Gymnast 2: Middle Right - Arabesque/Scale Balance with Hoop */}
      <div className="absolute top-[48vh] right-[2%] xl:right-[4%] w-56 h-56 xl:w-72 xl:h-72 opacity-[0.08] dark:opacity-[0.04] text-emerald-600 dark:text-emerald-400 transform rotate-12 transition-all duration-1000 hover:scale-105 hover:rotate-[8deg] hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
          {/* Gymnast pose */}
          <path d="M 40,12 C 41.5,12 42.5,13 42.5,14.5 C 42.5,16 41.5,17 40,17 C 38.5,17 37.5,16 37.5,14.5 C 37.5,13 38.5,12 40,12 Z M 40,19 C 41.5,22 43,25 44.5,28 C 45,29 45.5,30 45,31 C 44.5,32 43.5,31.5 43,30.5 C 41.5,27.5 40,24.5 38.5,21.5 C 37,25 35.5,28.5 34,32 C 32.5,35.5 31,39 29.5,42.5 C 28.5,45 27,47.5 25.5,50 C 25,51 24,51.5 23,51 C 22,50.5 22,49.5 23,48.5 C 24.5,46 26,43.5 27,41 C 28.5,37.5 30,34 31.5,30.5 C 33,27 34.5,23.5 36,20 C 35.5,20.5 35,21 34.5,21.5 C 32,24 29,26 26,27.5 C 23,29 20,30 17,30.5 C 16,30.7 15,29.8 15.5,28.8 C 16,27.8 17,27.8 18.5,27.5 C 21,27 23.5,26.2 26,24.8 C 28.5,23.4 31,21.5 33,19.2 C 34,18 35,17.5 36.5,18.5 C 37.5,19.2 38.5,19 39.5,18.8 Z M 45,51 C 44.5,54.5 44,58 43.5,61.5 C 42.5,67.5 41.5,73.5 40.5,79.5 C 40,82.5 39.5,85.5 39,88.5 C 38.7,90 37.5,91 36.5,90 C 35.5,89 36,87.5 36.5,86 C 37.5,80 38.5,74 39.5,68 C 40.5,62.5 41.5,57 42.5,51.5 Z" />
          {/* Giant decorative hoop */}
          <circle cx="50" cy="35" r="28" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-teal-500/50 dark:text-teal-400/30" />
        </svg>
      </div>

      {/* Gymnast 3: Bottom Left - Back Bend Balance with Ball */}
      <div className="absolute top-[82vh] left-[1%] xl:left-[3%] w-56 h-56 xl:w-72 xl:h-72 opacity-[0.08] dark:opacity-[0.04] text-teal-600 dark:text-teal-400 transform -rotate-6 transition-all duration-1000 hover:scale-105 hover:rotate-[-2deg] hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
          {/* Gymnast back bend pose */}
          <path d="M 68,48 C 69.5,48 70.5,49 70.5,50.5 C 70.5,52 69.5,53 68,53 C 66.5,53 65.5,52 65.5,50.5 C 65.5,49 66.5,48 68,48 Z M 64,54 C 62,56 59,57 56,57.5 C 52,58 48,57.5 44.5,55.5 C 40.5,53.2 37,49.5 35,45 C 33.5,41.5 32.8,37.5 33.2,33.5 C 33.5,30.5 34.5,27.5 36,25 C 36.5,24 37.5,23.5 38,24.5 C 38.5,25.5 38,26.5 37.5,27.5 C 36.2,29.7 35.3,32.2 35.1,34.8 C 34.8,38 35.4,41.2 36.7,44.2 C 38.4,48 41.5,51.1 45.1,53 C 48.1,54.6 51.5,55.1 54.9,54.7 C 57.5,54.3 60.1,53.4 61.8,51.6 C 62.8,50.6 63.8,51.6 64.2,52.6 C 64.4,53 64.2,53.5 64,54 Z M 35,46 C 32,52 28.5,58 24.5,63.5 C 20.5,69 16,74 11.5,79 C 10.5,80 9.5,79 10,78 C 14.5,73 19,68 23,62.5 C 27,57 30.5,51 33.5,45 C 34,44.1 34.8,44.5 35,46 Z M 44.8,55.5 C 45,59.5 45.2,63.5 45.3,67.5 C 45.5,72.5 45.6,77.5 45.8,82.5 C 45.9,84.5 44.5,85 43.5,84.8 C 42.5,84.6 42.5,83.5 42.5,82.2 C 42.3,77.2 42.2,72.2 42,67.2 C 41.8,63.2 41.6,59.2 41.4,55.2 C 42.5,55.3 43.7,55.4 44.8,55.5 Z" />
          {/* Gymnast ball */}
          <circle cx="78" cy="46" r="5.5" className="fill-teal-500/80 dark:fill-teal-400/60" />
        </svg>
      </div>

      {/* Decorative ambient glowing lights */}
      <div className="absolute top-[8%] left-[-15%] w-[600px] h-[600px] rounded-full bg-teal-500/5 dark:bg-teal-500/[0.02] blur-[120px] z-[-1] pointer-events-none" />
      <div className="absolute top-[50%] right-[-15%] w-[700px] h-[700px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/[0.02] blur-[140px] z-[-1] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/[0.015] blur-[100px] z-[-1] pointer-events-none" />
    </div>
  );
}
