"use client"

import * as React from "react"
import { Plus, Save } from "lucide-react"

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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ClubDialog() {
    const [open, setOpen] = React.useState(false)
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                        <Plus className="h-6 w-6" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[90vh]">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Nuevo Club</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-1 px-4">
                        <ClubForm id="club-form-mobile" />
                    </div>
                    <DrawerFooter className="pt-2 border-t">
                        <Button form="club-form-mobile" type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Guardar
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DrawerClose>
                    </DrawerFooter>
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
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                                <Plus className="h-6 w-6" />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Nuevo Club</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Nuevo Club</DialogTitle>
                </DialogHeader>
                <div className="flex-1">
                    <div className="px-6 py-6">
                        <ClubForm id="club-form-desktop" />
                    </div>
                </div>
                <DialogFooter className="p-4 border-t">
                    <Button form="club-form-desktop" type="submit" className="w-[100px]">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ClubForm({ className, id }: React.ComponentProps<"form">) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())
        console.log("Form data:", data)
    }

    return (
        <form id={id} className={cn("space-y-6", className)} onSubmit={handleSubmit}>
            <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6 p-1">
                    {/* General Info */}
                    <div className="grid gap-6">
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Nombre del club *" htmlFor="nombre" className="col-span-12 md:col-span-6">
                                <Input id="nombre" name="nombre" />
                            </InputGroup>
                            <InputGroup label="Asociación *" className="col-span-12 md:col-span-4">
                                <Input value="ESTADO DE MÉXICO" disabled className="bg-muted/50" name="asociacion" />
                            </InputGroup>
                            <InputGroup label="Alias" htmlFor="alias" className="col-span-12 md:col-span-2">
                                <Input id="alias" name="alias" />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="E-mail *" htmlFor="email" className="col-span-12 md:col-span-4">
                                <Input id="email" type="email" name="email" />
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
                                <Input id="rfc" name="rfc" />
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
                    </div>
                </div>
            </ScrollArea>        </form>
    )
}
