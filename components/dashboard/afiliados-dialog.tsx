"use client"

import * as React from "react"
import { Plus, Save } from "lucide-react"
import { toast } from "sonner"
import { AfiliadosCatalogsResponse, getAfiliadosCatalogs, createAfiliado, updateAfiliado, CreateAfiliadoPayload, Afiliado } from "@/lib/afiliados-service"
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
    open?: boolean
    onOpenChange?: (open: boolean) => void
    clubs?: ViewClubGral[]
    catalogs?: AfiliadosCatalogsResponse
}

export function AfiliadosDialog({ afiliado, trigger, onSuccess, open: controlledOpen, onOpenChange: controlledOnOpenChange, clubs, catalogs }: AfiliadosDialogProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isMobile = useIsMobile()

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? (controlledOnOpenChange || (() => { })) : setInternalOpen

    const title = afiliado ? "Editar Afiliado" : "Nuevo Afiliado"
    const description = afiliado
        ? "Modifique los datos del afiliado existente."
        : "Ingrese los datos para registrar un nuevo afiliado."

    const handleSuccess = () => {

        setOpen(false)
        onSuccess?.()
    }

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen} dismissible={false}>
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
                        <AfiliadosForm id="afiliados-form-mobile" afiliado={afiliado} onSuccess={handleSuccess} clubs={clubs} catalogs={catalogs} />
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
            <DialogContent
                className="sm:max-w-[auto] max-h-[auto] flex flex-col p-0"
                onInteractOutside={(e) => {
                    e.preventDefault()
                }}
            >
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex-1">
                    <div className="px-6 py-6">
                        <AfiliadosForm id="afiliados-form-desktop" afiliado={afiliado} onSuccess={handleSuccess} clubs={clubs} catalogs={catalogs} />
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



interface AfiliadosFormProps extends React.ComponentProps<"form"> {
    afiliado?: Afiliado
    onSuccess?: () => void
    clubs?: ViewClubGral[]
    catalogs?: AfiliadosCatalogsResponse
}

// --- Sub-components for Form Sections (Memoized for performance) ---

