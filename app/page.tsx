"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Eye, EyeOff, Sun, Moon, Loader2, Heading1 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { login, getPass } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/lib/store/auth-store";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const clearAuthData = useAuthStore((state) => state.clearAuthData);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Clear previous session data to ensure no stale state
    clearAuthData();

    const cleanUsuario = usuario.trim();
    const cleanPassword = password.trim();

    try {
      const data = await login(cleanUsuario, cleanPassword);
      console.log("Login successful:", data);

      if (data) {
        const tokenToStore = data.token ? data.token : JSON.stringify(data);
        Cookies.set('token', tokenToStore, { expires: 1 });

        // Second Auth Step
        try {
          const passData = await getPass(cleanUsuario, cleanPassword);

          if (passData && passData.length > 0) {
            const permissions = passData[0];
            setAuthData(permissions);
          } else {
            console.warn("GetPass returned empty array or null for user:", cleanUsuario);
          }
        } catch (passError) {
          console.error("Error calling GetPass:", passError);
          // We don't block login if this fails, but user won't have permissions
        }

        router.push("/dashboard");
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#008f80]/50 via-[#008f80]/10 to-red-500/15 dark:from-zinc-900 dark:via-zinc-950 dark:to-black transition-colors duration-500">

      {/* Theme Toggle Button */}
      <div className="absolute bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800 rounded-md shadow-md"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-4xl bg-transparent gap-10 dark:transparent overflow-hidden border-none flex flex-col md:flex-row transition-colors duration-500">

        {/* Left Column: Logo & Welcome */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-1/2 flex flex-col items-center justify-center bg-transparent dark:bg-transparent border-none dark:border-zinc-800 transition-colors duration-500"
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative w-110 h-74 -mt-3">
              <Image
                src="/logo-gimnasios.png"
                alt="Gimnasios Unidos del Estado de México Logo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain rounded-2xl dark:opacity-80"
                priority
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white transition-colors duration-500">Bienvenido</h1>
              <h3 className="text-gray-500 dark:text-zinc-400 transition-colors text-xl duration-500 uppercase">
                Acceder a Intranet GUEM
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-1/2 p-8 md:p-12 flex flex-col rounded-2xl  justify-center bg-[#008f80]/90 dark:bg-[#008f80]/20 transition-colors duration-500"
        >
          <div className="space-y-6">

            <div className="relative py-2">
              <div className="relative flex justify-center">
                <span className="px-3 text-white text-xl font-medium">Iniciar Sesión</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dark:text-zinc-300 font-medium transition-colors duration-500">Usuario</Label>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {error && (
                <div className="text-red-200 text-sm text-center bg-red-500/20 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0ac5b2]/90 dark:bg-[#00a896] hover:bg-[#008f80]/70 dark:hover:bg-[#008f80] text-white font-bold h-11 shadow-lg shadow-[#00a896]/20 rounded-lg transition-all mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  "Ingresar"
                )}
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center text-xs text-gray-200 dark:text-zinc-500 transition-colors duration-500">
            <p className=" transition-colors">Powered by Next.js</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
