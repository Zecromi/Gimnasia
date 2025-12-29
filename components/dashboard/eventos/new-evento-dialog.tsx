"use client"

import * as React from "react"
import { CalendarPlus, Save, Calendar as CalendarIcon, FileText, Database, ChevronDown, Medal, Users, Hash } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerDescription,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { Badge } from "@/components/ui/badge"
import { getGlobalInfo, ModalidadItem, ModalidadDetalleItem } from "@/lib/club-service"
import { createEvento, SetEventoPayload, ConfiguracionItem, NivelItem, AdicionalItem, EventoItem } from "@/lib/evento-service"
import { eventoSchema, EventoFormValues } from "@/lib/schemas/evento/evento-schema"
import { toast } from "sonner"

export function NewEventoDialog() {
    const [open, setOpen] = React.useState(false)
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen} dismissible={false}>
                <DrawerTrigger asChild>
                    <Button size="icon" className="h-10 w-10 text-white bg-teal-600 hover:bg-teal-700 rounded-full shadow-lg">
                        <CalendarPlus className="h-6 w-6" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[95vh]">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Nuevo Evento</DrawerTitle>
                        <DrawerDescription className="sr-only">Complete el formulario para crear un nuevo evento</DrawerDescription>
                    </DrawerHeader>
                    <div className="flex-1 px-4 overflow-hidden">
                        <NewEventoTabs id="new-evento-form-mobile" onClose={() => setOpen(false)} />
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button size="icon" className="h-10 w-10 text-white bg-teal-600 hover:bg-teal-700 rounded-full shadow-lg">
                                <CalendarPlus className="h-6 w-6" />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Nuevo Evento</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent
                className="sm:max-w-[1300px] h-[96vh] flex flex-col p-0"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Nuevo Evento</DialogTitle>
                    <DialogDescription className="sr-only">Complete el formulario para crear un nuevo evento</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <NewEventoTabs id="new-evento-form-desktop" onClose={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

function NewEventoTabs({ className, id, onClose }: { className?: string, id: string, onClose: () => void }) {
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

    // State for General Tab inputs to persist across tab switches
    const [generalData, setGeneralData] = React.useState({
        tipoEvento: "",
        organizador: "",
        asociacion: "",
        nombre: "",
        lugar: "",
        sede: "",
        region: "",
        limiteParticipantes: "",
        horaLimiteInscripcion: "",
        fechaInicioEvento: undefined as Date | undefined,
        fechaFinEvento: undefined as Date | undefined,
        fechaInicioInscripcion: undefined as Date | undefined,
        fechaFinInscripcion: undefined as Date | undefined
    })

    const handleGeneralChange = (field: string, value: any) => {
        setGeneralData(prev => ({ ...prev, [field]: value }))
    }

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

    const getFormData = React.useCallback((): EventoFormValues => {
        const detalles: { idModalidad: string | number; idNivel: string | number; costo: string; descripcion: string }[] = []

        // Custom modality
        /* 
           Note: The schema expects an idModalidad and idNivel. 
           For custom modalities, we might need a strategy since they don't have IDs yet.
           However, the schema allows string | number. We can use a placeholder or handle it.
           If the user requirement "Select at least one modality and one level" refers to the PREDEFINED ones,
           then we strictly check existing ones. 
           If "Extras" counts, we add it. 
           Assuming strictly strict selection from the table based on "Select at least one modality and one level".
        */

        Object.keys(selectedDetails).forEach(key => {
            if (selectedDetails[key]) {
                const parts = key.split('-')
                if (parts.length === 3) {
                    const modId = parts[1]
                    const idx = parseInt(parts[2])
                    const detail = groupedDetails[parseInt(modId)]?.[idx]
                    const values = detailValues[key] || { costo: "", descripcion: "" }

                    if (detail) {
                        detalles.push({
                            idModalidad: modId,
                            idNivel: String(detail.id_nivel),
                            costo: values.costo,
                            descripcion: values.descripcion
                        })
                    }
                }
            }
        })

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
            fechaFinInscripcion: generalData.fechaFinInscripcion as Date,
            detalles: detalles
        }
    }, [generalData, selectedDetails, detailValues, groupedDetails])

    React.useEffect(() => {
        const formData = getFormData()
        const result = eventoSchema.safeParse(formData)
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
            id_evento: "0",
            organizador: generalData.organizador,
            asociacion: generalData.asociacion,
            nombre: generalData.nombre,
            lugar: generalData.lugar,
            sede: generalData.sede,
            region: generalData.region,
            limite_participantes: generalData.limiteParticipantes,
            f_ini_evento: formatPayloadDate(generalData.fechaInicioEvento),
            f_fin_evento: formatPayloadDate(generalData.fechaFinEvento),
            f_ini_incripciones: formatPayloadDate(generalData.fechaInicioInscripcion),
            f_fin_incripciones: formatPayloadDate(generalData.fechaFinInscripcion),
            hora_limite_inscripciones: generalData.horaLimiteInscripcion,
        }

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

        const payload: SetEventoPayload = {
            evento: [eventoData],
            configuracion: configuracionData,
            niveles: nivelesData,
            adicionales: adicionalesData
        }

        try {
            await createEvento(payload)

            toast.success("Evento creado exitosamente")
            onClose()
        } catch (error) {
            console.error(error)
            toast.error("Error al crear el evento")
        }
    }



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

    return (
        <Tabs defaultValue="general" className="h-full flex flex-col">
            <div className="px-6 pt-1">
                <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/80">
                    <TabsTrigger value="general" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Información general</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="modalidades" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            <span>Modalidades</span>
                        </div>
                    </TabsTrigger>
                </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <form id={id} onSubmit={handleSubmit} className="p-6 space-y-6">
                        <TabsContent value="general" className="m-0 space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tipo-evento">Tipo de evento</Label>
                                        <Select name="tipoEvento" value={generalData.tipoEvento} onValueChange={(val) => handleGeneralChange("tipoEvento", val)}>
                                            <SelectTrigger>
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
                                        <Label htmlFor="organizador">Organizador</Label>
                                        <Input id="organizador" name="organizador" placeholder="Ej. FMG" value={generalData.organizador} onChange={(e) => handleGeneralChange("organizador", e.target.value)} />
                                        {errors.organizador && <p className="text-xs text-red-500">{errors.organizador[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="asociacion">Asociación</Label>
                                        <Input id="asociacion" name="asociacion" placeholder="Ej. Asociación de Jalisco" value={generalData.asociacion} onChange={(e) => handleGeneralChange("asociacion", e.target.value)} />
                                        {errors.asociacion && <p className="text-xs text-red-500">{errors.asociacion[0]}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre">Nombre</Label>
                                        <Input id="nombre" name="nombre" placeholder="Nombre del evento" value={generalData.nombre} onChange={(e) => handleGeneralChange("nombre", e.target.value)} />
                                        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lugar">Lugar del evento</Label>
                                        <Input id="lugar" name="lugar" placeholder="Ciudad, Estado" value={generalData.lugar} onChange={(e) => handleGeneralChange("lugar", e.target.value)} />
                                        {errors.lugar && <p className="text-xs text-red-500">{errors.lugar[0]}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div className="space-y-2">
                                        <Label htmlFor="sede">Sede</Label>
                                        <Input id="sede" name="sede" placeholder="Instalaciones" value={generalData.sede} onChange={(e) => handleGeneralChange("sede", e.target.value)} />
                                        {errors.sede && <p className="text-xs text-red-500">{errors.sede[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="region">Región</Label>
                                        <Input id="region" name="region" placeholder="Ej. 1" value={generalData.region} onChange={(e) => handleGeneralChange("region", e.target.value)} />
                                        {errors.region && <p className="text-xs text-red-500">{errors.region[0]}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="limite-participantes">Límite de participantes</Label>
                                        <Input id="limite-participantes" name="limiteParticipantes" type="number" placeholder="0 = Ilimitado" value={generalData.limiteParticipantes} onChange={(e) => handleGeneralChange("limiteParticipantes", e.target.value)} />
                                        {errors.limiteParticipantes && <p className="text-xs text-red-500">{errors.limiteParticipantes[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hora-limite">Hora límite de inscripciones</Label>
                                        <Input id="hora-limite" name="horaLimiteInscripcion" type="time" value={generalData.horaLimiteInscripcion} onChange={(e) => handleGeneralChange("horaLimiteInscripcion", e.target.value)} />
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
                        </TabsContent>
                        <TabsContent value="modalidades" className="m-0 space-y-4">
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Seleccione las modalidades</Label>
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
                                                    id="create-custom-modality"
                                                    checked={isCustomModality}
                                                    onCheckedChange={(checked) => setIsCustomModality(checked as boolean)}
                                                />
                                            </div>
                                            <AccordionPrimitive.Trigger
                                                className={cn(
                                                    "flex flex-1 items-center justify-between py-0 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 cursor-pointer"
                                                )}
                                            >
                                                <Label htmlFor="create-custom-modality" className="cursor-pointer pointer-events-none">
                                                    Extras de la modalidad
                                                </Label>
                                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                            </AccordionPrimitive.Trigger>
                                        </AccordionPrimitive.Header>
                                        <AccordionContent className="pt-2 pb-4 px-2">
                                            <div className="space-y-4 pt-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="mod-descripcion">Descripción</Label>
                                                    <Input
                                                        id="mod-descripcion"
                                                        placeholder="Descripción de la modalidad"
                                                        value={newModality.descripcion}
                                                        onChange={(e) => setNewModality(prev => ({ ...prev, descripcion: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="mod-costo">Costo</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                        <Input
                                                            id="mod-costo"
                                                            type="number"
                                                            className="pl-7"
                                                            placeholder="0.00"
                                                            value={newModality.costo}
                                                            onChange={(e) => setNewModality(prev => ({ ...prev, costo: e.target.value }))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="mod-configuracion">Configuración</Label>
                                                    <Input
                                                        id="mod-configuracion"
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
                                                        id={`mod-${modalidad.id}`}
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
                                                            htmlFor={`mod-${modalidad.id}`}
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
                        </TabsContent>


                    </form>
                </ScrollArea>
            </div>

            <div className="p-4 border-t mt-auto flex justify-between gap-2 bg-background">
                <div className="text-xs text-red-500 flex flex-col justify-center">
                    {!isValid && Object.keys(errors).length > 0 && <span>Complete los campos requeridos para guardar.</span>}
                    {errors.detalles && <span>{errors.detalles[0]}</span>}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" form={id} disabled={!isValid} className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Evento
                    </Button>
                </div>
            </div>
        </Tabs>
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
                    ${isSelected ? grandTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
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
                    />
                </PopoverContent>
            </Popover>
        </>
    )
}
