"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Eye, EyeOff, Sun, Moon, Loader2, AlertCircle, ArrowRight } from "lucide-react";
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
    const { theme, setTheme, resolvedTheme } = useTheme();
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
            console.log("Login successful (token obtained):", data);

            if (data && (data.token || data.token == null)) {
                // Note: API might return just { token: "..." } or similar. Adjust checks as needed based on actual API response structure.
                // Provided code suggests data.token check.

                // Now validate permissions via GetPass BEFORE setting session
                try {
                    const passData = await getPass(cleanUsuario, cleanPassword);
                    if (passData && passData.length > 0) {
                        setAuthData(passData[0]);
                    }
                } catch (err) {
                    console.warn("GetPass failed", err);
                    setError("Credenciales inválidas");
                    setLoading(false);
                    return;
                }

                // Restore missing Cookie set!
                const tokenToStore = data.token ? data.token : JSON.stringify(data);
                Cookies.set('token', tokenToStore, { expires: 1 });

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
                    className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-gray-200 dark:border-zinc-800 rounded-md  hover:bg-white dark:hover:bg-zinc-800"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>

            {/* Main Card Container */}
            <div className="w-full max-w-4xl bg-transparent gap-6 md:gap-0 flex flex-col md:flex-row items-stretch justify-center transition-colors duration-500">

                {/* Left Column: Logo & Welcome */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full md:w-1/2 flex flex-col transition-colors duration-500"
                >
                    <div className="w-full h-full flex flex-col justify-between rounded-3xl md:rounded-r-none md:rounded-l-3xl overflow-hidden  dark:bg-zinc-900/40 backdrop-blur-xl border border-white/60 dark:border-zinc-800/80 md:border-r-0">
                        {/* Top: Logo Showcase */}
                        <div className="w-full p-6 sm:p-8 flex items-center justify-center flex-1 bg-[#ebf3e6]/60 dark:bg-zinc-900/60">
                            <div className="relative w-full aspect-[4/3] max-h-56 sm:max-h-64">
                                <Image
                                    src="/logo-gimnasios.png"
                                    alt="Gimnasios Unidos del Estado de México Logo"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 450px"
                                    className="object-contain dark:opacity-90 rounded-3xl"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Bottom: Integrated Title Dock */}
                        <div className="w-full p-6 sm:p-7 text-center bg-[#fafcf9] dark:bg-zinc-950/70 border-t border-white/50 dark:border-zinc-800/80 space-y-1.5 backdrop-blur-md">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1b3a16] dark:text-white transition-colors duration-500">
                                Bienvenido a{" "}
                                <span className="font-serif italic font-semibold text-teal-600 dark:text-teal-400">
                                    GUEM
                                </span>
                            </h1>
                            <h3 className="text-teal-900/70 dark:text-zinc-400 transition-colors text-xs sm:text-sm font-medium uppercase tracking-wider">
                                Acceder a Intranet
                            </h3>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Form */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full md:w-1/2 p-8 sm:p-10 md:p-11 flex flex-col rounded-3xl md:rounded-l-none md:rounded-r-3xl justify-center bg-[#fafcf9] dark:bg-zinc-900/85 backdrop-blur-xl border border-white/60 dark:border-zinc-800/80 md:border-l border-white/40 dark:border-zinc-800/60 transition-all duration-500"
                >
                    <div className="space-y-6">

                        <div className="space-y-1.5 text-center md:text-left">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-1">
                                <Lock className="w-3.5 h-3.5" />
                                Sesión GUEM
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Iniciar <span className="font-serif italic font-semibold text-teal-600 dark:text-teal-400">Sesión</span>
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-medium">
                                Ingresa tus credenciales para acceder a la plataforma
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="usuario" className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-zinc-400">
                                    Usuario
                                </Label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
                                    <Input
                                        id="usuario"
                                        placeholder="Ingresa tu usuario"
                                        value={usuario}
                                        onChange={(e) => setUsuario(e.target.value)}
                                        className="bg-gray-50/80 dark:bg-zinc-950/60 border-gray-200/80 dark:border-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 h-11 pl-10.5 pr-4 rounded-xl focus-visible:ring-2 focus-visible:ring-teal-500/30 focus-visible:border-teal-600 transition-all text-sm font-medium"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-zinc-400">
                                    Contraseña
                                </Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-gray-50/80 dark:bg-zinc-950/60 border-gray-200/80 dark:border-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 h-11 pl-10.5 pr-11 rounded-xl focus-visible:ring-2 focus-visible:ring-teal-500/30 focus-visible:border-teal-600 transition-all text-sm font-medium"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 focus:outline-none transition-all cursor-pointer"
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium"
                                >
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 active:scale-[0.99] transition-all cursor-pointer mt-2 text-sm"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Ingresando...
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2">
                                        Ingresar a la plataforma
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
