"use client"

import { Suspense, lazy, useEffect, useState, useCallback, useMemo } from "react"
import { BrushCleaning, Calendar as CalendarIcon, CheckCircle2, Clock, Users, ClubIcon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { getColumns } from "./eventos-columns"
import { DataTable } from "../data-table"
const NewEventoDialog = lazy(() => import("./new-evento-dialog").then(module => ({ default: module.NewEventoDialog })))
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { getEventos, EventosConfiguradosItem } from "@/lib/evento-service"
import { useCatalogStore } from "@/lib/store/catalog-store"

import { StatusLegend } from "@/components/ui/status-legend"

export const STATUS_INDICATORS = [
    { color: "bg-emerald-200/60 dark:bg-emerald-900/40", icon: CheckCircle2, text: "Atletas" },
    { color: "bg-amber-200/60 dark:bg-amber-900/40", icon: Clock, text: "Entrenadores" },
    { color: "bg-blue-200/60 dark:bg-blue-900/40", icon: ClubIcon, text: "Clubes" },
    { color: "bg-rose-200/60 dark:bg-rose-900/40", icon: Users, text: "Asociaciones" }
];

export function EventosView() {
    const { Catalogo_eventos, fetchCatalogs } = useCatalogStore()
    const [isLoading, setIsLoading] = useState(true)
    const [eventos, setEventos] = useState<EventosConfiguradosItem[]>([])

    // Filters
    const [filterId, setFilterId] = useState("")
    const [filterOrganizador, setFilterOrganizador] = useState("todos")
    const [filterTipo, setFilterTipo] = useState("todos")
    const [filterRegion, setFilterRegion] = useState("todas")
    const [date, setDate] = useState<Date>()
    const [displayLimit, setDisplayLimit] = useState(50)

    // Modalidad & Pirámide placeholders (no data in model yet)
    // const [filterModalidad, setFilterModalidad] = useState("todas")
    // const [filterPiramide, setFilterPiramide] = useState("todas")

    const fetchData = useCallback(async () => {
        try {
            const data = await getEventos()
            if (data && data.Eventos_configurados) {
                setEventos(data.Eventos_configurados)
                setDisplayLimit(50)
            }
        } catch (error) {
            console.error("Error fetching events:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
        fetchCatalogs()
    }, [fetchData, fetchCatalogs])

    const columns = useMemo(() => getColumns(fetchData), [fetchData])

    // Derived unique options
    const uniqueOrganizadores = useMemo(() => {
        const orgs = new Set(eventos.map(e => e.Organizador).filter(Boolean))
        return Array.from(orgs).sort()
    }, [eventos])

    const uniqueRegions = useMemo(() => {
        const regs = new Set(eventos.map(e => e.Region).filter(Boolean))
        return Array.from(regs).sort()
    }, [eventos])

    // Filtering Logic
    const filteredEventos = useMemo(() => {
        return eventos.filter(evento => {
            // Filter by ID
            if (filterId && !String(evento.id).includes(filterId)) return false

            // Filter by Organizador
            if (filterOrganizador !== "todos" && evento.Organizador !== filterOrganizador) return false

            // Filter by Tipo de Evento (using id_Evento)
            if (filterTipo !== "todos" && String(evento.id_Evento) !== filterTipo) return false

            // Filter by Region
            if (filterRegion !== "todas" && evento.Region !== filterRegion) return false

            // Filter by Date
            if (date) {
                const eventDate = new Date(evento.F_ini_evento)
                // Compare Year-Month-Day
                if (
                    eventDate.getFullYear() !== date.getFullYear() ||
                    eventDate.getMonth() !== date.getMonth() ||
                    eventDate.getDate() !== date.getDate()
                ) {
                    return false
                }
            }

            return true
        })
    }, [eventos, filterId, filterOrganizador, filterTipo, filterRegion, date])

    const handleClearFilters = () => {
        setFilterId("")
        setFilterOrganizador("todos")
        setFilterTipo("todos")
        setFilterRegion("todas")
        setDate(undefined)
        setDisplayLimit(50)
    }

    const handleLoadMore = useCallback(() => {
        if (displayLimit < filteredEventos.length) {
            console.log("Loading more eventos...")
            setDisplayLimit(prev => prev + 50)
        }
    }, [displayLimit, filteredEventos.length])

    const displayedEventos = useMemo(() => {
        return filteredEventos.slice(0, displayLimit)
    }, [filteredEventos, displayLimit])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card className="rounded-2xl border-none shadow-none bg-gray-50 dark:bg-zinc-900">
                    <CardHeader className="pt-2 pb-0">
                        <CardTitle>
                            <h2 className="text-lg font-bold">Eventos</h2>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-2">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-11">
                                <div className="grid gap-4">
                                    <div className="grid gap-3 md:grid-cols-12">
                                        <Skeleton className="h-8 md:col-span-3" />
                                        <Skeleton className="h-8 md:col-span-3" />
                                        <Skeleton className="h-8 md:col-span-3" />
                                        <Skeleton className="h-8 md:col-span-3" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1 flex items-center justify-center border-l pl-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card className="rounded-2xl border-none shadow-none bg-gray-50 dark:bg-zinc-900">
                <CardHeader className="pt-2 pb-0">
                    <CardTitle>
                        <h2 className="text-lg font-bold">Eventos</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                    <div className="flex flex-col xl:grid xl:grid-cols-12 gap-4">
                        <div className="xl:col-span-11">
                            <div className="grid gap-4">
                                {/* Row 1 */}
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <InputGroup label="No. Evento :" htmlFor="no-evento">
                                        <Input
                                            id="no-evento"
                                            className="h-8"
                                            placeholder="Buscar por ID..."
                                            value={filterId}
                                            onChange={(e) => setFilterId(e.target.value)}
                                        />
                                    </InputGroup>
                                    <InputGroup label="Modalidad :">
                                        <Select disabled>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Todas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Pirámide :">
                                        <Select disabled>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Todas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Organizador :">
                                        <Select value={filterOrganizador} onValueChange={setFilterOrganizador}>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                                {uniqueOrganizadores.map(org => (
                                                    <SelectItem key={org} value={org}>{org}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                </div>

                                {/* Row 2 */}
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
                                    <InputGroup label="Tipo de evento :">
                                        <Select value={filterTipo} onValueChange={setFilterTipo}>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                                {Catalogo_eventos.map(tipo => (
                                                    <SelectItem key={tipo.id_Evento} value={String(tipo.id_Evento)}>
                                                        {tipo.Nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Región de evento :">
                                        <Select value={filterRegion} onValueChange={setFilterRegion}>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                                {uniqueRegions.map(reg => (
                                                    <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Fecha de evento :">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full h-8 pl-3 text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    {date ? (
                                                        format(date, "P", { locale: es })
                                                    ) : (
                                                        <span>Seleccionar fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    locale={es}
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </InputGroup>
                                    <div>
                                        <Button
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white h-8"
                                            onClick={handleClearFilters}
                                        >
                                            <BrushCleaning className="mr-2 h-4 w-4" />
                                            Limpiar Filtros
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <StatusLegend items={STATUS_INDICATORS} />
                            </div>
                        </div>
                        <div className="flex items-center justify-center xl:col-span-1 xl:border-l xl:pl-4 border-t xl:border-t-0 pt-4 xl:pt-0">
                            <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
                                <NewEventoDialog onEventSaved={fetchData} />
                            </Suspense>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DataTable
                columns={columns}
                data={displayedEventos}
                onEndReached={handleLoadMore}
            />
        </div>
    )
}
