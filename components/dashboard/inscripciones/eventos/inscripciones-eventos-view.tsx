"use client"

import { Suspense, useState, useCallback, useEffect } from "react"
import { Search, Calendar as CalendarIcon, Plus, Eraser } from "lucide-react"

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

import { columns } from "./inscripciones-columns"
import { DataTable } from "@/components/dashboard/data-table"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { EventosConfiguradosItem, getEventos } from "@/lib/evento-service"
import { useCatalogStore } from "@/lib/store/catalog-store"

export function InscripcionesEventosView() {
    const { Catalogo_eventos, fetchCatalogs } = useCatalogStore()
    const [isLoading, setIsLoading] = useState(true)
    const [date, setDate] = useState<Date>()
    const [eventos, setEventos] = useState<EventosConfiguradosItem[]>([])
    // Estado para manejo de errores de carga (simulado por ahora)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            await fetchCatalogs()
            const data = await getEventos()
            if (data && data.Eventos_configurados) {
                setEventos(data.Eventos_configurados)
            }
        } catch (error) {
            console.error("Error fetching events:", error)
            setError("Error al cargar los eventos")
        } finally {
            setIsLoading(false)
        }
    }, [fetchCatalogs])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const [filters, setFilters] = useState({
        id: "",
        modalidad: "todas",
        organizador: "todos",
        tipoEvento: "todos",
        region: "todas",
    })

    const [appliedFilters, setAppliedFilters] = useState({
        id: "",
        modalidad: "todas",
        organizador: "todos",
        tipoEvento: "todos",
        region: "todas",
        date: undefined as Date | undefined,
    })

    const handleFilter = () => {
        setAppliedFilters({
            ...filters,
            date,
        })
    }

    const handleClearFilters = () => {
        const resetFilters = {
            id: "",
            modalidad: "todas",
            organizador: "todos",
            tipoEvento: "todos",
            region: "todas",
        }
        setFilters(resetFilters)
        setAppliedFilters({
            ...resetFilters,
            date: undefined
        })
        setDate(undefined)
    }

    // Get unique values for dropdowns
    const uniqueModalidades = Array.from(new Set(eventos.map(e => e.Modalidad).filter(Boolean))).sort()
    const uniqueOrganizadores = Array.from(new Set(eventos.map(e => e.Organizador).filter(Boolean))).sort()
    const uniqueRegiones = Array.from(new Set(eventos.map(e => e.Region).filter(Boolean))).sort()

    const filteredEventos = eventos.filter((evento) => {
        const matchesId = appliedFilters.id ? String(evento.id).includes(appliedFilters.id) : true
        const matchesModalidad = appliedFilters.modalidad !== "todas" ? evento.Modalidad === appliedFilters.modalidad : true
        // Piramide matches not implemented as field missing
        const matchesOrganizador = appliedFilters.organizador !== "todos" ? evento.Organizador === appliedFilters.organizador : true

        const matchesTipoEvento = appliedFilters.tipoEvento !== "todos"
            ? String(evento.id_Evento) === appliedFilters.tipoEvento
            : true

        const matchesRegion = appliedFilters.region !== "todas" ? evento.Region === appliedFilters.region : true

        let matchesDate = true
        if (appliedFilters.date) {
            // Compare dates (assuming F_ini_evento is YYYY-MM-DD or comparable string)
            // If F_ini_evento is a full ISO string, we might need to parse it. 
            // Based on previous files, it seems to be YYYY-MM-DD or similar.
            // Let's try direct string match if format matches, otherwise parse.
            // Safe bet: check if the event starts on the selected day.
            try {
                const eventDate = new Date(evento.F_ini_evento)
                const filterDate = appliedFilters.date
                matchesDate = eventDate.getFullYear() === filterDate.getFullYear() &&
                    eventDate.getMonth() === filterDate.getMonth() &&
                    eventDate.getDate() === filterDate.getDate()
            } catch (e) {
                console.warn("Invalid date format", evento.F_ini_evento)
            }
        }

        return matchesId && matchesModalidad && matchesOrganizador && matchesTipoEvento && matchesRegion && matchesDate
    })

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card className="rounded-2xl border-none shadow-none bg-gray-50 dark:bg-zinc-900">
                    <CardHeader className="pt-2 pb-0">
                        <CardTitle>
                            <h2 className="text-lg font-bold">Inscripciones de eventos</h2>
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
                                    <div className="grid gap-3 md:grid-cols-12">
                                        <Skeleton className="h-8 md:col-span-3" />
                                        <Skeleton className="h-8 md:col-span-3" />
                                        <Skeleton className="h-8 md:col-span-3" />
                                        <Skeleton className="h-8 md:col-span-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6" >
            <Card className="rounded-2xl border-none shadow-none bg-gray-50 dark:bg-zinc-900">
                <CardHeader className="pt-2 pb-0">
                    <CardTitle>
                        <h2 className="text-lg font-bold">Inscripciones de eventos</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                    <div className="flex flex-col xl:grid xl:grid-cols-12 gap-4">
                        <div className="xl:col-span-11">
                            <div className="grid gap-4">
                                {/* Row 1 */}
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
                                    <InputGroup label="No. Evento :" htmlFor="no-evento">
                                        <Input
                                            id="no-evento"
                                            className="h-8"
                                            value={filters.id}
                                            onChange={(e) => setFilters(prev => ({ ...prev, id: e.target.value }))}
                                        />
                                    </InputGroup>
                                    <InputGroup label="Modalidad :">
                                        <Select
                                            value={filters.modalidad}
                                            onValueChange={(val) => setFilters(prev => ({ ...prev, modalidad: val }))}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                                {uniqueModalidades.map(m => (
                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Pirámide :">
                                        <Select disabled>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Organizador :">
                                        <Select
                                            value={filters.organizador}
                                            onValueChange={(val) => setFilters(prev => ({ ...prev, organizador: val }))}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                                {uniqueOrganizadores.map(o => (
                                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                </div>

                                {/* Row 2 */}
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
                                    <InputGroup label="Tipo de evento :">
                                        <Select
                                            value={filters.tipoEvento}
                                            onValueChange={(val) => setFilters(prev => ({ ...prev, tipoEvento: val }))}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                                {Catalogo_eventos.map((item) => (
                                                    <SelectItem key={item.id_Evento} value={String(item.id_Evento)}>
                                                        {item.Nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Región de evento :">
                                        <Select
                                            value={filters.region}
                                            onValueChange={(val) => setFilters(prev => ({ ...prev, region: val }))}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                                {uniqueRegiones.map(r => (
                                                    <SelectItem key={r} value={r}>{r}</SelectItem>
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
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </InputGroup>
                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white h-8"
                                            onClick={handleFilter}
                                        >
                                            <Search className="mr-2 h-4 w-4" />
                                            Filtrar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 h-8"
                                            onClick={handleClearFilters}
                                        >
                                            <Eraser className="mr-2 h-4 w-4" />
                                            Limpiar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {error ? (
                <div className="text-center p-10 text-red-500">
                    <p>{error}</p>
                    <Button variant="outline" onClick={fetchData} className="mt-4">Reintentar</Button>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredEventos}
                    noResultsMessage="No existen registros de eventos"
                />
            )}
        </div >
    )
}
