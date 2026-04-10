"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, CircleFadingArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { putEventos, EventosConfiguradosItem as Evento } from "@/lib/evento-service"
import { getGlobalInfo } from "@/lib/club-service"
import { editEventoSchema, EditEventoFormValues } from "@/lib/schemas/evento/edit-evento-schema"

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

export function ActualizaEventoForm({ id, evento, onSuccess }: { id: string, evento: Evento, onSuccess?: () => void }) {
    const [errors, setErrors] = React.useState<Record<string, string[] | undefined>>({})
    const [isValid, setIsValid] = React.useState(false)
    const [Catalogo_eventos, setCatalogo_eventos] = React.useState<{ id_Evento: number; Nombre: string }[]>([])

    // Helper to parse date string safely
    const parseDate = (dateStr: string | undefined): Date | undefined => {
        if (!dateStr) return undefined
        const date = new Date(dateStr)
        return isNaN(date.getTime()) ? undefined : date
    }

    // State for General Tab inputs
    const initialValues = React.useMemo(() => ({
        tipoEvento: evento.id_Evento ? String(evento.id_Evento) : "0",
        organizador: evento.Organizador || "",
        asociacion: evento.Asociacion || "",
        nombre: evento.Nombre || "",
        lugar: evento.Lugar || "",
        sede: evento.Sede || "",
        region: evento.Region || "",
        limiteParticipantes: String(evento.Limite_participantes ?? "0"),
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
        const fetchData = async () => {
            try {
                const data = await getGlobalInfo();
                if (data.Catalogo_eventos) {
                    setCatalogo_eventos(data.Catalogo_eventos);
                }
            } catch (error) {
                console.error("Error fetching catalogs:", error);
            }
        };
        fetchData();
    }, []);

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

        const fieldMapping: Record<string, string> = {
            tipoEvento: "id_Evento",
            organizador: "organizador",
            asociacion: "asociacion",
            nombre: "nombre",
            lugar: "lugar",
            sede: "sede",
            region: "region",
            limiteParticipantes: "limite_participantes",
            horaLimiteInscripcion: "hora_limite_inscripciones",
            fechaInicioEvento: "f_ini_evento",
            fechaFinEvento: "f_fin_evento",
            fechaInicioInscripcion: "f_ini_incripciones",
            fechaFinInscripcion: "f_fin_incripciones"
        }

        const changes: { campo: string; valor: string }[] = []

        Object.keys(fieldMapping).forEach((key) => {
            const dataKey = key as keyof typeof generalData
            const backendField = fieldMapping[key]

            const originalVal = initialValues[dataKey]
            const currentVal = generalData[dataKey]

            let isDifferent = false
            let payloadValue = ""

            if (key.startsWith("fecha")) {
                const d1 = originalVal as Date | undefined
                const d2 = currentVal as Date | undefined
                if (d1?.getTime() !== d2?.getTime()) {
                    isDifferent = true
                    payloadValue = formatPayloadDate(d2)
                }
            } else {
                if (originalVal !== currentVal) {
                    isDifferent = true
                    payloadValue = String(currentVal)
                }
            }

            if (isDifferent) {
                changes.push({
                    campo: backendField,
                    valor: payloadValue
                })
            }
        })

        if (changes.length === 0) {
            toast.info("No hay cambios para actualizar")
            return
        }

        const payload = {
            uno: changes,
            dos: [],
            tres: []
        }

        try {
            await putEventos(String(evento.id), payload)
            toast.success("Evento actualizado exitosamente")
            if (onSuccess) onSuccess()
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
                                {Catalogo_eventos?.map((item) => (
                                    <SelectItem key={item.id_Evento} value={String(item.id_Evento)}>
                                        {item.Nombre}
                                    </SelectItem>
                                ))}
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
