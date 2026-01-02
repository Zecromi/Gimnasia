"use client"

import * as React from "react"
import { CircleFadingArrowUp, Upload, Database, FileText, Image, Receipt, BookOpen } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { EventoResponseItem as Evento, createEvento, SetEventoPayload, ConfiguracionItem, NivelItem, AdicionalItem, EventoItem } from "@/lib/evento-service"
import { CalendarPlus, Save, Calendar as CalendarIcon, Medal, Hash, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getGlobalInfo, ModalidadItem, ModalidadDetalleItem } from "@/lib/club-service"
import { eventoSchema, EventoFormValues } from "@/lib/schemas/evento/evento-schema"
import { editEventoSchema, EditEventoFormValues } from "@/lib/schemas/evento/edit-evento-schema"
import { toast } from "sonner"

interface EditEventoDialogProps {
    evento: Evento
    children: React.ReactNode
}

export function EditEventoDialog({ evento, children }: EditEventoDialogProps) {
    const [open, setOpen] = React.useState(false)
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="h-[95vh]">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Editar Evento: {evento.Nombre}</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-1 px-4 overflow-hidden">
                        <EditEventoTabs id="edit-evento-form-mobile" evento={evento} />
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
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] h-[calc(90vh-150px)] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Editar Evento: {evento.Nombre}</DialogTitle>
                </DialogHeader>
                <div className="w-full overflow-hidden">
                    <EditEventoTabs id="edit-evento-form-desktop" evento={evento} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

function EditEventoTabs({ className, id, evento }: { className?: string, id: string, evento: Evento }) {
    const tabsConfig = [
        {
            value: "general",
            icon: FileText,
            label: "Información general",
            tooltip: "Información General",
            content: <GeneralInfoForm id={`${id}-general`} evento={evento} />,
            className: "space-y-4"
        },
        {
            value: "actualizar",
            icon: Save,
            label: "Actualizar Evento",
            tooltip: "Actualizar Evento",
            content: <ActualizaEventoForm id={`${id}-actualizar`} evento={evento} />
        },
        {
            value: "modalidades",
            icon: Database,
            label: "Modalidades",
            tooltip: "Modalidades",
            content: <ModalidadesForm id={`${id}-modalidades`} evento={evento} />
        },
        {
            value: "imagen",
            icon: Image,
            label: "Imagen",
            tooltip: "Imagen del Evento",
            content: <PlaceholderForm title="Imagen" />
        },
        {
            value: "memorias",
            icon: BookOpen,
            label: "Memorias",
            tooltip: "Memorias del Evento",
            content: <PlaceholderForm title="Memorias" icon={BookOpen} />
        },
        {
            value: "facturas",
            icon: Receipt,
            label: "Facturas",
            tooltip: "Facturas",
            content: <PlaceholderForm title="Facturas" icon={Receipt} />
        }
    ]

    return (
        <Tabs defaultValue="general" className="h-auto flex flex-col">
            <div className="px-6 pt-1">
                <TabsList className="flex w-full sm:w-auto h-auto p-1 bg-muted/80 gap-1">
                    {tabsConfig.map((tab) => (
                        <TooltipProvider key={tab.value}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <TabsTrigger value={tab.value} className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                        <div className="flex flex-col items-center gap-1">
                                            <tab.icon className="h-4 w-4" />
                                            <span className="text-[10px] hidden sm:inline-block">{tab.label}</span>
                                        </div>
                                        <span className="sr-only">{tab.tooltip}</span>
                                    </TabsTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{tab.tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-auto max-h-[calc(90vh-150px)]">
                    <div className="p-6">
                        {tabsConfig.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value} className={cn("m-0", tab.className)}>
                                {tab.content}
                            </TabsContent>
                        ))}
                    </div>
                </ScrollArea>
            </div>

        </Tabs>
    )
}

import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Clock, Trophy, Globe, User, Building2, Users } from "lucide-react"

