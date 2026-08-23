"use client"

import * as React from "react"
import { CheckCircle2, Users, ClubIcon, Layers, Gavel, Podium, Medal, Search, Calendars, MapPin, Landmark, CalendarDays, Clock, UserCheck, Info } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    EventosConfiguradosItem as Evento,
    getInfo_Eventos,
    getinfo_filtros,
    InfoEventoItem,
    InfoFiltroItem,
} from "@/lib/evento-service"

interface DetalleEventoDialogProps {
    evento: Evento
    children: React.ReactNode
}

type TabId = "resumen" | "atletas" | "entrenadores" | "jueces"

const tipoMap: Record<"atletas" | "entrenadores" | "jueces", string> = {
    atletas: "1",
    entrenadores: "2",
    jueces: "3",
}

const avatarTabColors: Record<"atletas" | "entrenadores" | "jueces", { avatarBorder: string; fallbackClass: string }> = {
    atletas: {
        avatarBorder: "border-orange-200 dark:border-orange-800/50",
        fallbackClass: "bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300",
    },
    entrenadores: {
        avatarBorder: "border-yellow-200 dark:border-yellow-800/50",
        fallbackClass: "bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300",
    },
    jueces: {
        avatarBorder: "border-green-200 dark:border-green-800/50",
        fallbackClass: "bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300",
    },
}

