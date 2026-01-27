import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export function DashboardHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full rounded-3xl overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 dark:from-teal-900 dark:via-emerald-900 dark:to-cyan-900 opacity-90 blur-xl scale-125" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col justify-center items-start p-2 md:p-6 min-h-[300px] bg-white/30 dark:bg-emerald-950/30 backdrop-blur-md rounded-3xl border border-white/20 shadow-lg">
                <div className="space-y-4 max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-emerald-50"
                    >
                        Bienvenido <br />
                        <span className="text-teal-900 dark:text-emerald-400"> a GUEM</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-lg md:text-xl text-teal-900/80 dark:text-emerald-100/80 font-medium max-w-lg leading-relaxed"
                    >
                        Gestion de afiliados, clubes y eventos desde un solo lugar.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="pt-4"
                    >
                        <Button
                            variant="link"
                            className="group p-0 h-auto font-semibold text-teal-950 dark:text-emerald-300 hover:no-underline"
                        >
                            Ver guía de usuario
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute top-8 right-8 w-24 h-24 rounded-full bg-white flex items-center justify-center border border-white/30 hidden md:flex shadow-xl p-2 overflow-hidden"
                >
                    <Image
                        src="/logo-gimnasios.png"
                        alt="Logo"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                </motion.div>
            </div>
        </motion.div>
    )
}
