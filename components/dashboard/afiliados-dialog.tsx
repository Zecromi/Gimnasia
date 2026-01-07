"use client"

import * as React from "react"
import { Plus, Save } from "lucide-react"
import { toast } from "sonner"
import { AfiliadosCatalogsResponse, getAfiliadosCatalogs, createAfiliado, CreateAfiliadoPayload } from "@/lib/afiliados-service"
import { useCatalogStore } from "@/lib/store/catalog-store"
import { CatalogoItem, Estado, getClubs, ViewClubGral } from "@/lib/club-service"
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
    const [catalogs, setCatalogs] = React.useState<AfiliadosCatalogsResponse | null>(null)
    const [clubs, setClubs] = React.useState<ViewClubGral[]>([])
    const { Modalidades, fetchCatalogs } = useCatalogStore()

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [catalogsData, clubsData] = await Promise.all([
                    getAfiliadosCatalogs(),
                    getClubs()
                ])
                setCatalogs(catalogsData)
                setClubs(clubsData.View_Club_gral)
                await fetchCatalogs()
            } catch (error) {
                console.error("Error fetching data:", error)
                toast.error("Error al cargar la información")
            }
        }
        fetchData()
    }, [fetchCatalogs])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries()) as Record<string, string>

        console.log("Form data raw:", data)

        const payload: CreateAfiliadoPayload = {
            nombre: data.nombre,
            paterno: data.apellidoPaterno,
            materno: data.apellidoMaterno,
            id_Club: data.club, // select returns value
            fecha_nacimiento: data.fechaNacimiento,
            curp: data.curp,
            genero: data.genero,
            escolaridad: data.escolaridad,
            calle: data.calle,
            exterior: data.numExt,
            interior: data.numInt,
            colonia: data.colonia,
            cp: data.cp,
            ciudad: data.municipio,
            estado: data.estado,
            telefono_c: data.telParticular,
            telefono_cel: data.telCelular,
            afiliacion_p: data.tipoAfiliadoPrincipal,
            afiliacion_s: data.tipoAfiliadoSecundario,
            id_nivel_tec: data.nivelTecnico,
            modalidad: data.modalidad
        }

        try {
            console.log("Sending payload:", payload)
            await createAfiliado(payload)
            toast.success("Afiliado creado exitosamente")
            // Optionally close dialog or reset form
        } catch (error) {
            console.error("Error creating afiliado:", error)
            toast.error("Error al crear el afiliado")
        }
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
                                        {Array.from(new Map(clubs.map(club => [club.id, club])).values()).map((club) => (
                                            <SelectItem key={club.id} value={club.id.toString()}>
                                                {club.Club}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                            <InputGroup label="Tipo de Afiliado Principal : *" className="col-span-12 md:col-span-4">
                                <Select name="tipoAfiliadoPrincipal">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {catalogs?.Catalogo_afiliaciones.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.Nombre}
                                            </SelectItem>
                                        ))}
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
                                        {catalogs?.Catalogo_afiliaciones.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.Nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                            <InputGroup label="Nivel Tecnico : *" className="col-span-12 md:col-span-4">
                                <Select name="nivelTecnico">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {catalogs?.Niveles_tecnicos.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.Descripcion}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                            <InputGroup label="Escolaridad : *" className="col-span-12 md:col-span-4">
                                <Select name="escolaridad">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {catalogs?.Escolaridad.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.Nombre}
                                            </SelectItem>
                                        ))}
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
                            <InputGroup label="Modalidad : *" className="col-span-12 md:col-span-4">
                                <Select name="modalidad" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from(new Map(Modalidades.map(item => [item.id, item])).values()).map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.Nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </InputGroup>
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
                                        {catalogs?.Estados.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.Nombre}
                                            </SelectItem>
                                        ))}
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
