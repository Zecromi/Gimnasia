"use client"

import * as React from "react"
import { CircleFadingArrowUp, Upload, Key, Database, Building2, Lock, RefreshCw, FileText, Copy, Check, Save, Eye, EyeOff } from "lucide-react"

import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { updateClub, mapStateToClubPayload, getClubDetail, getGlobalInfo, Estado, setSeg, SetSegPayload } from "@/lib/club-service"
import { useAuthStore } from "@/lib/store/auth-store"


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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { ViewClubGral } from "@/lib/club-service"
import { postBlock } from "@/lib/evento-service"

interface EditClubDialogProps {
    club: ViewClubGral
    children: React.ReactNode
}

export function EditClubDialog({ club, children }: EditClubDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [estados, setEstados] = React.useState<Estado[]>([])
    const isMobile = useIsMobile()

    React.useEffect(() => {
        const fetchInfo = async () => {
            try {
                const globalInfo = await getGlobalInfo()
                if (globalInfo && globalInfo.Estados) {
                    setEstados(globalInfo.Estados)
                }
            } catch (error) {
                console.error("Error fetching global info:", error)
            }
        }
        fetchInfo()
    }, [])


    // Map ViewClubGral to form structure expected by mapStateToClubPayload or directly to inputs
    // The inputs in GeneralInfoForm etc need to be registered
    const methods = useForm({
        defaultValues: {
            nombre: club.Club,
            asociacion: club.Asociacion,
            alias: club.Alias,
            email: club.Email,
            web: club.Web,
            fundacion: club.Fundacion ? club.Fundacion.split("T")[0] : "",
            sector: club.Sector ? "privado" : "publico",
            telPrincipal: club.Telefono1,
            telSecundario: club.Telefono2,
            telMovil: "", // Not in ViewClubGral

            // Addresses - Assuming social address based on available fields or leaving empty if not mapped
            calle: "", // Not in ViewClubGral
            numExt: "",
            numInt: "",
            colonia: "",
            municipio: "",
            estado: "",
            cp: "",

            // Fiscal - Assuming same logic
            rfc: club.rfc,
            igualDomicilio: false,
            calleFiscal: "",
            numExtFiscal: "",
            numIntFiscal: "",
            coloniaFiscal: "",
            municipioFiscal: "",
            estadoFiscal: "",
            cpFiscal: "",

            // Aparatos
            nacionales: club.Tipo_aparatos_nac,
            importados: club.Tipo_aparatos_imp,
            homologados: club.Tipos_aparatos_fig,
            otros: club.Tipos_aparatos_otros,

            tipoInstalaciones: club.Tipo_instalaciones ? "rentadas" : "propias", // Check logic: 1 rentada (true), 0 propia (false)
            organismos: false, // Not in ViewClubGral

            // Access Control
            usuarioAccess: club.usuario || `admin.${club.Club?.toLowerCase().replace(/\s/g, '') || ''}`,
            passwordAccess: club.password || ""
        }
    })

    React.useEffect(() => {
        const fetchDetails = async () => {
            if (!club.id) return
            try {
                const details = await getClubDetail(club.id)
                if (details && details.Clubs && details.Clubs.length > 0) {
                    const c = details.Clubs[0]
                    const postal = details.DireccionPostal && details.DireccionPostal.length > 0 ? details.DireccionPostal[0] : null
                    const fiscal = details.DireccionFiscal && details.DireccionFiscal.length > 0 ? details.DireccionFiscal[0] : null

                    methods.reset({
                        nombre: c.Nombre,
                        asociacion: c.Asociacion,
                        alias: c.Alias,
                        email: c.Email,
                        web: c.Web,
                        fundacion: c.Fundacion ? c.Fundacion.split("T")[0] : "",
                        sector: c.Sector ? "privado" : "publico",
                        telPrincipal: c.Telefono1,
                        telSecundario: c.Telefono2,
                        telMovil: "", // Still missing in API

                        // Address from API
                        calle: postal?.Calle || "",
                        numExt: postal?.Exterior || "",
                        numInt: postal?.Interior || "",
                        colonia: postal?.Colonia || "",
                        municipio: "", // Missing in API response based on user prompt? User prompt example: "Calle", "Exterior", "Interior", "Colonia", "cp", "Tipo_domicilio", "id_estado". Muncipio IS MISSING.
                        estado: postal?.id_estado ? postal.id_estado.toString() : "", // Mapping ID to value
                        cp: postal?.cp || "",

                        // Fiscal from API
                        rfc: c.rfc,
                        igualDomicilio: false,
                        calleFiscal: fiscal?.Calle || "",
                        numExtFiscal: fiscal?.Exterior || "",
                        numIntFiscal: fiscal?.Interior || "",
                        coloniaFiscal: fiscal?.Colonia || "",
                        municipioFiscal: "",
                        estadoFiscal: fiscal?.id_estado ? fiscal.id_estado.toString() : "",
                        cpFiscal: fiscal?.cp || "",

                        // Aparatos
                        nacionales: c.Tipo_aparatos_nac,
                        importados: c.Tipo_aparatos_imp,
                        homologados: c.Tipos_aparatos_fig,
                        otros: c.Tipos_aparatos_otros,

                        tipoInstalaciones: c.Tipo_instalaciones ? "rentadas" : "propias",
                        organismos: false
                    })
                }
            } catch (error) {
                console.error("Error fetching club details:", error)
                toast.error("Error al cargar detalles del club")
            }
        }

        fetchDetails()
    }, [club.id, methods])

    const onSubmit = async (data: any) => {
        try {
            const payload = mapStateToClubPayload(data)
            await updateClub(club.id, payload)
            toast.success("Club actualizado exitosamente")
            setOpen(false)
            // Optionally refresh store here if strictly needed, 
            // but for now let's assume global update or parent trigger if we had one.
            // A simple page reload or re-fetch would be ideal if we had access to fetchClubs.
            window.location.reload() // Simplest way to ensure everything stays in sync for now given the constraints
        } catch (error) {
            console.error("Error updating club:", error)
            toast.error("Error al actualizar el club")
        }
    }

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="h-[95vh]">
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="h-full flex flex-col">
                            <DrawerHeader className="text-left">
                                <DrawerTitle>Editar Club: {club.Club}</DrawerTitle>
                            </DrawerHeader>
                            <div className="flex-1 px-4 overflow-hidden">
                                <EditClubTabs id="edit-club-form-mobile" club={club} estados={estados} />
                            </div>
                        </form>
                    </FormProvider>
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
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="h-full flex flex-col overflow-hidden">
                        <DialogHeader className="px-6 py-4 border-b">
                            <DialogTitle>Editar Club: {club.Club}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-hidden">
                            <EditClubTabs id="edit-club-form-desktop" club={club} estados={estados} />
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}

