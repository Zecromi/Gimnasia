"use client"

import * as React from "react"
import { Plus, Save } from "lucide-react"
import { toast } from "sonner"
import { AfiliadosCatalogsResponse, getAfiliadosCatalogs, createAfiliado, updateAfiliado, CreateAfiliadoPayload } from "@/lib/afiliados-service"
import { useCatalogStore } from "@/lib/store/catalog-store"
import { useAuthStore } from "@/lib/store/auth-store"
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
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerDescription,
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

interface AfiliadosDialogProps {
    afiliado?: Afiliado
    trigger?: React.ReactNode
    onSuccess?: () => void
}

export function AfiliadosDialog({ afiliado, trigger, onSuccess }: AfiliadosDialogProps) {
    const [open, setOpen] = React.useState(false)
    const isMobile = useIsMobile()
    const title = afiliado ? "Editar Afiliado" : "Nuevo Afiliado"
    const description = afiliado
        ? "Modifique los datos del afiliado existente."
        : "Ingrese los datos para registrar un nuevo afiliado."

    const handleSuccess = () => {
        console.log("AfiliadosDialog: handleSuccess called")
        setOpen(false)
        onSuccess?.()
    }

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {trigger || (
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                            <Plus className="h-6 w-6" />
                        </Button>
                    )}
                </DrawerTrigger>
                <DrawerContent className="h-[90vh]">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>
                    <div className="flex-1 px-4">
                        <AfiliadosForm id="afiliados-form-mobile" afiliado={afiliado} onSuccess={handleSuccess} />
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
            {trigger ? (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                                <Plus className="h-6 w-6" />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{title}</p>
                    </TooltipContent>
                </Tooltip>
            )}
            <DialogContent className="sm:max-w-[auto] max-h-[auto] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex-1">
                    <div className="px-6 py-6">
                        <AfiliadosForm id="afiliados-form-desktop" afiliado={afiliado} onSuccess={handleSuccess} />
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

import { Afiliado } from "@/lib/afiliados-service"

interface AfiliadosFormProps extends React.ComponentProps<"form"> {
    afiliado?: Afiliado
    onSuccess?: () => void
}

function AfiliadosForm({ className, id, afiliado, onSuccess }: AfiliadosFormProps) {
    const [catalogs, setCatalogs] = React.useState<AfiliadosCatalogsResponse | null>(null)
    const [clubs, setClubs] = React.useState<ViewClubGral[]>([])
    const { Modalidades, fetchCatalogs } = useCatalogStore()
    const authData = useAuthStore((state) => state.authData)
    // Add controlled state for the club select
    const [selectedClubId, setSelectedClubId] = React.useState<string>(
        afiliado?.id_Club?.toString() || ""
    )


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("AfiliadosDialog: Fetching data...", { authData: authData })

                const [catalogsData, clubsData] = await Promise.all([
                    getAfiliadosCatalogs(),
                    getClubs()
                ])
                setCatalogs(catalogsData)

                let loadedClubs = clubsData.View_Club_gral
                console.log("AfiliadosDialog: Loaded clubs count:", loadedClubs.length)

                // Filter clubs if not admin
                // eslint-disable-next-line eqeqeq
                if (authData && authData.tipo_registro != 1) {
                    console.log("AfiliadosDialog: Filtering for user ID:", authData.id)
                    // Robust comparison string vs string
                    loadedClubs = loadedClubs.filter(c => c.id.toString() === authData.id.toString())

                    console.log("AfiliadosDialog: Filtered clubs count:", loadedClubs.length)

                    // Auto-select if we have a single club and we are not editing (or we are but want to ensure it matches)
                    // Or if we are creating only? Let's just default to the single club if found.
                    if (loadedClubs.length === 1 && !afiliado) {
                        const autoId = loadedClubs[0].id.toString()
                        console.log("AfiliadosDialog: Auto-selecting club ID:", autoId)
                        setSelectedClubId(autoId)
                    } else {
                        console.log("AfiliadosDialog: Auto-select skipped. Count != 1 or editing.")
                    }
                }

                setClubs(loadedClubs)
                await fetchCatalogs()
            } catch (error) {
                console.error("Error fetching data:", error)
                toast.error("Error al cargar la información")
            }
        }
        fetchData()
    }, [fetchCatalogs, authData, afiliado])
    // END REPLACEMENT

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries()) as Record<string, string>

        console.log("Form data raw:", data)

        // Validate unique affiliation types
        const affiliations = [
            data.tipoAfiliadoPrincipal,
            data.tipoAfiliadoSecundario,
            data.tipoAfiliadoTercero,
            data.tipoAfiliadoCuarto
        ].filter(val => val && val.trim() !== "") // Filter out empty selections

        const uniqueAffiliations = new Set(affiliations)
        if (uniqueAffiliations.size !== affiliations.length) {
            toast.error("No se pueden repetir los tipos de afiliación")
            return
        }

        console.log("handleSubmit processing data:", data);

        // Validate required fields
        const requiredFields: Record<string, string> = {
            club: "Club",
            nombre: "Nombre",
            apellidoPaterno: "Apellido Paterno",
            fechaNacimiento: "Fecha de Nacimiento",
            curp: "CURP",
            escolaridad: "Escolaridad",
            calle: "Calle",
            numExt: "Número Exterior",
            colonia: "Colonia",
            municipio: "Municipio",
            estado: "Estado",
            cp: "Código Postal",
            telParticular: "Teléfono Particular",
            tipoAfiliadoPrincipal: "Afiliación Principal",
            nivelTecnico: "Nivel Técnico"
        }

        for (const [key, label] of Object.entries(requiredFields)) {
            if (!data[key] || data[key].trim() === "") {
                console.warn(`Validation failed: ${label} is missing.`);
                toast.error(`El campo ${label} es obligatorio`)
                return
            }
        }

        if (data.curp && data.curp.trim().length !== 18) {
            toast.error("El CURP debe tener exactamente 18 caracteres")
            return
        }

        const defaultModalidad = afiliado?.Modalidad?.toString() || Modalidades?.[0]?.id?.toString() || "1"

        if (afiliado) {
            // Edit Mode
            const changes: { campo: string; valor: string }[] = []

            // Field mapping: Form Name -> Backend Column Name
            const fieldMap: Record<string, string> = {
                nombre: "Nombre",
                apellidoPaterno: "Paterno",
                apellidoMaterno: "Materno",
                club: "id_Club",
                fechaNacimiento: "Fecha_nacimiento",
                curp: "Curp",
                genero: "Genero",
                escolaridad: "id_Escolaridad",
                calle: "Calle",
                numExt: "Exterior",
                numInt: "Interior",
                colonia: "Colonia",
                cp: "CP",
                municipio: "Ciudad",
                estado: "Estado",
                telParticular: "Telefono_c",
                telCelular: "Telefono_cel",
                tipoAfiliadoPrincipal: "Afiliacion_1",
                tipoAfiliadoSecundario: "Afiliacion_2",
                tipoAfiliadoTercero: "Afiliacion_3",
                tipoAfiliadoCuarto: "Afiliacion_4",
                nivelTecnico: "id_nivel_tec"
            }

            // Helper to get original value safely
            const getOriginalValue = (key: string): string => {
                switch (key) {
                    case "nombre": return afiliado.Nombre;
                    case "apellidoPaterno": return afiliado.Paterno;
                    case "apellidoMaterno": return afiliado.Materno;
                    case "club": return afiliado.id_Club.toString();
                    case "fechaNacimiento": return afiliado.Fecha_nacimiento ? afiliado.Fecha_nacimiento.split('T')[0] : "";
                    case "curp": return afiliado.Curp;
                    case "genero": return afiliado.Genero;
                    case "escolaridad": return afiliado.id_Escolaridad.toString();
                    case "calle": return afiliado.Calle;
                    case "numExt": return afiliado.Exterior;
                    case "numInt": return afiliado.Interior;
                    case "colonia": return afiliado.Colonia;
                    case "cp": return afiliado.CP;
                    case "municipio": return afiliado.Ciudad;
                    case "estado": return afiliado.Estado;
                    case "telParticular": return afiliado.Telefono_c;
                    case "telCelular": return afiliado.Telefono_cel;
                    case "tipoAfiliadoPrincipal": return afiliado.Afiliacion_1?.toString() || "";
                    case "tipoAfiliadoSecundario": return afiliado.Afiliacion_2?.toString() || "";
                    case "tipoAfiliadoTercero": return afiliado.Afiliacion_3?.toString() || "";
                    case "tipoAfiliadoCuarto": return afiliado.Afiliacion_4?.toString() || "";
                    case "nivelTecnico": return afiliado.id_nivel_tec.toString();
                    default: return "";
                }
            }

            for (const [formKey, backendField] of Object.entries(fieldMap)) {
                let newValue = data[formKey] || ""
                const originalValue = getOriginalValue(formKey) || ""

                if (formKey === 'curp') {
                    newValue = newValue.toUpperCase();
                }

                if (newValue !== originalValue) {
                    changes.push({ campo: backendField, valor: newValue })
                }
            }

            if (changes.length === 0) {
                toast.info("No hay cambios para guardar")
                return
            }

            try {
                console.log("Sending updates:", changes)
                await updateAfiliado(afiliado.id, { uno: changes })
                toast.success("Afiliado actualizado exitosamente")
                onSuccess?.()
            } catch (error) {
                console.error("Error updating afiliado:", error)
                toast.error("Error al actualizar el afiliado")
            }

        } else {
            // Create Mode
            const payload: CreateAfiliadoPayload = {
                nombre: data.nombre,
                paterno: data.apellidoPaterno,
                materno: data.apellidoMaterno,
                id_Club: data.club,
                fecha_nacimiento: data.fechaNacimiento,
                curp: data.curp.toUpperCase(),
                genero: data.genero === "masculino" ? "M" : "F",
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
                afiliacion_s: data.tipoAfiliadoSecundario || "",
                afiliacion_3: data.tipoAfiliadoTercero || "",
                afiliacion_4: data.tipoAfiliadoCuarto || "",
                id_nivel_tec: data.nivelTecnico,
                modalidad: defaultModalidad
            }

            console.log("Final Payload to API:", payload);

            try {
                console.log("Calling createAfiliado...");
                await createAfiliado(payload)
                toast.success("Afiliado creado exitosamente")

                // Small delay to ensure backend consistency before refetching
                setTimeout(() => {
                    onSuccess?.()
                }, 500)
            } catch (error) {
                console.error("Error creating afiliado:", error)
                toast.error("Error al crear el afiliado")
            }
        }
    }

    return (
        <form id={id} className={cn("space-y-6", className)} onSubmit={handleSubmit}>
            {/* hidden input to ensure club value is submitted even if disabled select doesn't submit it (though ShadCN Select usually works differently, disabled inputs typically don't send values in native forms) */}
            {/* Safe bet: always keep the Select enabled but visually 'disabled' or just ensure we pass it.
                Actually, controlled components in Shadcn/Radix might not pass name if disabled.
                Let's use a hidden input just in case if it's restricted.
            */}
            <input type="hidden" name="club" value={selectedClubId} />

            <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6 p-1">
                    {/* General Info */}
                    <div className="grid gap-6">
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Nombre : *" htmlFor="nombre" className="col-span-12 md:col-span-4">
                                <Input id="nombre" name="nombre" defaultValue={afiliado?.Nombre} />
                            </InputGroup>
                            <InputGroup label="Apellido Paterno : *" htmlFor="apellidoPaterno" className="col-span-12 md:col-span-4">
                                <Input id="apellidoPaterno" name="apellidoPaterno" defaultValue={afiliado?.Paterno} />
                            </InputGroup>
                            <InputGroup label="Apellido Materno :" htmlFor="apellidoMaterno" className="col-span-12 md:col-span-4">
                                <Input id="apellidoMaterno" name="apellidoMaterno" defaultValue={afiliado?.Materno} />
                            </InputGroup>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Asociación : *" className="col-span-12 md:col-span-6">
                                <Input value="ESTADO DE MÉXICO" disabled className="bg-muted/50" name="asociacion" />
                            </InputGroup>
                            <InputGroup label="Club : *" className="col-span-12 md:col-span-6">
                                <Select
                                    name="club_select" // Rename to avoid conflict with hidden input, or just rely on state
                                    value={selectedClubId}
                                    onValueChange={setSelectedClubId}
                                    // eslint-disable-next-line eqeqeq
                                    disabled={authData?.tipo_registro != 1 && !afiliado}
                                >
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
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Tipo de Afiliado Principal : *" className="col-span-12 md:col-span-6">
                                <Select name="tipoAfiliadoPrincipal" defaultValue={afiliado?.Afiliacion_1?.toString()}>
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
                            <InputGroup label="Tipo de Afiliado Secundario :" className="col-span-12 md:col-span-6">
                                <Select name="tipoAfiliadoSecundario" defaultValue={afiliado?.Afiliacion_2?.toString()}>
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
                            <InputGroup label="Tipo de Afiliado Tercero :" className="col-span-12 md:col-span-6">
                                <Select name="tipoAfiliadoTercero" defaultValue={afiliado?.Afiliacion_3?.toString()}>
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
                            <InputGroup label="Tipo de Afiliado Cuarto :" className="col-span-12 md:col-span-6">
                                <Select name="tipoAfiliadoCuarto" defaultValue={afiliado?.Afiliacion_4?.toString()}>
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
                            <InputGroup label="Nivel Tecnico : *" className="col-span-12 md:col-span-6">
                                <Select name="nivelTecnico" defaultValue={afiliado?.id_nivel_tec?.toString()}>
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
                            <InputGroup label="Escolaridad : *" className="col-span-12 md:col-span-6">
                                <Select name="escolaridad" defaultValue={afiliado?.id_Escolaridad?.toString()}>
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
                                <Input id="fechaNacimiento" name="fechaNacimiento" type="date" defaultValue={afiliado?.Fecha_nacimiento ? afiliado.Fecha_nacimiento.split('T')[0] : ''} />
                            </InputGroup>
                            <InputGroup label="CURP : *" htmlFor="curp" className="col-span-12 md:col-span-4">
                                <Input id="curp" name="curp" defaultValue={afiliado?.Curp} />
                            </InputGroup>
                            <div className="col-span-12 md:col-span-4 space-y-3">
                                <Label>Género : *</Label>
                                <RadioGroup defaultValue={afiliado?.Genero || "femenino"} className="flex gap-4" name="genero">
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
                                <Input id="calle" name="calle" defaultValue={afiliado?.Calle} />
                            </InputGroup>
                            <InputGroup label="# Exterior : *" htmlFor="num-ext" className="col-span-6 md:col-span-3">
                                <Input id="num-ext" name="numExt" defaultValue={afiliado?.Exterior} />
                            </InputGroup>
                            <InputGroup label="# Interior :" htmlFor="num-int" className="col-span-6 md:col-span-3">
                                <Input id="num-int" name="numInt" defaultValue={afiliado?.Interior} />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Colonia : *" htmlFor="colonia" className="col-span-12 md:col-span-4">
                                <Input id="colonia" name="colonia" defaultValue={afiliado?.Colonia} />
                            </InputGroup>
                            <InputGroup label="Ciudad/Delegación/Municipio : *" htmlFor="municipio" className="col-span-12 md:col-span-4">
                                <Input id="municipio" name="municipio" defaultValue={afiliado?.Ciudad} />
                            </InputGroup>
                            <InputGroup label="Estado : *" className="col-span-12 md:col-span-2">
                                <Select name="estado" defaultValue={afiliado?.Estado}>
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
                                <Input id="cp" name="cp" defaultValue={afiliado?.CP} />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Email : *" htmlFor="email" className="col-span-12 md:col-span-4">
                                {/* Note: Email is not in the Afiliado interface provided in the issue description, assuming it might be added or optional, skipping default for now if not present */}
                                <Input id="email" type="email" name="email" />
                            </InputGroup>
                            <InputGroup label="Teléfono Particular : *" htmlFor="tel-particular" className="col-span-12 md:col-span-4">
                                <Input id="tel-particular" name="telParticular" defaultValue={afiliado?.Telefono_c} />
                            </InputGroup>
                            <InputGroup label="Teléfono Celular :" htmlFor="tel-celular" className="col-span-12 md:col-span-4">
                                <Input id="tel-celular" name="telCelular" defaultValue={afiliado?.Telefono_cel} />
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </form>
    )
}