export function DetalleEventoDialog({ evento, children }: DetalleEventoDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState<TabId>("resumen")
    const [info, setInfo] = React.useState<InfoEventoItem | null>(null)
    const [loadingInfo, setLoadingInfo] = React.useState(false)

    const [filtroData, setFiltroData] = React.useState<Record<string, InfoFiltroItem[]>>({})
    const [loadingFiltro, setLoadingFiltro] = React.useState<Record<string, boolean>>({})
    const [filtroSearch, setFiltroSearch] = React.useState("")

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

    React.useEffect(() => {
        if (open && evento.id && activeTab !== "resumen") {
            const tipo = tipoMap[activeTab as "atletas" | "entrenadores" | "jueces"]
            if (tipo && !filtroData[activeTab]) {
                const fetchFiltro = async () => {
                    setLoadingFiltro((prev) => ({ ...prev, [activeTab]: true }))
                    try {
                        const data = await getinfo_filtros(String(evento.id), tipo)
                        setFiltroData((prev) => ({
                            ...prev,
                            [activeTab]: data?.info_event || [],
                        }))
                    } catch (error) {
                        console.error(`Error fetching ${activeTab} data:`, error)
                    } finally {
                        setLoadingFiltro((prev) => ({ ...prev, [activeTab]: false }))
                    }
                }
                fetchFiltro()
            }
        }
    }, [open, evento.id, activeTab, filtroData])

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

    const getInitials = (name?: string) => {
        if (!name) return "--"
        const trimmed = name.trim()
        if (!trimmed) return "--"
        return trimmed.slice(0, 2).toUpperCase()
    }

    const tabs = [
        {
            id: "resumen" as TabId,
            text: "Resumen",
            icon: CheckCircle2,
            color: "bg-blue-200/60 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-500/20",
        },
        {
            id: "atletas" as TabId,
            text: "Atletas",
            icon: Medal,
            color: "bg-orange-200/60 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 border-orange-500/20",
        },
        {
            id: "entrenadores" as TabId,
            text: "Entrenadores",
            icon: Podium,
            color: "bg-yellow-200/60 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-yellow-500/20",
        },
        {
            id: "jueces" as TabId,
            text: "Jueces",
            icon: Gavel,
            color: "bg-green-200/60 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-500/20",
        },
    ]

    const currentList = activeTab !== "resumen" ? filtroData[activeTab] || [] : []
    const filteredList = currentList.filter((item) => {
        if (!filtroSearch.trim()) return true
        const query = filtroSearch.toLowerCase()
        return (
            (item.Column1 && item.Column1.toLowerCase().includes(query)) ||
            (item.Curp && item.Curp.toLowerCase().includes(query)) ||
            (item.Club && item.Club.toLowerCase().includes(query)) ||
            (item.Categoria && item.Categoria.toLowerCase().includes(query)) ||
            (item.telefono_1 && item.telefono_1.toLowerCase().includes(query)) ||
            (item.telefono_2 && item.telefono_2.toLowerCase().includes(query)) ||
            String(item.id_afiliado).includes(query)
        )
    })

    const currentAvatarStyle = (activeTab !== "resumen" && avatarTabColors[activeTab]) || {
        avatarBorder: "border-gray-200 dark:border-zinc-700/60",
        fallbackClass: "bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300",
    }

    const renderTabsSelector = () => (
        <div className="flex justify-center w-full py-0 pt-0">
            <div className="inline-flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-[24px] shadow-inner">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    const bgClass = isActive
                        ? tab.color
                        : "bg-transparent hover:bg-gray-200/50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400"

                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id)
                                setFiltroSearch("")
                            }}
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
        <div className="mt-4 p-5 border border-gray-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950/40 flex-1 flex flex-col justify-between overflow-hidden">
            {activeTab === "resumen" && (
                <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
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
                            {/* 1. Conteos (Cards layout) */}
                            <div className="grid grid-cols-3 gap-3">
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

                            {/* 2. Detalles Generales (Grid de tarjetas con iconos) */}
                            <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-5 space-y-3.5">
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400">
                                        Detalles Generales del Evento
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Sede y Ubicación */}
                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/70 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-800/80 hover:border-emerald-200/60 dark:hover:border-emerald-800/40 transition-colors group">
                                        <div className="p-2 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-0.5">
                                                Sede y Ubicación
                                            </span>
                                            <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug">
                                                {info.Sede || "Sede no especificada"}
                                            </p>
                                            {(info.Lugar || info.Region) && (
                                                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">
                                                    {[info.Lugar, info.Region ? `Región ${info.Region}` : null].filter(Boolean).join(" · ")}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Organización & Asociación */}
                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/70 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-800/80 hover:border-blue-200/60 dark:hover:border-blue-800/40 transition-colors group">
                                        <div className="p-2 rounded-xl bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                            <Landmark className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-0.5">
                                                Organización
                                            </span>
                                            <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug">
                                                {info.Organizador || "N/A"}
                                            </p>
                                            {info.Asociacion && (
                                                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">
                                                    Asociación: {info.Asociacion}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Límite de Participantes */}
                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/70 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-800/80 hover:border-purple-200/60 dark:hover:border-purple-800/40 transition-colors group">
                                        <div className="p-2 rounded-xl bg-purple-100/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                            <UserCheck className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-0.5">
                                                Límite de Participantes
                                            </span>
                                            <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug">
                                                {info.Limite_participantes ? `${info.Limite_participantes} atletas permitidos` : "Sin límite de cupo"}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">
                                                {info.Limite_participantes ? "Cupo restringido por registro" : "Abierto a todos los inscritos"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Período del Evento */}
                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/70 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-800/80 hover:border-amber-200/60 dark:hover:border-amber-800/40 transition-colors group">
                                        <div className="p-2 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                            <CalendarDays className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-0.5">
                                                Período del Evento
                                            </span>
                                            <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug">
                                                {formatDate(info.Fini)} al {formatDate(info.Ffin)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">
                                                Fechas oficiales de competencia
                                            </p>
                                        </div>
                                    </div>

                                    {/* Período de Inscripción (Full Width) */}
                                    <div className="md:col-span-2 flex items-start gap-3.5 p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 hover:border-teal-300 dark:hover:border-teal-800/60 transition-colors group">
                                        <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                                                    Período de Inscripción
                                                </span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100/80 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 border border-teal-300/40">
                                                    Oficial
                                                </span>
                                            </div>
                                            <p className="text-xs md:text-sm font-bold text-teal-950 dark:text-teal-100 leading-snug">
                                                {formatDate(info.F_ini_incripciones)} al {formatDate(info.fecha_fin_inscripciones)}
                                            </p>
                                            <p className="text-xs text-teal-700/90 dark:text-teal-300/80 mt-0.5 font-medium">
                                                Plazo establecido para el registro y confirmación de afiliados participantes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab !== "resumen" && (
                <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-hidden">
                    {/* Search & Counter bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Buscar ${activeTab}...`}
                                value={filtroSearch}
                                onChange={(e) => setFiltroSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-gray-800 dark:text-gray-200 placeholder-gray-400"
                            />
                        </div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 self-end sm:self-center">
                            Total: <span className="font-bold text-gray-900 dark:text-white">{filteredList.length}</span> {activeTab}
                        </div>
                    </div>

                    {/* Table container */}
                    <div className="flex-1 overflow-auto border border-gray-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/30">
                        {loadingFiltro[activeTab] ? (
                            <div className="flex flex-col items-center justify-center py-16 space-y-3">
                                <div className="w-7 h-7 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    Cargando lista de {activeTab}...
                                </p>
                            </div>
                        ) : filteredList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {filtroSearch
                                        ? "No se encontraron registros con el término buscado."
                                        : `No hay ${activeTab} registrados en este evento.`}
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-gray-50/90 dark:bg-zinc-900/90 sticky top-0 z-10 backdrop-blur-sm">
                                    <TableRow className="border-b border-gray-100 dark:border-zinc-800">
                                        <TableHead className="w-14 text-center font-bold text-gray-700 dark:text-gray-300">ID</TableHead>
                                        <TableHead className="w-12 text-center font-bold text-gray-700 dark:text-gray-300">Perfil</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-gray-300">Nombre</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-gray-300">CURP</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-gray-300">Categoría</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-gray-300">Club</TableHead>
                                        <TableHead className="font-bold text-gray-700 dark:text-gray-300">Teléfono</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredList.map((item, idx) => (
                                        <TableRow
                                            key={`${item.id_afiliado}-${idx}`}
                                            className="hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 border-b border-gray-100 dark:border-zinc-800/60 transition-colors"
                                        >
                                            <TableCell className="text-center font-mono text-xs text-gray-400 dark:text-zinc-500 py-2.5">
                                                {item.id_afiliado}
                                            </TableCell>
                                            <TableCell className="w-12 text-center py-2.0">
                                                <Avatar className={cn("h-8 w-8 mx-auto border shadow-xs transition-colors", currentAvatarStyle.avatarBorder)}>
                                                    <AvatarImage src="" alt={item.Column1 || ""} />
                                                    <AvatarFallback className={cn("text-[11px] font-bold transition-colors", currentAvatarStyle.fallbackClass)}>
                                                        {getInitials(item.Column1)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-semibold text-gray-900 dark:text-gray-100 py-2.5">
                                                {item.Column1 || "N/A"}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-gray-600 dark:text-zinc-400 py-2.5">
                                                {item.Curp || "-"}
                                            </TableCell>
                                            <TableCell className="py-2.5">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/30">
                                                    {item.Categoria || "General"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-700 dark:text-zinc-300 font-medium py-2.5">
                                                {item.Club || "-"}
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-500 dark:text-zinc-400 font-mono py-2.5">
                                                {item.telefono_1 || item.telefono_2 || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
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
                <DrawerContent className="h-[85vh] flex flex-col">
                    <DrawerHeader className="text-left shrink-0 pb-2">
                        <DrawerTitle className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-gray-900 dark:text-white">
                            <Calendars className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0" />
                            <span>
                                Detalles de <span className="font-serif italic font-normal text-teal-600 dark:text-teal-400">Evento</span>
                            </span>
                        </DrawerTitle>
                        <DrawerDescription className="text-xs text-muted-foreground line-clamp-1">
                            {evento.Nombre ? `${evento.Nombre} — Resumen y participantes registrados.` : "Consulta la información general y lista de participantes."}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex-1 px-4 pb-6 overflow-hidden flex flex-col min-h-0">
                        {renderTabsSelector()}
                        {renderTabContent()}
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[80vw] xl:max-w-[70vw] h-[80vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 shrink-0 space-y-1">
                    <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2.5 text-gray-900 dark:text-white">
                        <Calendars className="w-6 h-6 text-teal-700 dark:text-teal-400 shrink-0" />
                        <span>
                            Detalles de <span className="font-serif italic font-normal text-teal-600 dark:text-teal-400">Evento</span>
                            {evento.Nombre ? (
                                <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm ml-2.5 font-sans font-normal opacity-90">
                                    · {evento.Nombre}
                                </span>
                            ) : null}
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Consulta la información general, estadísticas y listas de atletas, entrenadores y jueces registrados en el evento.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 px-6 pt-0 pb-6 overflow-hidden flex flex-col min-h-0">
                    {renderTabsSelector()}
                    {renderTabContent()}
                </div>
            </DialogContent>
        </Dialog>
    )
}

