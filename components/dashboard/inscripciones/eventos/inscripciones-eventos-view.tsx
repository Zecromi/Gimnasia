"use client"

import { Suspense, useState, useCallback, useEffect, useMemo, lazy } from "react"
import { Search, Calendar as CalendarIcon, Plus, BrushCleaning } from "lucide-react"

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

import { getColumns } from "./inscripciones-columns"
import { DataTable } from "@/components/dashboard/data-table"
const RegisterEventDialog = lazy(() => import("./register-event-dialog").then(module => ({ default: module.RegisterEventDialog })))
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { EventosConfiguradosItem, getEventos, delInscripcion, InscripcionReportItem, InscripcionesReportParams } from "@/lib/evento-service"

import { useCatalogStore } from "@/lib/store/catalog-store"
import { useAuthStore } from "@/lib/store/auth-store"
import { useClubStore } from "@/lib/store/club-store"
import { ReportsTabContent } from "@/components/dashboard/super-admin/reports-tab-content"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { FileText, XIcon, Trash2 } from "lucide-react"
import { getClubs } from "@/lib/club-service"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export function InscripcionesEventosView() {
    const { Catalogo_eventos, fetchCatalogs } = useCatalogStore()
    const { clubs, setClubs } = useClubStore()
    const authData = useAuthStore((state) => state.authData)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<InscripcionReportItem | null>(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // eslint-disable-next-line eqeqeq
    const isClubAdmin = authData?.tipo_registro == 2
    const [isLoading, setIsLoading] = useState(true)
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
        const loadClubs = async () => {
            if (clubs.length === 0) {
                const response = await getClubs()
                if (response && response.View_Club_gral) {
                    setClubs(response.View_Club_gral)
                }
            }
        }
        loadClubs()
    }, [clubs.length, setClubs])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Filters
    const [filterId, setFilterId] = useState("")
    const [filterModalidad, setFilterModalidad] = useState("todas")
    const [filterOrganizador, setFilterOrganizador] = useState("todos")
    const [filterTipo, setFilterTipo] = useState("todos")
    const [filterRegion, setFilterRegion] = useState("todas")
    const [date, setDate] = useState<Date>()

    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const [selectedEvento, setSelectedEvento] = useState<EventosConfiguradosItem | null>(null)

    const handleRegister = useCallback((evento: EventosConfiguradosItem) => {
        setSelectedEvento(evento)
        setIsRegisterOpen(true)
    }, [])

    const handleDeleteClick = useCallback((item: InscripcionReportItem) => {
        setItemToDelete(item)
        setIsConfirmDeleteDialogOpen(true)
    }, [])

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return
        try {
            await delInscripcion(String(itemToDelete.id_evento), String(itemToDelete.id_afiliado))
            toast.success("Inscripción eliminada correctamente")
            setRefreshTrigger(prev => prev + 1)
            fetchData() // Refresh main events list
        } catch (error) {
            console.error("Error deleting inscription:", error)
            toast.error("Error al eliminar la inscripción")
        } finally {
            setIsConfirmDeleteDialogOpen(false)
            setItemToDelete(null)
        }
    }

    const columns = useMemo(() => getColumns(fetchData, handleRegister), [fetchData, handleRegister])

    const handleClearFilters = () => {
        setFilterId("")
        setFilterModalidad("todas")
        setFilterOrganizador("todos")
        setFilterTipo("todos")
        setFilterRegion("todas")
        setDate(undefined)
    }

    // Get unique values for dropdowns
    const uniqueModalidades = useMemo(() => Array.from(new Set(eventos.map(e => e.Modalidad).filter(Boolean))).sort(), [eventos])
    const uniqueOrganizadores = useMemo(() => Array.from(new Set(eventos.map(e => e.Organizador).filter(Boolean))).sort(), [eventos])
    const uniqueRegiones = useMemo(() => Array.from(new Set(eventos.map(e => e.Region).filter(Boolean))).sort(), [eventos])

    const filteredEventos = useMemo(() => {
        return eventos.filter((evento) => {
            if (filterId && !String(evento.id).includes(filterId)) return false
            if (filterModalidad !== "todas" && evento.Modalidad !== filterModalidad) return false
            if (filterOrganizador !== "todos" && evento.Organizador !== filterOrganizador) return false
            if (filterTipo !== "todos" && String(evento.id_Evento) !== filterTipo) return false
            if (filterRegion !== "todas" && evento.Region !== filterRegion) return false

            if (date) {
                try {
                    const eventDate = new Date(evento.F_ini_evento)
                    if (
                        eventDate.getFullYear() !== date.getFullYear() ||
                        eventDate.getMonth() !== date.getMonth() ||
                        eventDate.getDate() !== date.getDate()
                    ) {
                        return false
                    }
                } catch (e) {
                    console.warn("Invalid date format", evento.F_ini_evento)
                }
            }

            return true
        })
    }, [eventos, filterId, filterModalidad, filterOrganizador, filterTipo, filterRegion, date])

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
                                            placeholder="Buscar por ID..."
                                            value={filterId}
                                            onChange={(e) => setFilterId(e.target.value)}
                                        />
                                    </InputGroup>
                                    <InputGroup label="Modalidad :">
                                        <Select
                                            value={filterModalidad}
                                            onValueChange={setFilterModalidad}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                                {uniqueModalidades.map((m: string) => (
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
                                            value={filterOrganizador}
                                            onValueChange={setFilterOrganizador}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                                {uniqueOrganizadores.map((o: string) => (
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
                                            value={filterTipo}
                                            onValueChange={setFilterTipo}
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
                                            value={filterRegion}
                                            onValueChange={setFilterRegion}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                                {uniqueRegiones.map((r: string) => (
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
                        </div>
                        <div className="xl:col-span-1 flex flex-col items-center justify-center border-l pl-4 gap-2">
                            {isClubAdmin && (
                                <div className="flex flex-col gap-2">
                                    <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-full border-green-200 bg-green-50 hover:bg-green-100 text-green-600 shadow-sm"
                                                    >
                                                        <FileText className="h-5 w-5" />
                                                    </Button>
                                                </DialogTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>Generar Reporte</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <DialogContent
                                            showCloseButton={false}
                                            className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0"
                                            onInteractOutside={(e) => e.preventDefault()}
                                            onEscapeKeyDown={(e) => e.preventDefault()}
                                        >
                                            <DialogHeader className="sr-only">
                                                <DialogTitle>Reporte de Inscripciones</DialogTitle>
                                                <DialogDescription>
                                                    Genera y visualiza el reporte de inscripciones para tu club.
                                                </DialogDescription>
                                            </DialogHeader>
                                            {/* Close button strip — stays fixed, never scrolls */}
                                            <div className="flex justify-end px-3 pt-3 flex-shrink-0">
                                                <DialogClose className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring transition-opacity">
                                                    <XIcon className="h-4 w-4" />
                                                    <span className="sr-only">Cerrar</span>
                                                </DialogClose>
                                            </div>
                                            {/* Scrollable content */}
                                            <div className="flex-1 overflow-y-auto px-6 pb-6">
                                                <ReportsTabContent
                                                    defaultReportType="inscripciones"
                                                    forcedClubId={clubs.find(c => c.id === authData?.id)?.Club}
                                                    hideFilters={["id_evento", "id_afiliado", "nom_afiliado", "status", "report_type"]}
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-full border-red-200 bg-red-50 hover:bg-red-100 text-red-600 shadow-sm"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </DialogTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>Eliminar Inscripciones</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <DialogContent
                                            showCloseButton={false}
                                            className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0"
                                            onInteractOutside={(e) => e.preventDefault()}
                                            onEscapeKeyDown={(e) => e.preventDefault()}
                                        >
                                            <DialogHeader className="sr-only">
                                                <DialogTitle>Eliminar Inscripciones</DialogTitle>
                                                <DialogDescription>
                                                    Selecciona las inscripciones que deseas eliminar de los eventos.
                                                </DialogDescription>
                                            </DialogHeader>
                                            {/* Close button strip — stays fixed, never scrolls */}
                                            <div className="flex justify-end px-3 pt-3 flex-shrink-0">
                                                <DialogClose className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring transition-opacity">
                                                    <XIcon className="h-4 w-4" />
                                                    <span className="sr-only">Cerrar</span>
                                                </DialogClose>
                                            </div>
                                            {/* Scrollable content */}
                                            <div className="flex-1 overflow-y-auto px-6 pb-6">
                                                <ReportsTabContent
                                                    defaultReportType="inscripciones"
                                                    forcedClubId={clubs.find(c => c.id === authData?.id)?.Club}
                                                    hideFilters={["id_evento", "id_afiliado", "nom_afiliado", "status", "report_type"]}
                                                    enableActions={true}
                                                    onDeleteAction={handleDeleteClick}
                                                    refreshKey={refreshTrigger}
                                                    hideHeader={true}
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}


                        </div>
                    </div>
                </CardContent>
            </Card>

            {
                error ? (
                    <div className="text-center p-10 text-red-500">
                        <p>{error}</p>
                        <Button variant="outline" onClick={fetchData} className="mt-4">Reintentar</Button>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredEventos}
                        noResultsMessage="No existen registros de eventos"
                        headerClassName="bg-white dark:bg-teal-950"
                    />
                )
            }

            {
                selectedEvento && (
                    <Suspense fallback={null}>
                        <RegisterEventDialog
                            open={isRegisterOpen}
                            onOpenChange={setIsRegisterOpen}
                            eventoId={String(selectedEvento.id)}
                            eventoName={selectedEvento.Nombre}
                            modalidad={selectedEvento.Modalidad}
                            costo={selectedEvento.Costo_base}
                            fechaFinInscripcion={selectedEvento.F_fin_incripciones}
                            horaLimiteInscripcion={selectedEvento.Hora_limite_inscripciones}
                            limiteParticipantes={selectedEvento.Limite_participantes}
                            onSuccess={() => {
                                setIsRegisterOpen(false)
                                fetchData()
                            }}
                        />
                    </Suspense>
                )
            }

            <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro de eliminar esta inscripción?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la inscripción del afiliado <strong>{itemToDelete?.afiliado}</strong> al evento <strong>{itemToDelete?.evento}</strong>. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
