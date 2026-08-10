import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import * as React from "react"

export function DashboardHeader() {
    const [mounted, setMounted] = React.useState(false)
    const { resolvedTheme } = useTheme()

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const isDark = mounted ? resolvedTheme === "dark" : false

    const bg1 = isDark
        ? 'linear-gradient(197deg, #0f172a 0%, #115e59 19%, #0f766e 32%, #134e5e 59%, #064e3b 77%, #022c22 100%)'
        : 'linear-gradient(197deg, #f0fdfa 0%, #ccfbf1 19%, #99f6e4 32%, #5eead4 59%, #2dd4bf 77%, #0d9488 100%)'

    const bg2 = isDark
        ? 'conic-gradient(from 82deg at 67% 18%, transparent 0 25%, rgba(45, 212, 191, 0.25) 34%, transparent 48%), radial-gradient(ellipse at 45% 30%, rgba(17, 94, 89, 0.28), transparent 40%)'
        : 'conic-gradient(from 82deg at 67% 18%, transparent 0 25%, rgba(13, 148, 136, 0.2) 34%, transparent 48%), radial-gradient(ellipse at 45% 30%, rgba(204, 251, 241, 0.5), transparent 40%)'

    const bg3 = isDark
        ? 'radial-gradient(ellipse at 57% 6%, rgba(255, 255, 255, 0.15), transparent 38%), radial-gradient(ellipse at 59% 34%, rgba(45, 212, 191, 0.2), transparent 42%)'
        : 'radial-gradient(ellipse at 57% 6%, rgba(255, 255, 255, 0.5), transparent 38%), radial-gradient(ellipse at 59% 34%, rgba(13, 148, 136, 0.15), transparent 42%)'

    const bg4 = isDark
        ? 'radial-gradient(circle at center, transparent 25%, rgba(0, 0, 0, 0.3) 58%, rgba(0, 0, 0, 0.85) 100%), linear-gradient(to bottom, transparent 45%, rgba(0, 0, 0, 0.8) 100%)'
        : 'radial-gradient(circle at center, transparent 40%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0.8) 100%), linear-gradient(to bottom, transparent 60%, rgba(255, 255, 255, 0.5) 100%)'

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-[calc(100%+2rem)] -mx-4 -mt-4 overflow-hidden isolate"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 -z-[0]" style={{ background: bg1 }} />
            <div className="absolute inset-0 -z-[1]" style={{
                backgroundImage: bg2,
                filter: 'blur(30px)',
                opacity: 0.61
            }} />
            <div className="absolute inset-0 -z-[2]" style={{ background: bg3 }} />
            <div className="absolute inset-0 -z-[4]" style={{ background: bg4 }} />
            <div className="absolute inset-0 -z-[5] mix-blend-soft-light" style={{ opacity: 0.24 }} />

            {/* Content Container */}
            <div className="border-none relative z-10 flex flex-col justify-center items-start px-6 py-6 md:px-10 md:py-8 min-h-[300px] bg-white/10 dark:bg-emerald-950/10 backdrop-blur-md border-b border-white/20 shadow-sm">
                <div className="space-y-4 max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="font-black tracking-tight"
                    >
                        <span className="font-serif italic text-gray-900 dark:text-emerald-50 text-4xl md:text-2xl lg:text-4xl font-semi font-normal">  Bienvenido a</span>
                        <br />
                        <span className="italic relative inline-block text-teal-900 dark:text-emerald-400 text-6xl md:text-7xl lg:text-8xl font-black mt-1 pr-2 md:pr-0">
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
                        className="pt-2 flex flex-wrap items-center"
                    >
                        <Button
                            variant="link"
                            className="group p-0 h-auto font-semibold text-teal-400 dark:text-teal-900 bg-black dark:bg-white m-2 p-3 px-4 rounded-full hover:no-underline"
                            asChild
                        >
                            <a href="/api/download-manual" target="_blank" rel="noopener noreferrer">
                                Ver manual
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                        <Button
                            variant="link"
                            className="group p-0 h-auto font-semibold text-teal-400 dark:text-teal-900 bg-black dark:bg-white m-2 p-3 rounded-full hover:no-underline transition-all duration-500 ease-in-out flex items-center justify-center"
                            asChild
                        >
                            <Link href="https://drive.google.com/drive/folders/1YKUdHDJKJKS-C0OZUV6WJXNKZq-ia8aJ?usp=drive_link" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                <span className="material-symbols-outlined shrink-0 text-xl leading-none">drive_export</span>
                                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-500 ease-in-out">
                                    Drive GUEM
                                </span>
                            </Link>
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