function EditClubTabs({ className, id, club, estados }: { className?: string, id: string, club: ViewClubGral, estados: Estado[] }) {
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
                            <GeneralInfoForm id={`${id}-general`} club={club} estados={estados} />
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

function GeneralInfoForm({ id, club, estados }: { id: string, club: ViewClubGral, estados: Estado[] }) {
    const { register, setValue } = useFormContext()

    return (
        <div className="space-y-6">
            {/* General Info */}
            <div className="grid gap-6">
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Nombre del club *" htmlFor="nombre" className="col-span-12 md:col-span-6">
                        <Input id="nombre" {...register("nombre")} />
                    </InputGroup>
                    <InputGroup label="Asociación *" className="col-span-12 md:col-span-4">
                        <Input disabled className="bg-muted/50" {...register("asociacion")} />
                    </InputGroup>
                    <InputGroup label="Alias" htmlFor="alias" className="col-span-12 md:col-span-2">
                        <Input id="alias" {...register("alias")} />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="E-mail *" htmlFor="email" className="col-span-12 md:col-span-4">
                        <Input id="email" type="email" {...register("email")} />
                    </InputGroup>
                    <InputGroup label="Pagina web" htmlFor="web" className="col-span-12 md:col-span-4">
                        <Input id="web" {...register("web")} />
                    </InputGroup>
                    <InputGroup label="Fundación" htmlFor="fundacion" className="col-span-12 md:col-span-2">
                        <Input id="fundacion" type="date" {...register("fundacion")} />
                    </InputGroup>
                    <div className="col-span-12 md:col-span-2 space-y-3">
                        <Label>Sector</Label>
                        {/* Radio groups are trickier with register, better to use Controller or simple native inputs matching react-hook-form expectations if possible, or just register the same name */}
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="privado" value="privado" {...register("sector")} className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                <Label htmlFor="privado">Privado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="publico" value="publico" {...register("sector")} className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                <Label htmlFor="publico">Publico</Label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Teléfono principal *" htmlFor="tel-principal" className="col-span-12 md:col-span-3">
                        <Input id="tel-principal" {...register("telPrincipal")} />
                    </InputGroup>
                    <InputGroup label="Teléfono secundario" htmlFor="tel-secundario" className="col-span-12 md:col-span-3">
                        <Input id="tel-secundario" {...register("telSecundario")} />
                    </InputGroup>
                    <InputGroup label="Teléfono móvil *" htmlFor="tel-movil" className="col-span-12 md:col-span-3">
                        <Input id="tel-movil" {...register("telMovil")} />
                    </InputGroup>
                    <div className="col-span-12 md:col-span-3 space-y-3">
                        <Label>Tipo de instalaciones</Label>
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="propias" value="propias" {...register("tipoInstalaciones")} className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                <Label htmlFor="propias">Propias</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="rentadas" value="rentadas" {...register("tipoInstalaciones")} className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                <Label htmlFor="rentadas">Rentadas</Label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="organismos" onCheckedChange={(c) => register("organismos").onChange({ target: { checked: c, name: "organismos" } })} />
                    {/* Checkbox wrapper might block register ref, using native input or simple Controller is safer for now but let's try manual wiring or native if simple */}
                    <Label htmlFor="organismos">Organismos afines: Si</Label>
                </div>
            </div>

            {/* Domicilio Social */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Domicilio Social :</h3>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Calle *" htmlFor="calle" className="col-span-12 md:col-span-6">
                        <Input id="calle" {...register("calle")} />
                    </InputGroup>
                    <InputGroup label="# Exterior *" htmlFor="num-ext" className="col-span-6 md:col-span-2">
                        <Input id="num-ext" {...register("numExt")} />
                    </InputGroup>
                    <InputGroup label="# Interior" htmlFor="num-int" className="col-span-6 md:col-span-2">
                        <Input id="num-int" {...register("numInt")} />
                    </InputGroup>
                    <InputGroup label="Colonia *" htmlFor="colonia" className="col-span-12 md:col-span-2">
                        <Input id="colonia" {...register("colonia")} />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="CD / Delegación / Municipio *" htmlFor="municipio" className="col-span-12 md:col-span-4">
                        <Input id="municipio" {...register("municipio")} />
                    </InputGroup>
                    <InputGroup label="Estado *" className="col-span-12 md:col-span-4">
                        {/* Simplified Select for RHF */}
                        <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...register("estado")}>
                            <option value="">Seleccione una opción</option>
                            {estados?.map((estado) => (
                                <option key={estado.id} value={estado.id.toString()}>{estado.Nombre}</option>
                            ))}
                        </select>
                    </InputGroup>
                    <InputGroup label="C.P. *" htmlFor="cp" className="col-span-12 md:col-span-2">
                        <Input id="cp" {...register("cp")} />
                    </InputGroup>
                </div>
            </div>

            {/* Domicilio Fiscal */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Domicilio Fiscal :</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox id="igual-domicilio" onCheckedChange={(c) => register("igualDomicilio").onChange({ target: { checked: c, name: "igualDomicilio" } })} />
                    <Label htmlFor="igual-domicilio">Igual a domicilio social</Label>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Calle *" htmlFor="calle-fiscal" className="col-span-12 md:col-span-6">
                        <Input id="calle-fiscal" {...register("calleFiscal")} />
                    </InputGroup>
                    <InputGroup label="# Exterior *" htmlFor="num-ext-fiscal" className="col-span-6 md:col-span-2">
                        <Input id="num-ext-fiscal" {...register("numExtFiscal")} />
                    </InputGroup>
                    <InputGroup label="# Interior" htmlFor="num-int-fiscal" className="col-span-6 md:col-span-2">
                        <Input id="num-int-fiscal" {...register("numIntFiscal")} />
                    </InputGroup>
                    <InputGroup label="Colonia *" htmlFor="colonia-fiscal" className="col-span-12 md:col-span-2">
                        <Input id="colonia-fiscal" {...register("coloniaFiscal")} />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="CD / Delegación / Municipio *" htmlFor="municipio-fiscal" className="col-span-12 md:col-span-4">
                        <Input id="municipio-fiscal" {...register("municipioFiscal")} />
                    </InputGroup>
                    <InputGroup label="Estado *" className="col-span-12 md:col-span-4">
                        <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...register("estadoFiscal")}>
                            <option value="">Seleccione una opción</option>
                            {estados?.map((estado) => (
                                <option key={estado.id} value={estado.id.toString()}>{estado.Nombre}</option>
                            ))}
                        </select>
                    </InputGroup>
                    <InputGroup label="C.P. *" htmlFor="cp-fiscal" className="col-span-6 md:col-span-2">
                        <Input id="cp-fiscal" {...register("cpFiscal")} />
                    </InputGroup>
                    <InputGroup label="RFC *" htmlFor="rfc" className="col-span-6 md:col-span-2">
                        <Input id="rfc" {...register("rfc")} />
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
                            <CheckboxInput name="nacionales" />
                            <Label htmlFor="nacionales">Si</Label>
                        </div>
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Importados:</Label>
                        <div className="flex items-center space-x-2">
                            <CheckboxInput name="importados" />
                            <Label htmlFor="importados">Si</Label>
                        </div>
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Homologados FIG:</Label>
                        <div className="flex items-center space-x-2">
                            <CheckboxInput name="homologados" />
                            <Label htmlFor="homologados">Si</Label>
                        </div>
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Aparatos otros:</Label>
                        <div className="flex items-center space-x-2">
                            <CheckboxInput name="otros" />
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

function ModalidadesForm({ id, club }: { id: string, club: ViewClubGral }) {
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

function AccesoForm({ id, club }: { id: string, club: ViewClubGral }) {
    const [showDisableDialog, setShowDisableDialog] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [debugPayload, setDebugPayload] = React.useState<string>("")
    const { register, getValues } = useFormContext()
    const authData = useAuthStore((state) => state.authData)

    const handleDisableAccess = async () => {
        try {
            const user = club.usuario || `admin.${club.Club?.toLowerCase().replace(/\s/g, '') || ''}`
            await postBlock(user, "2")
            toast.success("Acceso desactivado correctamente")
            setShowDisableDialog(false)
        } catch (error) {
            console.error("Error disabling access:", error)
            toast.error("Error al desactivar el acceso")
        }
    }

    const handleUpdateAccess = async () => {
        const values = getValues()

        // Calculate the default username again as fallback if form state is somehow empty but it should be handled by defaultValues now
        const defaultUser = club.usuario || `admin.${club.Club?.toLowerCase().replace(/\s/g, '') || ''}`

        const payload: SetSegPayload = {
            id: String(club.id),
            tipo_registro: "2",
            usuario: values.usuarioAccess || defaultUser,
            password: values.passwordAccess || club.password || "",
            intentos: "0",
            bloqueo: "0"
        }

        try {
            const jsonString = JSON.stringify(payload, null, 2);
            setDebugPayload(jsonString);
            console.log("JSON ENVIADO A /SetSeg (String Strict):", jsonString);
            await setSeg(payload)
            toast.success("Credenciales actualizadas correctamente")
        } catch (error: any) {
            console.error("Error updating credentials:", error)
            if (error.response?.data) {
                console.error("SERVER ERROR DETAIL:", JSON.stringify(error.response.data, null, 2));
                toast.error(`Error servidor: ${JSON.stringify(error.response.data).substring(0, 50)}...`);
            } else {
                toast.error("Error al actualizar credenciales")
            }
        }
    }

    return (
        <div className="space-y-6">
            <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro de desactivar el acceso?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción bloqueará el acceso al sistema para este club. Podrá reactivarlo posteriormente si es necesario.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDisableAccess} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Desactivar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <Key className="mr-2 h-5 w-5" />
                Control de Acceso
            </h3>
            <div className="grid gap-6 p-4 max-w-2xl">
                <div className="space-y-4">
                    <InputGroup label="Nombre de usuario" htmlFor="user-name">
                        <div className="flex gap-2">
                            <Input
                                id="user-name"
                                defaultValue={club.usuario || `admin.${club.Club?.toLowerCase().replace(/\s/g, '') || ''}`}
                                {...register("usuarioAccess")}
                                className="bg-background"
                            />
                            <CopyButton value={club.usuario || `admin.${club.Club?.toLowerCase().replace(/\s/g, '') || ''}`} />
                        </div>
                    </InputGroup>

                    <InputGroup label="Contraseña" htmlFor="user-password">
                        <div className="flex gap-2 relative">
                            <div className="relative flex-1">
                                <Input
                                    id="user-password"
                                    defaultValue={club.password || ""}
                                    type={showPassword ? "text" : "password"}
                                    {...register("passwordAccess")}
                                    className="bg-background pr-10"
                                    placeholder="Ingrese contraseña"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            <CopyButton value={club.password || ""} />
                        </div>
                    </InputGroup>
                </div>
                {debugPayload && (
                    <div className="mt-4 p-4 bg-muted rounded-md overflow-auto">
                        <h4 className="text-sm font-semibold mb-2">Debug Payload Output:</h4>
                        <pre className="text-xs">{debugPayload}</pre>
                    </div>
                )}
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Acciones de cuenta</h4>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <Button
                            type="button"
                            onClick={handleUpdateAccess}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Actualizar Credenciales
                        </Button>

                        <div className="flex-1"></div>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        className="w-full sm:w-auto"
                                        onClick={() => setShowDisableDialog(true)}
                                    >
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

function LogoForm({ id, club }: { id: string, club: ViewClubGral }) {
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

// Helper for Checkbox integration
function CheckboxInput({ name }: { name: string }) {
    const { watch, setValue } = useFormContext()
    const value = watch(name)

    return (
        <Checkbox
            id={name}
            checked={!!value}
            onCheckedChange={(checked) => setValue(name, !!checked)}
        />
    )
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = () => {
        if (!value) return
        navigator.clipboard.writeText(value)
        setCopied(true)
        toast.success("Copiado al portapapeles")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={handleCopy}
                        disabled={!value}
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{copied ? "Copiado!" : "Copiar"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
