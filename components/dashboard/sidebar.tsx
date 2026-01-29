import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleHelp } from "lucide-react"
import { motion } from "framer-motion"

export function Sidebar() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
        >

            <Card className="bg-[#E4F2EF] shadow-none dark:bg-zinc-900 rounded-2xl border-green-100 dark:border-zinc-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold">Guía de usuario</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <CircleHelp className="h-4 w-4" />
                        <span>Manual para Asociación</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CircleHelp className="h-4 w-4" />
                        <span>Manual para Club</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#E4F2EF] shadow-none dark:bg-zinc-900 rounded-2xl border-green-100 dark:border-zinc-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold">Eventos</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-xs text-muted-foreground">
                            Con inscripciones que vencen pronto
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-xs text-muted-foreground">
                            Con inscripciones abiertas
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
