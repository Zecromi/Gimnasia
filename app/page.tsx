"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon, User, Lock, Eye, EyeOff, Sun, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#008f80]/70 via-[#008f80]/10 to-gray-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black transition-colors duration-500">

      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800 rounded-full shadow-md"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row transition-colors duration-500">

        {/* Left Column: Logo & Welcome */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-zinc-900/50 border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-800 transition-colors duration-500"
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative w-80 h-52">
              <Image
                src="/logo-gimnasios.png"
                alt="Gimnasios Unidos del Estado de México Logo"
                fill
                className="object-contain rounded-xl dark:opacity-90"
                priority
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-500">Bienvenido</h1>
              <p className="text-gray-500 dark:text-zinc-400 transition-colors duration-500">
                Acceder a GUEM
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#008f80]/90 dark:bg-[#008f80]/20 transition-colors duration-500"
        >
          <div className="space-y-6">

            <div className="relative py-2">
              <div className="relative flex justify-center">
                <span className="px-3 text-white text-xl font-medium">Iniciar Sesión</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dark:text-zinc-300 font-medium transition-colors duration-500">Correo electrónico</Label>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder="m@ejemplo.com"
                    className="bg-white dark:bg-zinc-950 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 h-11 pl-10 focus-visible:ring-[#00a896] focus-visible:border-[#00a896] transition-colors duration-500"
                  />
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-zinc-500 transition-colors duration-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white dark:text-zinc-300 font-medium transition-colors duration-500">Contraseña</Label>
                  <Link href="#" className="text-xs text-white dark:text-[#00a896] hover:text-gray-200 dark:hover:text-[#008f80] font-medium transition-colors duration-500">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="bg-white dark:bg-zinc-950 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 h-11 pl-10 pr-10 focus-visible:ring-[#00a896] focus-visible:border-[#00a896] transition-colors duration-500"
                  />
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-zinc-500 transition-colors duration-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 focus:outline-none transition-colors duration-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button className="w-full bg-[#0ac5b2]/90 dark:bg-[#00a896] hover:bg-[#008f80]/70 dark:hover:bg-[#008f80] text-white font-bold h-11 shadow-lg shadow-[#00a896]/20 rounded-lg transition-all mt-2">
                Ingresar
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-200 dark:text-zinc-500 transition-colors duration-500">
            <p className=" transition-colors">Powered by Next.js</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
