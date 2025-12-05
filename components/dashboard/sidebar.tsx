import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleHelp, CalendarDays } from "lucide-react"

export function Sidebar() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
                {/* Placeholder for Logo */}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <span className="text-xs text-muted-foreground">Logo</span>
                </div>
                <h2 className="text-md font-bold">
                    Bienvenido ASOCIACIÓN ESTADO DE MÉXICO
                </h2>
            </div>

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
        </div>
    )
}