function GeneralInfoForm({ id, evento }: { id: string, evento: Evento }) {
    return (
        <div className="space-y-8 px-2">

            {/* Header / Status & Main Date */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-muted/50 p-4 rounded-lg border border-dashed border-teal-200 dark:border-teal-900">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-teal-700 dark:text-teal-400">
                        {evento.Nombre}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <span className="font-semibold mr-2 text-foreground">No. Evento:</span>
                        {evento.id_Evento}
                    </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                    <Badge variant={evento.Status === 'Abierto' ? 'default' : 'secondary'} className={`${evento.Status === 'Abierto' ? 'bg-teal-600 hover:bg-teal-700' : ''} text-base px-4 py-1`}>
                        {evento.Status}
                    </Badge>
                    <div className="flex items-center text-sm font-medium">
                        <Clock className="w-4 h-4 mr-2 text-teal-600" />
                        <span>Inscripción hasta: {evento.Hora_limite_inscripciones}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1: Core Details */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground border-b pb-2 mb-4">Detalles del Evento</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                                    <Trophy className="w-3.5 h-3.5 mr-1.5" />
                                    Tipo
                                </p>
                                <p className="font-medium mt-1">Competencia</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                                    Región
                                </p>
                                <p className="font-medium mt-1">{evento.Region}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                                    <User className="w-3.5 h-3.5 mr-1.5" />
                                    Organizador
                                </p>
                                <p className="font-medium mt-1">{evento.Organizador}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                                    <Building2 className="w-3.5 h-3.5 mr-1.5" />
                                    Asociación
                                </p>
                                <p className="font-medium mt-1">{evento.Asociacion}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                                <Users className="w-3.5 h-3.5 mr-1.5" />
                                Límite de participantes
                            </p>
                            <Badge variant="outline" className="mt-1 border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-950/30">
                                {evento.Limite_participantes === 0 ? "Ilimitado" : evento.Limite_participantes}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Column 2: Dates & Location */}
                <div className="space-y-6">
                    {/* Location */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground border-b pb-2 mb-4">Ubicación</h4>
                        <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-md">
                            <MapPin className="w-5 h-5 text-teal-600 mt-0.5" />
                            <div>
                                <p className="font-semibold">{evento.Sede}</p>
                                <p className="text-sm text-muted-foreground">{evento.Lugar}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground border-b pb-2 mb-4">Fechas Importantes</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Fecha de Evento</span>
                                <Badge variant="outline" className="flex gap-2 py-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {evento.F_ini_evento.split('T')[0]}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Inicio Inscripción</span>
                                <Badge variant="outline" className="flex gap-2 py-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {evento.F_ini_incripciones.split('T')[0]}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Fin Inscripción</span>
                                <Badge variant="outline" className="flex gap-2 py-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {evento.F_fin_incripciones.split('T')[0]}
                                </Badge>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

function ModalidadesForm({ id, evento }: { id: string, evento: Evento }) {
    const [modalidades, setModalidades] = React.useState<ModalidadItem[]>([])
    const [modalidadesDetalle, setModalidadesDetalle] = React.useState<ModalidadDetalleItem[]>([])
    const [isCustomModality, setIsCustomModality] = React.useState(false)
    const [newModality, setNewModality] = React.useState({
        descripcion: "",
        costo: "",
        configuracion: ""
    })
    const [selectedDetails, setSelectedDetails] = React.useState<Record<string, boolean>>({})
    const [detailValues, setDetailValues] = React.useState<Record<string, { costo: string, descripcion: string }>>({})
    const [selectedModalities, setSelectedModalities] = React.useState<Record<string, boolean>>({})
    const [errors, setErrors] = React.useState<Record<string, string[] | undefined>>({})
    const [isValid, setIsValid] = React.useState(false)

    React.useEffect(() => {
        const hasSelection = Object.values(selectedModalities).some(v => v)
        setIsValid(hasSelection)
    }, [selectedModalities])

    const toggleModality = React.useCallback((id: string) => {
        setSelectedModalities(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }, [])

    const toggleDetail = React.useCallback((key: string) => {
        setSelectedDetails(prev => {
            const newState = !prev[key]
            if (!newState) {
                setDetailValues(prevValues => ({
                    ...prevValues,
                    [key]: { costo: "", descripcion: "" }
                }))
            }
            return {
                ...prev,
                [key]: newState
            }
        })
    }, [])

    const updateDetailValue = React.useCallback((key: string, field: 'costo' | 'descripcion', value: string) => {
        setDetailValues(prev => ({
            ...prev,
            [key]: {
                ...prev[key] || { costo: "", descripcion: "" },
                [field]: value
            }
        }))
    }, [])

    const hasNewData = Object.values(newModality).some(value => value.trim() !== "")

    const groupedDetails = React.useMemo(() => {
        const grouped: Record<number, ModalidadDetalleItem[]> = {}
        modalidadesDetalle.forEach(det => {
            if (!grouped[det.id]) grouped[det.id] = []
            grouped[det.id].push(det)
        })
        return grouped
    }, [modalidadesDetalle])

    const grandTotal = React.useMemo(() => {
        let total = 0
        if (isCustomModality) {
            const cost = parseFloat(newModality.costo)
            if (!isNaN(cost)) total += cost
        }
        Object.keys(selectedDetails).forEach((key) => {
            if (selectedDetails[key]) {
                const cost = parseFloat(detailValues[key]?.costo || "0")
                if (!isNaN(cost)) total += cost
            }
        })
        return total
    }, [isCustomModality, newModality.costo, selectedDetails, detailValues])

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getGlobalInfo();
                if (data.Modalidades) {
                    setModalidades(data.Modalidades);
                }
                if (data.View_Modalidades_detalle) {
                    setModalidadesDetalle(data.View_Modalidades_detalle);
                }
            } catch (error) {
                console.error("Error fetching modalities:", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const configuracionData: ConfiguracionItem[] = Object.keys(selectedModalities)
            .filter(key => selectedModalities[key])
            .map(modIdStr => {
                let sumCost = 0
                Object.keys(selectedDetails).forEach(detKey => {
                    if (selectedDetails[detKey] && detKey.startsWith(`det-${modIdStr}-`)) {
                        const val = parseFloat(detailValues[detKey]?.costo || "0")
                        if (!isNaN(val)) sumCost += val
                    }
                })

                return {
                    id_modalidad: modIdStr,
                    costo_base: sumCost.toString(),
                    costo_grupo: "0",
                    es_grupo: "0"
                }
            })

        const nivelesData: NivelItem[] = []
        Object.keys(selectedDetails).forEach(key => {
            if (selectedDetails[key]) {
                const parts = key.split('-')
                if (parts.length === 3) {
                    const modId = parseInt(parts[1])
                    const idx = parseInt(parts[2])
                    const detail = groupedDetails[modId]?.[idx]
                    if (detail) {
                        nivelesData.push({
                            id_modalidad: parts[1],
                            id_nivel: String(detail.id_nivel),
                            costo: detailValues[key]?.costo || "0"
                        })
                    }
                }
            }
        })

        const adicionalesData: AdicionalItem[] = []
        if (isCustomModality) {
            adicionalesData.push({
                descripcion: newModality.descripcion,
                costo_base: newModality.costo
            })
        }

        Object.keys(selectedDetails).forEach(key => {
            if (selectedDetails[key]) {
                const values = detailValues[key]
                if (values && (values.costo || values.descripcion)) {
                    adicionalesData.push({
                        descripcion: values.descripcion,
                        costo_base: values.costo
                    })
                }
            }
        })

        // NOTE: For now, we are sending empty general info or current general info is needed?
        // The API might require event data. We send what defaults we can or the event ID.
        // Assuming createEvento updates partially or overwrites. We send event ID.
        // Similar to ActualizaEventoForm, we construct minimal event data to valid payload.

        const eventoData: EventoItem = {
            id_evento: String(evento.id_Evento),
            organizador: evento.Organizador || "",
            asociacion: evento.Asociacion || "",
            nombre: evento.Nombre || "",
            lugar: evento.Lugar || "",
            sede: evento.Sede || "",
            region: evento.Region || "",
            limite_participantes: evento.Limite_participantes ? String(evento.Limite_participantes) : "0",
            f_ini_evento: evento.F_ini_evento ? evento.F_ini_evento.split('T')[0] : "",
            f_fin_evento: evento.F_fin_evento ? evento.F_fin_evento.split('T')[0] : "",
            f_ini_incripciones: evento.F_ini_incripciones ? evento.F_ini_incripciones.split('T')[0] : "",
            f_fin_incripciones: evento.F_fin_incripciones ? evento.F_fin_incripciones.split('T')[0] : "",
            hora_limite_inscripciones: evento.Hora_limite_inscripciones || "",
        }

        const payload: SetEventoPayload = {
            evento: [eventoData],
            configuracion: configuracionData,
            niveles: nivelesData,
            adicionales: adicionalesData
        }

        try {
            await createEvento(payload)
            toast.success("Modalidades actualizadas exitosamente")
        } catch (error) {
            console.error(error)
            toast.error("Error al actualizar modalidades")
        }
    }

    return (
        <form id={id} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Label className="text-base font-semibold">Seleccione las modalidades</Label>
                <div className="rounded-md border p-4 bg-muted/10">
                    <p className="text-sm text-muted-foreground mb-4">
                        Seleccione las modalidades y configure los costos para este evento.
                    </p>
                    <Accordion type="single" collapsible className="w-full space-y-2 pb-6">
                        <AccordionItem
                            value="new-mode"
                            className={cn(
                                "border rounded-lg px-4",
                                hasNewData && "bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800"
                            )}
                        >
                            <AccordionPrimitive.Header className="flex items-center py-3">
                                <div className="flex items-center mr-3">
                                    <Checkbox
                                        id={`${id}-create-custom-modality`}
                                        checked={isCustomModality}
                                        onCheckedChange={(checked) => setIsCustomModality(checked as boolean)}
                                    />
                                </div>
                                <AccordionPrimitive.Trigger
                                    className={cn(
                                        "flex flex-1 items-center justify-between py-0 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 cursor-pointer"
                                    )}
                                >
                                    <Label htmlFor={`${id}-create-custom-modality`} className="cursor-pointer pointer-events-none">
                                        Extras de la modalidad
                                    </Label>
                                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                </AccordionPrimitive.Trigger>
                            </AccordionPrimitive.Header>
                            <AccordionContent className="pt-2 pb-4 px-2">
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={`${id}-mod-descripcion`}>Descripción</Label>
                                        <Input
                                            id={`${id}-mod-descripcion`}
                                            placeholder="Descripción de la modalidad"
                                            value={newModality.descripcion}
                                            onChange={(e) => setNewModality(prev => ({ ...prev, descripcion: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`${id}-mod-costo`}>Costo</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input
                                                id={`${id}-mod-costo`}
                                                type="number"
                                                className="pl-7"
                                                placeholder="0.00"
                                                value={newModality.costo}
                                                onChange={(e) => setNewModality(prev => ({ ...prev, costo: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`${id}-mod-configuracion`}>Configuración</Label>
                                        <Input
                                            id={`${id}-mod-configuracion`}
                                            placeholder="Detalles de configuración"
                                            value={newModality.configuracion}
                                            onChange={(e) => setNewModality(prev => ({ ...prev, configuracion: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {modalidades.map((modalidad) => (
                            <AccordionItem value={`item-${modalidad.id}`} key={modalidad.id} className="border rounded-lg px-4 data-[state=open]:bg-muted/30">
                                <AccordionPrimitive.Header className="flex items-center py-3">
                                    <div className="flex items-center mr-3">
                                        <Checkbox
                                            id={`${id}-mod-${modalidad.id}`}
                                            name="modalidades"
                                            value={String(modalidad.id)}
                                            checked={selectedModalities[String(modalidad.id)] || false}
                                            onCheckedChange={() => toggleModality(String(modalidad.id))}
                                        />
                                    </div>
                                    <AccordionPrimitive.Trigger
                                        className={cn(
                                            "flex flex-1 items-center justify-between py-0 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 cursor-pointer"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Label
                                                htmlFor={`${id}-mod-${modalidad.id}`}
                                                className="cursor-pointer pointer-events-none"
                                            >
                                                {modalidad.Nombre}
                                            </Label>
                                            {modalidad.Alias && (
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                                                    {modalidad.Alias}
                                                </Badge>
                                            )}
                                        </div>
                                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                    </AccordionPrimitive.Trigger>
                                </AccordionPrimitive.Header>
                                <AccordionContent className="pt-2 pb-4 px-2">
                                    <div className="space-y-3">
                                        {modalidad.Descripcion && (
                                            <div className="px-1">
                                                <h4 className="text-sm font-medium text-muted-foreground">{modalidad.Descripcion}</h4>
                                            </div>
                                        )}
                                        <div className="border rounded-md overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/50 hover:bg-muted/60 transition-colors">
                                                        <TableHead className="w-[50px] text-center">
                                                            <Hash className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
                                                        </TableHead>
                                                        <TableHead>
                                                            <div className="flex items-center gap-2">
                                                                <Medal className="h-3.5 w-3.5 text-teal-600" />
                                                                <span>Nivel</span>
                                                            </div>
                                                        </TableHead>
                                                        <TableHead>
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-3.5 w-3.5 text-teal-600" />
                                                                <span>Título</span>
                                                            </div>
                                                        </TableHead>
                                                        <TableHead className="text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Users className="h-3.5 w-3.5 text-teal-600" />
                                                                <span>Rango de Edad</span>
                                                            </div>
                                                        </TableHead>
                                                        <TableHead className="w-[120px]">
                                                            <span>Costo</span>
                                                        </TableHead>
                                                        <TableHead className="w-[120px]">
                                                            <span>Total</span>
                                                        </TableHead>
                                                        <TableHead className="min-w-[150px]">
                                                            <span>Descripción</span>
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(groupedDetails[modalidad.id] || []).map((detalle, idx) => {
                                                        const detailKey = `det-${modalidad.id}-${idx}`;
                                                        const isSelected = selectedDetails[detailKey] || false;
                                                        const currentValues = detailValues[detailKey] || { costo: "", descripcion: "" };

                                                        return (
                                                            <DetailRow
                                                                key={detailKey}
                                                                detail={detalle}
                                                                detailKey={detailKey}
                                                                isSelected={isSelected}
                                                                values={currentValues}
                                                                grandTotal={grandTotal}
                                                                onToggle={toggleDetail}
                                                                onUpdate={updateDetailValue}
                                                            />
                                                        )
                                                    })}
                                                    {(!groupedDetails[modalidad.id] || groupedDetails[modalidad.id].length === 0) && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                                No hay detalles disponibles
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
            <div className="p-4 border-t bg-background mt-auto">
                <div className="flex justify-end gap-2">
                    {(!isValid && Object.keys(errors).length > 0) && (
                        <div className="flex-1 mr-4">
                            <Alert variant="destructive" className="py-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Información</AlertTitle>
                                <AlertDescription>
                                    Verifique los datos seleccionados.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                    <Button type="submit" className="w-[100px] bg-teal-600 hover:bg-teal-700 text-white">
                        <CircleFadingArrowUp className="mr-2 h-4 w-4" />
                        Actualizar
                    </Button>
                </div>
            </div>
        </form>
    )
}

function PlaceholderForm({ title, icon: Icon = Image }: { title: string, icon?: any }) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <Icon className="mr-2 h-5 w-5" />
                {title}
            </h3>
            <div className="flex flex-col items-center justify-center gap-6 p-10 border-2 border-dashed rounded-xl bg-muted/20">
                <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center shadow-inner">
                    <Icon className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                    <h4 className="text-lg font-semibold">{title} del Evento</h4>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Sección para administrar {title.toLowerCase()}.
                    </p>
                </div>
                <Button variant="outline" className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Subir {title}
                </Button>
            </div>
        </div>
    )
}

function ActualizaEventoForm({ id, evento }: { id: string, evento: Evento }) {
    const [errors, setErrors] = React.useState<Record<string, string[] | undefined>>({})
    const [isValid, setIsValid] = React.useState(false)

    // Helper to parse date string safely
    const parseDate = (dateStr: string | undefined): Date | undefined => {
        if (!dateStr) return undefined
        const date = new Date(dateStr)
        return isNaN(date.getTime()) ? undefined : date
    }

    // State for General Tab inputs
    const initialValues = React.useMemo(() => ({
        tipoEvento: "competencia",
        organizador: evento.Organizador || "",
        asociacion: evento.Asociacion || "",
        nombre: evento.Nombre || "",
        lugar: evento.Lugar || "",
        sede: evento.Sede || "",
        region: evento.Region || "",
        limiteParticipantes: evento.Limite_participantes ? String(evento.Limite_participantes) : "",
        horaLimiteInscripcion: evento.Hora_limite_inscripciones || "",
        fechaInicioEvento: parseDate(evento.F_ini_evento),
        fechaFinEvento: parseDate(evento.F_fin_evento),
        fechaInicioInscripcion: parseDate(evento.F_ini_incripciones),
        fechaFinInscripcion: parseDate(evento.F_fin_incripciones)
    }), [evento])

    const [generalData, setGeneralData] = React.useState(initialValues)

    const isDirty = React.useMemo(() => {
        return JSON.stringify(generalData) !== JSON.stringify(initialValues)
    }, [generalData, initialValues])

    const handleGeneralChange = (field: string, value: any) => {
        setGeneralData(prev => ({ ...prev, [field]: value }))
    }

    const getFormData = React.useCallback((): EditEventoFormValues => {
        return {
            tipoEvento: generalData.tipoEvento,
            organizador: generalData.organizador,
            asociacion: generalData.asociacion,
            nombre: generalData.nombre,
            lugar: generalData.lugar,
            sede: generalData.sede,
            region: generalData.region,
            limiteParticipantes: generalData.limiteParticipantes || "",
            horaLimiteInscripcion: generalData.horaLimiteInscripcion,
            fechaInicioEvento: generalData.fechaInicioEvento as Date,
            fechaFinEvento: generalData.fechaFinEvento as Date,
            fechaInicioInscripcion: generalData.fechaInicioInscripcion as Date,
            fechaFinInscripcion: generalData.fechaFinInscripcion as Date
        }
    }, [generalData])

    React.useEffect(() => {
        const formData = getFormData()
        const result = editEventoSchema.safeParse(formData)
        setIsValid(result.success)
        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors)
        } else {
            setErrors({})
        }
    }, [getFormData])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!isValid) {
            toast.error("Por favor complete todos los campos requeridos")
            return
        }

        const formatPayloadDate = (date?: Date) => date ? format(date, "yyyy-MM-dd") : ""

        const eventoData: EventoItem = {
            id_evento: String(evento.id_Evento), // Include ID for update
            organizador: generalData.organizador,
            asociacion: generalData.asociacion,
            nombre: generalData.nombre,
            lugar: generalData.lugar,
            sede: generalData.sede,
            region: generalData.region,
            limite_participantes: generalData.limiteParticipantes || "0",
            f_ini_evento: formatPayloadDate(generalData.fechaInicioEvento),
            f_fin_evento: formatPayloadDate(generalData.fechaFinEvento),
            f_ini_incripciones: formatPayloadDate(generalData.fechaInicioInscripcion),
            f_fin_incripciones: formatPayloadDate(generalData.fechaFinInscripcion),
            hora_limite_inscripciones: generalData.horaLimiteInscripcion,
        }

        const payload: SetEventoPayload = {
            evento: [eventoData],
            configuracion: [], // Empty for general update
            niveles: [],
            adicionales: []
        }

        try {
            await createEvento(payload)
            toast.success("Evento actualizado exitosamente")
        } catch (error) {
            console.error(error)
            toast.error("Error al actualizar el evento")
        }
    }

    return (
        <form id={id} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-tipo-evento`}>Tipo de evento</Label>
                        <Select name="tipoEvento" value={generalData.tipoEvento} onValueChange={(val) => handleGeneralChange("tipoEvento", val)}>
                            <SelectTrigger id={`${id}-tipo-evento`}>
                                <SelectValue placeholder="Seleccione tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="competencia">Competencia</SelectItem>
                                <SelectItem value="campamento">Campamento</SelectItem>
                                <SelectItem value="curso">Curso</SelectItem>
                                <SelectItem value="control">Control Técnico</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.tipoEvento && <p className="text-xs text-red-500">{errors.tipoEvento[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-organizador`}>Organizador</Label>
                        <Input id={`${id}-organizador`} name="organizador" placeholder="Ej. FMG" value={generalData.organizador} onChange={(e) => handleGeneralChange("organizador", e.target.value)} />
                        {errors.organizador && <p className="text-xs text-red-500">{errors.organizador[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-asociacion`}>Asociación</Label>
                        <Input id={`${id}-asociacion`} name="asociacion" placeholder="Ej. Asociación de Jalisco" value={generalData.asociacion} onChange={(e) => handleGeneralChange("asociacion", e.target.value)} />
                        {errors.asociacion && <p className="text-xs text-red-500">{errors.asociacion[0]}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-nombre`}>Nombre</Label>
                        <Input id={`${id}-nombre`} name="nombre" placeholder="Nombre del evento" value={generalData.nombre} onChange={(e) => handleGeneralChange("nombre", e.target.value)} />
                        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-lugar`}>Lugar del evento</Label>
                        <Input id={`${id}-lugar`} name="lugar" placeholder="Ciudad, Estado" value={generalData.lugar} onChange={(e) => handleGeneralChange("lugar", e.target.value)} />
                        {errors.lugar && <p className="text-xs text-red-500">{errors.lugar[0]}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-sede`}>Sede</Label>
                        <Input id={`${id}-sede`} name="sede" placeholder="Instalaciones" value={generalData.sede} onChange={(e) => handleGeneralChange("sede", e.target.value)} />
                        {errors.sede && <p className="text-xs text-red-500">{errors.sede[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-region`}>Región</Label>
                        <Input id={`${id}-region`} name="region" placeholder="Ej. 1" value={generalData.region} onChange={(e) => handleGeneralChange("region", e.target.value)} />
                        {errors.region && <p className="text-xs text-red-500">{errors.region[0]}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-limite-participantes`}>Límite de participantes</Label>
                        <Input id={`${id}-limite-participantes`} name="limiteParticipantes" type="number" placeholder="0 = Ilimitado" value={generalData.limiteParticipantes} onChange={(e) => handleGeneralChange("limiteParticipantes", e.target.value)} />
                        {errors.limiteParticipantes && <p className="text-xs text-red-500">{errors.limiteParticipantes[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-hora-limite`}>Hora límite de inscripciones</Label>
                        <Input id={`${id}-hora-limite`} name="horaLimiteInscripcion" type="time" value={generalData.horaLimiteInscripcion} onChange={(e) => handleGeneralChange("horaLimiteInscripcion", e.target.value)} />
                        {errors.horaLimiteInscripcion && <p className="text-xs text-red-500">{errors.horaLimiteInscripcion[0]}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3 bg-muted/30 p-3 rounded-md border border-dashed">
                        <Label className="font-semibold flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-teal-600" />
                            Fechas de Inscripción
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Fecha Inicio</Label>
                                <DatePicker name="fechaInicioInscripcion" date={generalData.fechaInicioInscripcion} onSelect={(d) => handleGeneralChange("fechaInicioInscripcion", d)} />
                                {errors.fechaInicioInscripcion && <p className="text-xs text-red-500">{errors.fechaInicioInscripcion[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Fecha Fin</Label>
                                <DatePicker name="fechaFinInscripcion" date={generalData.fechaFinInscripcion} onSelect={(d) => handleGeneralChange("fechaFinInscripcion", d)} />
                                {errors.fechaFinInscripcion && <p className="text-xs text-red-500">{errors.fechaFinInscripcion[0]}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3 bg-muted/30 p-3 rounded-md border border-dashed">
                        <Label className="font-semibold flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-teal-600" />
                            Fechas del Evento
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Fecha Inicio</Label>
                                <DatePicker name="fechaInicioEvento" date={generalData.fechaInicioEvento} onSelect={(d) => handleGeneralChange("fechaInicioEvento", d)} />
                                {errors.fechaInicioEvento && <p className="text-xs text-red-500">{errors.fechaInicioEvento[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Fecha Fin</Label>
                                <DatePicker name="fechaFinEvento" date={generalData.fechaFinEvento} onSelect={(d) => handleGeneralChange("fechaFinEvento", d)} />
                                {errors.fechaFinEvento && <p className="text-xs text-red-500">{errors.fechaFinEvento[0]}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div className="p-4 border-t mt-auto flex justify-end gap-2 bg-background/50">
                <Button type="submit" disabled={!isValid || !isDirty} className="w-[150px] bg-teal-600 hover:bg-teal-700 text-white">
                    <CircleFadingArrowUp className="mr-2 h-4 w-4" />
                    Actualizar
                </Button>
            </div>
        </form >
    )
}

const DetailRow = React.memo(({
    detail,
    detailKey,
    isSelected,
    values,
    grandTotal,
    onToggle,
    onUpdate
}: {
    detail: ModalidadDetalleItem
    detailKey: string
    isSelected: boolean
    values: { costo: string; descripcion: string }
    grandTotal: number
    onToggle: (key: string) => void
    onUpdate: (key: string, field: 'costo' | 'descripcion', value: string) => void
}) => {
    return (
        <TableRow className="hover:bg-muted/30 transition-colors">
            <TableCell className="text-center">
                <Checkbox
                    id={detailKey}
                    checked={isSelected}
                    onCheckedChange={() => onToggle(detailKey)}
                />
            </TableCell>
            <TableCell className="font-medium">
                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900 dark:text-teal-200 dark:border-teal-800 font-normal">
                    {detail.Nivel}
                </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">{detail.titulo}</TableCell>
            <TableCell className="text-center text-muted-foreground text-sm">
                {detail.edad_ini === detail.edad_fin
                    ? `${detail.edad_ini} años`
                    : `${detail.edad_ini} - ${detail.edad_fin} años`
                }
            </TableCell>
            <TableCell>
                <div className="relative">
                    <span className={cn(
                        "absolute left-2 top-2 text-xs",
                        !isSelected ? "text-muted-foreground/50" : "text-muted-foreground"
                    )}>$</span>
                    <Input
                        className="h-8 pl-5 w-full"
                        placeholder="0.00"
                        type="number"
                        disabled={!isSelected}
                        value={values.costo}
                        onChange={(e) => onUpdate(detailKey, 'costo', e.target.value)}
                    />
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center h-8 px-2 text-sm font-medium text-muted-foreground bg-muted/20 rounded-md border border-transparent">
                    ${isSelected ? (parseFloat(values.costo) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                </div>
            </TableCell>
            <TableCell>
                <Input
                    className="h-8 w-full"
                    placeholder="Descripción"
                    disabled={!isSelected}
                    value={values.descripcion}
                    onChange={(e) => onUpdate(detailKey, 'descripcion', e.target.value)}
                />
            </TableCell>
        </TableRow>
    )
})
DetailRow.displayName = "DetailRow"

function DatePicker({ name, date, onSelect }: { name?: string, date?: Date, onSelect?: (date: Date | undefined) => void }) {
    return (
        <>
            <input type="hidden" name={name} value={date ? date.toISOString() : ""} />
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : <span>Seleccione fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={onSelect}
                        initialFocus
                        locale={es}
                    />
                </PopoverContent>
            </Popover>
        </>
    )
}
