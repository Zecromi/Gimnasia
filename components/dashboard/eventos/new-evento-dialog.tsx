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

export function NewEventoDialog() {
    const [open, setOpen] = React.useState(false)
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button size="icon" className="h-10 w-10 text-white bg-teal-600 hover:bg-teal-700 rounded-full shadow-lg">
                        <CalendarPlus className="h-6 w-6" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[95vh]">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Nuevo Evento</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-1 px-4 overflow-hidden">
                        <NewEventoTabs id="new-evento-form-mobile" />
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
            <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Nuevo Evento</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <NewEventoTabs id="new-evento-form-desktop" />
                </div>
            </DialogContent>
        </Dialog>
    )
}

function NewEventoTabs({ className, id }: { className?: string, id: string }) {
    const [modalidades, setModalidades] = React.useState<ModalidadItem[]>([])
    const [modalidadesDetalle, setModalidadesDetalle] = React.useState<ModalidadDetalleItem[]>([])

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
                    <form id={id} className="p-6 space-y-6">
                        <TabsContent value="general" className="m-0 space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tipo-evento">Tipo de evento</Label>
                                        <Select name="tipoEvento">
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
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="organizador">Organizador</Label>
                                        <Input id="organizador" name="organizador" placeholder="Ej. FMG" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="asociacion">Asociación</Label>
                                        <Input id="asociacion" name="asociacion" placeholder="Ej. Asociación de Jalisco" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input id="nombre" name="nombre" placeholder="Nombre del evento" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lugar">Lugar del evento</Label>
                                        <Input id="lugar" name="lugar" placeholder="Ciudad, Estado" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sede">Sede</Label>
                                        <Input id="sede" name="sede" placeholder="Instalaciones" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="region">Región</Label>
                                        <Input id="region" name="region" placeholder="Ej. 1" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="limite-participantes">Límite de participantes</Label>
                                        <Input id="limite-participantes" name="limiteParticipantes" type="number" placeholder="0 = Ilimitado" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hora-limite">Hora límite de inscripciones</Label>
                                        <Input id="hora-limite" name="horaLimiteInscripcion" type="time" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-3 bg-muted/30 p-3 rounded-md border border-dashed">
                                        <Label className="font-semibold flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-teal-600" />
                                            Fechas del Evento
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Fecha Inicio</Label>
                                                <DatePicker name="fechaInicioEvento" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Fecha Fin</Label>
                                                <DatePicker name="fechaFinEvento" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-muted/30 p-3 rounded-md border border-dashed">
                                        <Label className="font-semibold flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-teal-600" />
                                            Fechas de Inscripción
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Fecha Inicio</Label>
                                                <DatePicker name="fechaInicioInscripcion" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Fecha Fin</Label>
                                                <DatePicker name="fechaFinInscripcion" />
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
                                    {modalidades.map((modalidad) => (
                                        <AccordionItem value={`item-${modalidad.id}`} key={modalidad.id} className="border rounded-lg px-4 data-[state=open]:bg-muted/30">
                                            <AccordionPrimitive.Header className="flex items-center py-3">
                                                <div className="flex items-center mr-3">
                                                    <Checkbox id={`mod-${modalidad.id}`} name="modalidades" value={String(modalidad.id)} />
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
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {modalidadesDetalle
                                                                    .filter((detalle) => detalle.id === modalidad.id)
                                                                    .map((detalle, idx) => (
                                                                        <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                                                                            <TableCell className="text-center">
                                                                                <Checkbox id={`det-${modalidad.id}-${idx}`} />
                                                                            </TableCell>
                                                                            <TableCell className="font-medium">
                                                                                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900 dark:text-teal-200 dark:border-teal-800 font-normal">
                                                                                    {detalle.Nivel}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell className="text-muted-foreground text-sm">{detalle.titulo}</TableCell>
                                                                            <TableCell className="text-center text-muted-foreground text-sm">
                                                                                {detalle.edad_ini === detalle.edad_fin
                                                                                    ? `${detalle.edad_ini} años`
                                                                                    : `${detalle.edad_ini} - ${detalle.edad_fin} años`
                                                                                }
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                {modalidadesDetalle.filter((d) => d.id === modalidad.id).length === 0 && (
                                                                    <TableRow>
                                                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
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

            <div className="p-4 border-t mt-auto flex justify-end gap-2 bg-background">
                <Button variant="outline" type="button" onClick={() => (document.querySelector('[data-state="open"]') as any)?.click()}>Cancelar</Button>
                <Button type="submit" form={id} className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Evento
                </Button>
            </div>
        </Tabs>
    )
}

function DatePicker({ name }: { name?: string }) {
    const [date, setDate] = React.useState<Date>()

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
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </>
    )
}