const PersonalDataSection = React.memo(({ afiliado, activeCatalogs }: { afiliado?: Afiliado, activeCatalogs: any }) => (
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
            <InputGroup label="Fecha de Nacimiento : *" htmlFor="fechaNacimiento" className="col-span-12 md:col-span-4">
                <Input id="fechaNacimiento" name="fechaNacimiento" type="date" defaultValue={afiliado?.Fecha_nacimiento ? afiliado.Fecha_nacimiento.split('T')[0] : ''} />
            </InputGroup>
            <InputGroup label="CURP : *" htmlFor="curp" className="col-span-12 md:col-span-4">
                <Input id="curp" name="curp" defaultValue={afiliado?.Curp} />
            </InputGroup>
            <div className="col-span-12 md:col-span-4 space-y-3">
                <Label>Género : *</Label>
                <RadioGroup
                    defaultValue={afiliado?.Genero === "M" ? "masculino" : "femenino"}
                    className="flex gap-4"
                    name="genero"
                >
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

        <div className="grid grid-cols-12 gap-6">
            <InputGroup label="Escolaridad : *" className="col-span-12 md:col-span-6">
                <Select name="escolaridad" defaultValue={afiliado?.id_Escolaridad?.toString()}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                        {activeCatalogs.Escolaridad.map((item: any) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.Nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </InputGroup>
        </div>
    </div>
));

const AffiliationSection = React.memo(({ afiliado, activeCatalogs, uniqueClubs, selectedClubId, setSelectedClubId, authData }: any) => (
    <div className="grid gap-6">
        <div className="grid grid-cols-12 gap-6">
            <InputGroup label="Asociación : *" className="col-span-12 md:col-span-6">
                <Input value="ESTADO DE MÉXICO" disabled className="bg-muted/50" name="asociacion" />
            </InputGroup>
            <InputGroup label="Club : *" className="col-span-12 md:col-span-6">
                <Select
                    key={selectedClubId || "empty"}
                    value={selectedClubId}
                    onValueChange={setSelectedClubId}
                    disabled={authData?.tipo_registro != 1 && !afiliado}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                        {uniqueClubs.map((club: any) => (
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
                        {activeCatalogs.Catalogo_afiliaciones.map((item: any) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.Nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </InputGroup>
            <InputGroup label="Tipo de Afiliado Secundario :" className="col-span-12 md:col-span-6">
                <Select name="tipoAfiliadoSecundario" defaultValue={afiliado?.Afiliacion_2?.toString() || "none"}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                        {activeCatalogs.Catalogo_afiliaciones.map((item: any) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.Nombre}
                            </SelectItem>
                        ))}
                        <SelectItem value="none">Ninguno</SelectItem>
                    </SelectContent>
                </Select>
            </InputGroup>
        </div>

        <div className="grid grid-cols-12 gap-6">
            <InputGroup label="Tipo de Afiliado Tercero :" className="col-span-12 md:col-span-6">
                <Select name="tipoAfiliadoTercero" defaultValue={afiliado?.Afiliacion_3?.toString() || "none"}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                        {activeCatalogs.Catalogo_afiliaciones.map((item: any) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.Nombre}
                            </SelectItem>
                        ))}
                        <SelectItem value="none">Ninguno</SelectItem>
                    </SelectContent>
                </Select>
            </InputGroup>
            <InputGroup label="Tipo de Afiliado Cuarto :" className="col-span-12 md:col-span-6">
                <Select name="tipoAfiliadoCuarto" defaultValue={afiliado?.Afiliacion_4?.toString() || "none"}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                        {activeCatalogs.Catalogo_afiliaciones.map((item: any) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.Nombre}
                            </SelectItem>
                        ))}
                        <SelectItem value="none">Ninguno</SelectItem>
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
                        {activeCatalogs.Niveles_tecnicos.map((item: any) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                                {item.Descripcion}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </InputGroup>
        </div>
    </div>
));

const ContactSection = React.memo(({ afiliado, activeCatalogs }: { afiliado?: Afiliado, activeCatalogs: any }) => (
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
                        {activeCatalogs.Estados.map((item: any) => (
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
));

PersonalDataSection.displayName = "PersonalDataSection";
AffiliationSection.displayName = "AffiliationSection";
ContactSection.displayName = "ContactSection";

function AfiliadosForm({ className, id, afiliado, onSuccess, clubs: clubsProp, catalogs: catalogsProp }: AfiliadosFormProps) {
    const { Modalidades, fetchCatalogs, Catalogo_afiliaciones, Niveles_tecnicos, Estados: StoreEstados, Escolaridad: StoreEscolaridad } = useCatalogStore()

    const activeCatalogs = React.useMemo(() => catalogsProp || {
        Catalogo_afiliaciones: Catalogo_afiliaciones,
        Niveles_tecnicos: Niveles_tecnicos,
        Estados: StoreEstados,
        Escolaridad: StoreEscolaridad,
        Puestos: [],
        Modalidades: Modalidades,
        View_Modalidades_detalle: [],
        Catalogo_eventos: []
    }, [catalogsProp, Catalogo_afiliaciones, Niveles_tecnicos, StoreEstados, StoreEscolaridad, Modalidades])

    const [isLoading, setIsLoading] = React.useState(false)
    const [clubs, setClubs] = React.useState<ViewClubGral[]>(clubsProp || [])
    const authData = useAuthStore((state) => state.authData)
    const [selectedClubId, setSelectedClubId] = React.useState<string>(
        afiliado?.id_Club?.toString() || ""
    )

    const uniqueClubs = React.useMemo(() => {
        return Array.from(new Map(clubs.map(club => [club.id, club])).values())
    }, [clubs])

    React.useEffect(() => {
        const initData = async () => {
            if (clubsProp) {
                let loadedClubs = clubsProp
                if (authData && authData.tipo_registro != 1) {
                    loadedClubs = loadedClubs.filter(c => c.id.toString() === authData.id.toString())
                }
                setClubs(loadedClubs)
            } else {
                setIsLoading(true)
                try {
                    const clubsData = await getClubs()
                    let loadedClubs = clubsData.View_Club_gral
                    if (authData && authData.tipo_registro != 1) {
                        loadedClubs = loadedClubs.filter(c => c.id.toString() === authData.id.toString())
                    }
                    setClubs(loadedClubs)
                } catch (e) {
                    console.error(e)
                } finally {
                    setIsLoading(false)
                }
            }

            if (!catalogsProp) {
                await fetchCatalogs()
            }
        }

        initData()
    }, [clubsProp, catalogsProp, fetchCatalogs, authData])

    React.useEffect(() => {
        if (!afiliado && uniqueClubs.length === 1 && selectedClubId === "") {
            setSelectedClubId(uniqueClubs[0].id.toString())
        }
    }, [uniqueClubs, afiliado, selectedClubId])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries()) as Record<string, string>

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
            const changes: { campo: string; valor: string }[] = []
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
                if (newValue === "none") newValue = ""
                const originalValue = getOriginalValue(formKey) || ""
                if (formKey === 'curp') newValue = newValue.toUpperCase();
                if (formKey === 'genero') newValue = newValue === "masculino" ? "M" : "F"
                if (newValue !== originalValue) changes.push({ campo: backendField, valor: newValue })
            }

            if (changes.length === 0) {
                toast.info("No hay cambios para guardar")
                return
            }

            try {
                await updateAfiliado(afiliado.id, { uno: changes })
                toast.success("Afiliado actualizado exitosamente")
                onSuccess?.()
            } catch (error) {
                console.error("Error updating afiliado:", error)
                toast.error("Error al actualizar el afiliado")
            }
        } else {
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
                afiliacion_s: (data.tipoAfiliadoSecundario === "none" ? "" : data.tipoAfiliadoSecundario) || "",
                afiliacion_3: (data.tipoAfiliadoTercero === "none" ? "" : data.tipoAfiliadoTercero) || "",
                afiliacion_4: (data.tipoAfiliadoCuarto === "none" ? "" : data.tipoAfiliadoCuarto) || "",
                id_nivel_tec: data.nivelTecnico,
                modalidad: defaultModalidad
            }

            try {
                await createAfiliado(payload)
                toast.success("Afiliado creado exitosamente")
                setTimeout(() => { onSuccess?.() }, 500)
            } catch (error) {
                console.error("Error creating afiliado:", error)
                toast.error("Error al crear el afiliado")
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Cargando formulario...</p>
                </div>
            </div>
        )
    }

    return (
        <form id={id} className={cn("space-y-6", className)} onSubmit={handleSubmit}>
            <input type="hidden" name="club" value={selectedClubId} />
            <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6 p-1">
                    <PersonalDataSection afiliado={afiliado} activeCatalogs={activeCatalogs} />
                    <AffiliationSection
                        afiliado={afiliado}
                        activeCatalogs={activeCatalogs}
                        uniqueClubs={uniqueClubs}
                        selectedClubId={selectedClubId}
                        setSelectedClubId={setSelectedClubId}
                        authData={authData}
                    />
                    <ContactSection afiliado={afiliado} activeCatalogs={activeCatalogs} />
                </div>
            </ScrollArea>
        </form>
    )
}
