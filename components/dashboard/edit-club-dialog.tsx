"use client"

import * as React from "react"
import { CircleFadingArrowUp, Upload, Key, Database, Building2, Lock, RefreshCw, FileText } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Club } from "./clubes-columns"

interface EditClubDialogProps {
    club: Club
    children: React.ReactNode
}

export function EditClubDialog({ club, children }: EditClubDialogProps) {
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
                        <DrawerTitle>Editar Club: {club.club}</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-1 px-4 overflow-hidden">
                        <EditClubTabs id="edit-club-form-mobile" club={club} />
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
                    <DialogTitle>Editar Club: {club.club}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <EditClubTabs id="edit-club-form-desktop" club={club} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

function EditClubTabs({ className, id, club }: { className?: string, id: string, club: Club }) {
    return (
        <Tabs defaultValue="general" className="h-full flex flex-col">
            <div className="px-6 pt-1">
                <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/80">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="general" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">General</span>
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
                                <TabsTrigger value="acceso" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <Key className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Acceso</span>
                                    </div>
                                    <span className="sr-only">Acceso</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Control de Acceso</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="logo" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <Building2 className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Logo</span>
                                    </div>
                                    <span className="sr-only">Logo</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Logo del Club</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <TabsContent value="general" className="m-0 space-y-4">
                            <GeneralInfoForm id={`${id}-general`} club={club} />
                        </TabsContent>
                        <TabsContent value="modalidades" className="m-0">
                            <ModalidadesForm id={`${id}-modalidades`} club={club} />
                        </TabsContent>
                        <TabsContent value="acceso" className="m-0">
                            <AccesoForm id={`${id}-acceso`} club={club} />
                        </TabsContent>
                        <TabsContent value="logo" className="m-0">
                            <LogoForm id={`${id}-logo`} club={club} />
                        </TabsContent>
                    </div>
                </ScrollArea>
            </div>

        </Tabs>
    )
}

function GeneralInfoForm({ id, club }: { id: string, club: Club }) {
    // This reuses the structure from ClubDialog
    return (
        <div className="space-y-6">
            {/* General Info */}
            <div className="grid gap-6">
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Nombre del club *" htmlFor="nombre" className="col-span-12 md:col-span-6">
                        <Input id="nombre" name="nombre" defaultValue={club.club} />
                    </InputGroup>
                    <InputGroup label="Asociación *" className="col-span-12 md:col-span-4">
                        <Input value={club.asociacion} disabled className="bg-muted/50" name="asociacion" />
                    </InputGroup>
                    <InputGroup label="Alias" htmlFor="alias" className="col-span-12 md:col-span-2">
                        <Input id="alias" name="alias" defaultValue="Alias" />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="E-mail *" htmlFor="email" className="col-span-12 md:col-span-4">
                        <Input id="email" type="email" name="email" defaultValue={`contacto@${club.club.toLowerCase().replace(/\s/g, '')}.com`} />
                    </InputGroup>
                    <InputGroup label="Pagina web" htmlFor="web" className="col-span-12 md:col-span-4">
                        <Input id="web" name="web" />
                    </InputGroup>
                    <InputGroup label="Fundación" htmlFor="fundacion" className="col-span-12 md:col-span-2">
                        <Input id="fundacion" name="fundacion" />
                    </InputGroup>
                    <div className="col-span-12 md:col-span-2 space-y-3">
                        <Label>Sector</Label>
                        <RadioGroup defaultValue="privado" className="flex gap-4" name="sector">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="privado" id="privado" />
                                <Label htmlFor="privado">Privado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="publico" id="publico" />
                                <Label htmlFor="publico">Publico</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Teléfono principal *" htmlFor="tel-principal" className="col-span-12 md:col-span-3">
                        <Input id="tel-principal" name="telPrincipal" />
                    </InputGroup>
                    <InputGroup label="Teléfono secundario" htmlFor="tel-secundario" className="col-span-12 md:col-span-3">
                        <Input id="tel-secundario" name="telSecundario" />
                    </InputGroup>
                    <InputGroup label="Teléfono móvil *" htmlFor="tel-movil" className="col-span-12 md:col-span-3">
                        <Input id="tel-movil" name="telMovil" />
                    </InputGroup>
                    <div className="col-span-12 md:col-span-3 space-y-3">
                        <Label>Tipo de instalaciones</Label>
                        <RadioGroup defaultValue="propias" className="flex gap-4" name="tipoInstalaciones">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="propias" id="propias" />
                                <Label htmlFor="propias">Propias</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="rentadas" id="rentadas" />
                                <Label htmlFor="rentadas">Rentadas</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="organismos" name="organismos" />
                    <Label htmlFor="organismos">Organismos afines: Si</Label>
                </div>
            </div>

            {/* Domicilio Social */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Domicilio Social :</h3>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Calle *" htmlFor="calle" className="col-span-12 md:col-span-6">
                        <Input id="calle" name="calle" />
                    </InputGroup>
                    <InputGroup label="# Exterior *" htmlFor="num-ext" className="col-span-6 md:col-span-2">
                        <Input id="num-ext" name="numExt" />
                    </InputGroup>
                    <InputGroup label="# Interior" htmlFor="num-int" className="col-span-6 md:col-span-2">
                        <Input id="num-int" name="numInt" />
                    </InputGroup>
                    <InputGroup label="Colonia *" htmlFor="colonia" className="col-span-12 md:col-span-2">
                        <Input id="colonia" name="colonia" />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="CD / Delegación / Municipio *" htmlFor="municipio" className="col-span-12 md:col-span-4">
                        <Input id="municipio" name="municipio" />
                    </InputGroup>
                    <InputGroup label="Estado *" className="col-span-12 md:col-span-4">
                        <Select name="estado">
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione una opción" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mexico">Estado de México</SelectItem>
                                <SelectItem value="cdmx">CDMX</SelectItem>
                            </SelectContent>
                        </Select>
                    </InputGroup>
                    <InputGroup label="C.P. *" htmlFor="cp" className="col-span-12 md:col-span-2">
                        <Input id="cp" name="cp" />
                    </InputGroup>
                </div>
            </div>

            {/* Domicilio Fiscal */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Domicilio Fiscal :</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox id="igual-domicilio" name="igualDomicilio" />
                    <Label htmlFor="igual-domicilio">Igual a domicilio social</Label>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Calle *" htmlFor="calle-fiscal" className="col-span-12 md:col-span-6">
                        <Input id="calle-fiscal" name="calleFiscal" />
                    </InputGroup>
                    <InputGroup label="# Exterior *" htmlFor="num-ext-fiscal" className="col-span-6 md:col-span-2">
                        <Input id="num-ext-fiscal" name="numExtFiscal" />
                    </InputGroup>
                    <InputGroup label="# Interior" htmlFor="num-int-fiscal" className="col-span-6 md:col-span-2">
                        <Input id="num-int-fiscal" name="numIntFiscal" />
                    </InputGroup>
                    <InputGroup label="Colonia *" htmlFor="colonia-fiscal" className="col-span-12 md:col-span-2">
                        <Input id="colonia-fiscal" name="coloniaFiscal" />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="CD / Delegación / Municipio *" htmlFor="municipio-fiscal" className="col-span-12 md:col-span-4">
                        <Input id="municipio-fiscal" name="municipioFiscal" />
                    </InputGroup>
                    <InputGroup label="Estado *" className="col-span-12 md:col-span-4">
                        <Select name="estadoFiscal">
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione una opción" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mexico">Estado de México</SelectItem>
                                <SelectItem value="cdmx">CDMX</SelectItem>
                            </SelectContent>
                        </Select>
                    </InputGroup>
                    <InputGroup label="C.P. *" htmlFor="cp-fiscal" className="col-span-6 md:col-span-2">
                        <Input id="cp-fiscal" name="cpFiscal" />
                    </InputGroup>
                    <InputGroup label="RFC *" htmlFor="rfc" className="col-span-6 md:col-span-2">
                        <Input id="rfc" name="rfc" defaultValue={club.curp} />
                    </InputGroup>
                </div>
            </div>

            {/* Aparatos */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Aparatos :</h3>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Nacionales:</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="nacionales" name="nacionales" />
                            <Label htmlFor="nacionales">Si</Label>
                        </div>
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Importados:</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="importados" name="importados" />
                            <Label htmlFor="importados">Si</Label>
                        </div>
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Homologados FIG:</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="homologados" name="homologados" />
                            <Label htmlFor="homologados">Si</Label>
                        </div>
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Aparatos otros:</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="otros" name="otros" />
                            <Label htmlFor="otros">Si</Label>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t bg-background mt-auto">
                    <div className="flex justify-end">
                        <Button type="submit" className="w-[100px]">
                            <CircleFadingArrowUp className="mr-2 h-4 w-4" />
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ModalidadesForm({ id, club }: { id: string, club: Club }) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <Database className="mr-2 h-5 w-5" />
                Modalidades del Club
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {[
                    "Gimnasia artística femenil",
                    "Gimnasia artística varonil",
                    "Gimnasia de trampolín",
                    "Gimnasia acrobática",
                    "Gimnasia para todos",
                    "Gimnasia rítmica",
                    "Gimnasia aeróbica deportiva",
                    "Parkour",
                    "Congreso FMG",
                    "Gimnasia de baile"
                ].map((modalidad, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox id={`modalidad-${index}`} name="modalidades[]" value={modalidad} />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor={`modalidad-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {modalidad}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Habilitar para este club
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t bg-background mt-auto">
                <div className="flex justify-end">
                    <Button type="submit" className="w-[100px]">
                        <CircleFadingArrowUp className="mr-2 h-4 w-4" />
                        Guardar
                    </Button>
                </div>
            </div>
        </div>
    )
}

function AccesoForm({ id, club }: { id: string, club: Club }) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <Key className="mr-2 h-5 w-5" />
                Control de Acceso
            </h3>
            <div className="grid gap-6 p-4 max-w-2xl">
                <div className="space-y-4">
                    <InputGroup label="Nombre de usuario" htmlFor="user-name">
                        <Input id="user-name" defaultValue={`admin.${club.club.toLowerCase().replace(/\s/g, '')}`} />
                    </InputGroup>

                </div>
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Acciones de cuenta</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="destructive" type="button" className="w-full sm:w-auto">
                                        <Lock className="mr-2 h-4 w-4" />
                                        Desactivar Acceso
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Bloquear el acceso al sistema para este club</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" type="button" className="w-full sm:w-auto">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Restablecer Contraseña
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Generar una nueva contraseña aleatoria</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LogoForm({ id, club }: { id: string, club: Club }) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <Building2 className="mr-2 h-5 w-5" />
                Identidad del Club
            </h3>
            <div className="flex flex-col items-center justify-center gap-6 p-10 border-2 border-dashed rounded-xl bg-muted/20">
                <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center shadow-inner">
                    <Building2 className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                    <h4 className="text-lg font-semibold">Logo del Club</h4>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Sube una imagen (PNG, JPG) para identificar al club en el sistema y reportes.
                    </p>
                </div>
                <Button variant="outline" className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Imagen
                </Button>
            </div>
        </div>
    )
}
