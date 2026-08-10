"use client"

import * as React from "react"
import { CheckCircle2, Clock, Users, ClubIcon, Layers } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { EventosConfiguradosItem as Evento, getInfo_Eventos, InfoEventoItem } from "@/lib/evento-service"

interface DetalleEventoDialogProps {
    evento: Evento
    children: React.ReactNode
}

type TabId = "resumen" | "entrenadores" | "clubes" | "asociaciones"

export function DetalleEventoDialog({ evento, children }: DetalleEventoDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState<TabId>("resumen")
    const [info, setInfo] = React.useState<InfoEventoItem | null>(null)
    const [loadingInfo, setLoadingInfo] = React.useState(false)
    const isMobile = useIsMobile()

    React.useEffect(() => {
        if (open && evento.id) {
            const fetchInfo = async () => {
                setLoadingInfo(true)
                try {
                    const data = await getInfo_Eventos(String(evento.id))
                    setInfo(data?.info_event?.[0] || null)
                } catch (error) {
                    console.error("Error fetching event info:", error)
                } finally {
                    setLoadingInfo(false)
                }
            }
            fetchInfo()
        }
    }, [open, evento.id])

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "N/A"
        try {
            const d = new Date(dateStr)
            if (isNaN(d.getTime())) return dateStr
            return format(d, "dd 'de' MMMM 'de' yyyy", { locale: es })
        } catch (e) {
            return dateStr
        }
    }

    const tabs = [
        {
            id: "resumen" as TabId,
            text: "Resumen",
            icon: CheckCircle2,
            color: "bg-blue-200/60 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-500/20"

        },
        // {
        //     id: "entrenadores" as TabId,
        //     text: "Entrenadores",
        //     icon: Clock,
        //     color: "bg-amber-200/60 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-500/20"
        // },
        // {
        //     id: "clubes" as TabId,
        //     text: "Clubes",
        //     icon: ClubIcon,
        //     color: "bg-emerald-200/60 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-500/20"
        // },
        // {
        //     id: "asociaciones" as TabId,
        //     text: "Asociaciones",
        //     icon: Users,
        //     color: "bg-rose-200/60 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-rose-500/20"
        // }
    ]

    const renderTabsSelector = () => (
        <div className="flex justify-center w-full py-0 pt-0">
            <div className="inline-flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-[24px] shadow-inner">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const bgClass = isActive
                        ? tab.color
                        : "bg-transparent hover:bg-gray-200/50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400";

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 min-w-[75px] px-2.5 py-1.5 rounded-[18px] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer active:scale-95 border border-transparent outline-none",
                                bgClass
                            )}
                        >
                            <Icon className="w-5 h-5 mb-0.5" />
                            <span className="text-[10px] font-bold tracking-wider text-center">
                                {tab.text}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )

    const renderTabContent = () => (
        <div className="mt-4 p-5 border border-gray-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950/40 flex-1 flex flex-col justify-between overflow-y-auto">
            {activeTab === "resumen" && (
                <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                    {loadingInfo ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 my-auto">
                            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Cargando información del evento...</p>
                        </div>
                    ) : !info ? (
                        <div className="text-center py-8 my-auto">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No se pudo cargar el resumen del evento.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* 1. Conteos (Cards layout) */}                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col justify-between p-4 bg-[#fafcf9] dark:bg-emerald-950/10 border border-[#e3ebd7] dark:border-emerald-900/30 rounded-[24px] min-h-[120px] md:min-h-[140px] shadow-none group">
                                    <div className="flex items-start justify-between w-full">
                                        <div className="p-2 bg-[#ebf3e6] dark:bg-emerald-950/40 rounded-xl text-[#325227] dark:text-emerald-400">
                                            <Layers className="h-5 w-5 md:h-6 md:w-6" />
                                        </div>
                                        <div className="text-3xl md:text-4xl font-serif italic font-extrabold text-[#1b3a16] dark:text-emerald-300 tracking-tight leading-none pl-1 pr-2">
                                            {info.Categorias ?? 0}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="font-semibold text-xs md:text-sm tracking-tight text-[#2d3a2a] dark:text-zinc-200">
                                            Categorías
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between p-4 bg-[#fdfbf7] dark:bg-amber-950/10 border border-[#f5ebd6] dark:border-amber-900/30 rounded-[24px] min-h-[120px] md:min-h-[140px] shadow-none group">
                                    <div className="flex items-start justify-between w-full">
                                        <div className="p-2 bg-[#fcf3e6] dark:bg-amber-950/40 rounded-xl text-[#523d27] dark:text-amber-400">
                                            <Users className="h-5 w-5 md:h-6 md:w-6" />
                                        </div>
                                        <div className="text-3xl md:text-4xl font-serif italic font-extrabold text-[#3a2716] dark:text-amber-300 tracking-tight leading-none pl-1 pr-2">
                                            {info.Atletas ?? 0}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="font-semibold text-xs md:text-sm tracking-tight text-[#3a2d20] dark:text-zinc-200">
                                            Atletas
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between p-4 bg-[#f7fbfe] dark:bg-blue-950/10 border border-[#d6ebf5] dark:border-blue-900/30 rounded-[24px] min-h-[120px] md:min-h-[140px] shadow-none group">
                                    <div className="flex items-start justify-between w-full">
                                        <div className="p-2 bg-[#e6f3fc] dark:bg-blue-950/40 rounded-xl text-[#274752] dark:text-blue-400">
                                            <ClubIcon className="h-5 w-5 md:h-6 md:w-6" />
                                        </div>
                                        <div className="text-3xl md:text-4xl font-serif italic font-extrabold text-[#16313a] dark:text-blue-300 tracking-tight leading-none pl-1 pr-2">
                                            {info.Clubs ?? 0}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="font-semibold text-xs md:text-sm tracking-tight text-[#20323a] dark:text-zinc-200">
                                            Clubes
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Detalles Generales (Grid layout) */}
                            <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                                    Detalles Generales
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                    <div className="space-y-0.5">
                                        <span className="text-xs text-gray-400 dark:text-zinc-500 block">Nombre del Evento</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{info.Nombre || "N/A"}</span>
                                    </div>

                                    <div className="space-y-0.5">
                                        <span className="text-xs text-gray-400 dark:text-zinc-500 block">Organizador</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{info.Organizador || "N/A"}</span>
                                    </div>

                                    <div className="space-y-0.5">
                                        <span className="text-xs text-gray-400 dark:text-zinc-500 block">Asociación</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{info.Asociacion || "N/A"}</span>
                                    </div>

                                    <div className="space-y-0.5">
                                        <span className="text-xs text-gray-400 dark:text-zinc-500 block">Límite de Participantes</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                                            {info.Limite_participantes ? `${info.Limite_participantes} atletas` : "Sin límite"}
                                        </span>
                                    </div>

                                    <div className="space-y-0.5">
                                        <span className="text-xs text-gray-400 dark:text-zinc-500 block">Ubicación y Sede</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                                            {info.Sede || "N/A"}{info.Lugar ? `, ${info.Lugar}` : ""}{info.Region ? ` (${info.Region})` : ""}
                                        </span>
                                    </div>

                                    <div className="space-y-0.5">
                                        <span className="text-xs text-gray-400 dark:text-zinc-500 block">Período del Evento</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                            {formatDate(info.Fini)} - {formatDate(info.Ffin)}
                                        </span>
                                    </div>

                                    <div className="space-y-0.5 md:col-span-2">
                                        <span className="text-xs text-gray-400 dark:text-zinc-500 block">Período de Inscripción</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                            {formatDate(info.F_ini_incripciones)} - {formatDate(info.fecha_fin_inscripciones)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {activeTab === "entrenadores" && (
                <div className="space-y-4">
                    <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        Entrenadores del Evento
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Aquí se mostrará la información y asignaciones de los entrenadores para este evento.
                    </p>
                    {/* Dejado en blanco por el momento */}
                </div>
            )}
            {activeTab === "clubes" && (
                <div className="space-y-4">
                    <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <ClubIcon className="w-4 h-4 text-blue-500" />
                        Clubes Participantes
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Aquí se listarán todos los clubes y delegaciones que forman parte del evento.
                    </p>
                    {/* Dejado en blanco por el momento */}
                </div>
            )}
            {activeTab === "asociaciones" && (
                <div className="space-y-4">
                    <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Users className="w-4 h-4 text-rose-500" />
                        Asociaciones Avaladas
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Aquí se detallará la información de las asociaciones estatales y regionales involucradas.
                    </p>
                    {/* Dejado en blanco por el momento */}
                </div>
            )}
        </div>
    )

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="h-[80vh] flex flex-col">
                    <DrawerHeader className="text-left shrink-0">
                        <DrawerTitle className="text-base font-bold text-gray-900 dark:text-white">
                            Detalles de Evento: {evento.Nombre}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-1 px-4 pb-6 overflow-hidden flex flex-col">
                        {renderTabsSelector()}
                        {renderTabContent()}
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[60vw] h-[75vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    <DialogTitle className="text-base font-bold text-gray-900 dark:text-white">
                        Detalles de Evento: {evento.Nombre}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 px-6 pt-0 overflow-hidden flex flex-col">
                    {renderTabsSelector()}
                    {renderTabContent()}
                </div>
            </DialogContent>
        </Dialog>
    )
}
