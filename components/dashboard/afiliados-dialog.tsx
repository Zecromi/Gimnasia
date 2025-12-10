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
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AfiliadosDialog() {
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
                        <DrawerTitle>Nuevo Afiliado</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-1 px-4">
                        <AfiliadosForm id="afiliados-form-mobile" />
                    </div>
                    <DrawerFooter className="pt-2 border-t">
                        <Button form="afiliados-form-mobile" type="submit">
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
                        <p>Nuevo Afiliado</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:max-w-[auto] max-h-[auto] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Nuevo Afiliado</DialogTitle>
                </DialogHeader>
                <div className="flex-1">
                    <div className="px-6 py-6">
                        <AfiliadosForm id="afiliados-form-desktop" />
                    </div>
                </div>
                <DialogFooter className="p-4 border-t">
                    <Button form="afiliados-form-desktop" type="submit" className="w-[100px]">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function AfiliadosForm({ className, id }: React.ComponentProps<"form">) {
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
                            <InputGroup label="Nombre : *" htmlFor="nombre" className="col-span-12 md:col-span-4">
                                <Input id="nombre" name="nombre" />
                            </InputGroup>
                            <InputGroup label="Apellido Paterno : *" htmlFor="apellidoPaterno" className="col-span-12 md:col-span-4">
                                <Input id="apellidoPaterno" name="apellidoPaterno" />
                            </InputGroup>
                            <InputGroup label="Apellido Materno :" htmlFor="apellidoMaterno" className="col-span-12 md:col-span-4">
                                <Input id="apellidoMaterno" name="apellidoMaterno" />
                            </InputGroup>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Asociación : *" className="col-span-12 md:col-span-4">
                                <Input value="ESTADO DE MÉXICO" disabled className="bg-muted/50" name="asociacion" />
                            </InputGroup>
                            <InputGroup label="Club : *" className="col-span-12 md:col-span-4">
                                <Select name="club">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="club1">Club 1</SelectItem>
                                        <SelectItem value="club2">Club 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                            <InputGroup label="Tipo de Afiliado Principal : *" className="col-span-12 md:col-span-4">
                                <Select name="tipoAfiliadoPrincipal">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tipo1">Tipo 1</SelectItem>
                                        <SelectItem value="tipo2">Tipo 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Tipo de Afiliado Secundario :" className="col-span-12 md:col-span-4">
                                <Select name="tipoAfiliadoSecundario">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sec1">Secundario 1</SelectItem>
                                        <SelectItem value="sec2">Secundario 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                            <InputGroup label="Nivel Tecnico : *" className="col-span-12 md:col-span-4">
                                <Select name="nivelTecnico">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nivel1">Nivel 1</SelectItem>
                                        <SelectItem value="nivel2">Nivel 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                            <InputGroup label="Escolaridad : *" className="col-span-12 md:col-span-4">
                                <Select name="escolaridad">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="primaria">Primaria</SelectItem>
                                        <SelectItem value="secundaria">Secundaria</SelectItem>
                                        <SelectItem value="preparatoria">Preparatoria</SelectItem>
                                        <SelectItem value="universidad">Universidad</SelectItem>
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Fecha de Nacimiento : *" htmlFor="fechaNacimiento" className="col-span-12 md:col-span-4">
                                <Input id="fechaNacimiento" name="fechaNacimiento" type="date" />
                            </InputGroup>
                            <InputGroup label="CURP : *" htmlFor="curp" className="col-span-12 md:col-span-4">
                                <Input id="curp" name="curp" />
                            </InputGroup>
                            <div className="col-span-12 md:col-span-4 space-y-3">
                                <Label>Género : *</Label>
                                <RadioGroup defaultValue="femenino" className="flex gap-4" name="genero">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="femenino" id="femenino" />
                                        <Label htmlFor="femenino">Femenino</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="masculino" id="masculino" />
                                        <Label htmlFor="masculino">Masculino</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Contacto :</h3>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Calle : *" htmlFor="calle" className="col-span-12 md:col-span-6">
                                <Input id="calle" name="calle" />
                            </InputGroup>
                            <InputGroup label="# Exterior : *" htmlFor="num-ext" className="col-span-6 md:col-span-3">
                                <Input id="num-ext" name="numExt" />
                            </InputGroup>
                            <InputGroup label="# Interior :" htmlFor="num-int" className="col-span-6 md:col-span-3">
                                <Input id="num-int" name="numInt" />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Colonia : *" htmlFor="colonia" className="col-span-12 md:col-span-4">
                                <Input id="colonia" name="colonia" />
                            </InputGroup>
                            <InputGroup label="Ciudad/Delegación/Municipio : *" htmlFor="municipio" className="col-span-12 md:col-span-4">
                                <Input id="municipio" name="municipio" />
                            </InputGroup>
                            <InputGroup label="Estado : *" className="col-span-12 md:col-span-2">
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
                            <InputGroup label="C.P. : *" htmlFor="cp" className="col-span-12 md:col-span-2">
                                <Input id="cp" name="cp" />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Email : *" htmlFor="email" className="col-span-12 md:col-span-4">
                                <Input id="email" type="email" name="email" />
                            </InputGroup>
                            <InputGroup label="Teléfono Particular : *" htmlFor="tel-particular" className="col-span-12 md:col-span-4">
                                <Input id="tel-particular" name="telParticular" />
                            </InputGroup>
                            <InputGroup label="Teléfono Celular :" htmlFor="tel-celular" className="col-span-12 md:col-span-4">
                                <Input id="tel-celular" name="telCelular" />
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </form>
    )
}
