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
            <div className=" absolute inset-0 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 dark:from-teal-900 dark:via-emerald-900 dark:to-cyan-900 opacity-90 blur-xl scale-125" />

            {/* Content Container */}
            <div className=" border-none relative z-10 flex flex-col justify-center items-start p-2 md:p-6 min-h-[300px] bg-white/30 dark:bg-emerald-950/30 backdrop-blur-md rounded-3xl border border-white/20 shadow-lg">
                <div className="space-y-4 max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="font-black tracking-tight"
                    >
                        <span className=" text-gray-900 dark:text-emerald-50 text-4xl md:text-2xl lg:text-4xl font-bold">  Bienvenido a</span>
                        <br />
                        <span className="relative inline-block text-teal-900 dark:text-emerald-400 text-6xl md:text-7xl lg:text-8xl font-black mt-1 pr-2 md:pr-0">
                            GUEM

                        </span>

                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-md md:text-lg text-teal-900/80 dark:text-emerald-100/80 font-medium max-w-lg leading-relaxed pt-0"
                    >
                        Gimnasios Unidos del Estado de México
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="pt-2"
                    >
                        <Button
                            variant="link"
                            className="group p-0 h-auto font-semibold text-teal-400 dark:text-teal-900 bg-black dark:bg-white m-2 p-2 rounded-full hover:no-underline"
                            asChild
                        >
                            <a href="/api/download-manual" target="_blank" rel="noopener noreferrer">
                                Ver manual
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
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
