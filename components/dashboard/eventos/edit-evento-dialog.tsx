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
import { EventoResponseItem as Evento } from "@/lib/evento-service"

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
            <DialogContent className="sm:max-w-[1000px] h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Editar Evento: {evento.Nombre}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <EditEventoTabs id="edit-evento-form-desktop" evento={evento} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

function EditEventoTabs({ className, id, evento }: { className?: string, id: string, evento: Evento }) {
    return (
        <Tabs defaultValue="general" className="h-full flex flex-col">
            <div className="px-6 pt-1">
                <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/80">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="general" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Información general</span>
                                    </div>
                                    <span className="sr-only">Información General</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Información General</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="modalidades" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <Database className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Modalidades</span>
                                    </div>
                                    <span className="sr-only">Modalidades</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Modalidades</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="imagen" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <Image className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Imagen</span>
                                    </div>
                                    <span className="sr-only">Imagen</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Imagen del Evento</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="memorias" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <BookOpen className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Memorias</span>
                                    </div>
                                    <span className="sr-only">Memorias</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Memorias del Evento</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="facturas" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <Receipt className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Facturas</span>
                                    </div>
                                    <span className="sr-only">Facturas</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Facturas</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <TabsContent value="general" className="m-0 space-y-4">
                            <GeneralInfoForm id={`${id}-general`} evento={evento} />
                        </TabsContent>
                        <TabsContent value="modalidades" className="m-0">
                            <ModalidadesForm id={`${id}-modalidades`} evento={evento} />
                        </TabsContent>
                        <TabsContent value="imagen" className="m-0">
                            <PlaceholderForm title="Imagen" />
                        </TabsContent>
                        <TabsContent value="memorias" className="m-0">
                            <PlaceholderForm title="Memorias" icon={BookOpen} />
                        </TabsContent>
                        <TabsContent value="facturas" className="m-0">
                            <PlaceholderForm title="Facturas" icon={Receipt} />
                        </TabsContent>
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
    const modalidades = [
        "Gimnasia de trampolín",
        "Gimnasia artística varonil",
        "Gimnasia artística femenil",
        "Gimnasia rítmica",
        "Congreso FMG",
        "Parkour",
        "Gimnasia aeróbica deportiva",
        "Gimnasia para todos",
        "Gimnasia acrobática"
    ]

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <Database className="mr-2 h-5 w-5" />
                Modalidades del Evento
            </h3>
            <div className="p-4">
                <Accordion type="single" collapsible className="w-full space-y-2">
                    {modalidades.map((modalidad, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="border rounded-lg px-4 data-[state=open]:bg-muted/30">
                            <AccordionPrimitive.Header className="flex items-center py-3">
                                <div className="flex items-center mr-3">
                                    <Checkbox id={`modalidad-evt-${index}`} name="modalidades[]" value={modalidad} />
                                </div>
                                <AccordionPrimitive.Trigger
                                    className={cn(
                                        "flex flex-1 items-center justify-between py-0 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 cursor-pointer"
                                    )}
                                >
                                    <Label
                                        htmlFor={`modalidad-evt-${index}`}
                                        className="cursor-pointer"
                                    >
                                        {modalidad}
                                    </Label>
                                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                </AccordionPrimitive.Trigger>
                            </AccordionPrimitive.Header>
                            <AccordionContent className="pt-2 pb-4 px-2">
                                <div className="p-4 bg-muted/40 rounded-md border border-dashed text-sm text-muted-foreground text-center">
                                    Configuración específica para {modalidad}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <div className="p-4 border-t bg-background mt-auto">
                <div className="flex justify-end">
                    <Button type="submit" className="w-[100px] bg-teal-600 hover:bg-teal-700 text-white">
                        <CircleFadingArrowUp className="mr-2 h-4 w-4" />
                        Guardar
                    </Button>
                </div>
            </div>
        </div>
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
