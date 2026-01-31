"use client"

import * as React from "react"
import { Plus, Save, CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import { useCatalogStore } from "@/lib/store/catalog-store"
import { clubSchema } from "@/lib/schemas/club/club-schema"
import { ZodError } from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { createClub, mapStateToClubPayload } from "@/lib/club-service"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
    DialogClose,
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

export function ClubDialog({ onClubCreated }: { onClubCreated?: () => void }) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [successData, setSuccessData] = React.useState<any>(null)
    const isMobile = useIsMobile()



    const handleSubmit = async (data: any) => {
        setIsLoading(true)

        try {
            const payload = mapStateToClubPayload(data)
            console.log("Submitting payload:", payload)

            const response = await createClub(payload)
            console.log("Response:", response)
            toast.success("Club guardado exitosamente")
            // Don't close dialog, show success state instead. Refresh happens on close.
            setSuccessData(response)

        } catch (error: any) {
            console.error("Error creating club:", error)
            if (error.response) {
                console.error("Server Error Details:", error.response.data)
            }
            toast.error("Error al guardar el club")
        } finally {
            setIsLoading(false)
        }
    }

    const getFormattedSuccessMessage = () => {
        if (!successData) return ""
        if (Array.isArray(successData) && successData.length > 0) {
            const item = successData[0]
            return `Usuario: ${item.usuario}\nPassword: ${item.password}`
        }
        return JSON.stringify(successData, null, 2)
    }

    const successMessage = getFormattedSuccessMessage()

    const SuccessContent = () => (
        <>
            <DialogHeader className="px-6 py-4 border-b">
                <DialogTitle>Club Creado Exitosamente</DialogTitle>
                <DialogDescription>
                    Credenciales
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 p-6">
                <div className="grid flex-1 gap-2 h-full">
                    <ScrollArea className="h-full max-h-[300px] w-full rounded-md border p-4 bg-muted/50">
                        <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                            {successMessage}
                        </pre>
                    </ScrollArea>
                </div>
            </div>
            <DialogFooter className="p-4 border-t sm:justify-start">
                <CopyButton value={successMessage} />
                <Button type="button" variant="secondary" onClick={() => {
                    setSuccessData(null)
                    setOpen(false)
                    onClubCreated?.() // Refresh parent data when closing success modal
                }}>
                    Cerrar
                </Button>
            </DialogFooter>
        </>
    )

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                        <Plus className="h-6 w-6" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[90vh]">
                    {successData ? (
                        <SuccessContent />
                    ) : (
                        <>
                            <DrawerHeader className="text-left">
                                <DrawerTitle>Nuevo Club</DrawerTitle>
                            </DrawerHeader>
                            <div className="flex-1 px-4">
                                <ClubForm id="club-form-mobile" onSubmit={handleSubmit} />
                            </div>
                            <DrawerFooter className="pt-2 border-t">
                                <Button form="club-form-mobile" type="submit" disabled={isLoading}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isLoading ? "Guardando..." : "Guardar"}
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </>
                    )}
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
            <DialogContent
                className={cn("flex flex-col p-0 transition-all duration-300", successData ? "sm:max-w-md" : "sm:max-w-[900px] max-h-[90vh]")}
                onInteractOutside={(e) => e.preventDefault()}
            >
                {successData ? (
                    <SuccessContent />
                ) : (
                    <>
                        <DialogHeader className="px-6 py-4 border-b">
                            <DialogTitle>Nuevo Club</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1">
                            <div className="px-6 py-6">
                                <ClubForm id="club-form-desktop" onSubmit={handleSubmit} />
                            </div>
                        </div>
                        <DialogFooter className="p-4 border-t">
                            <Button form="club-form-desktop" type="submit" className="w-[100px]" disabled={isLoading}>
                                <Save className="mr-2 h-4 w-4" />
                                {isLoading ? "..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

// Define custom props to override onSubmit signature
interface ClubFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
    onSubmit: (data: any) => void
}

function ClubForm({ className, id, onSubmit }: ClubFormProps) {
    const { Estados, fetchCatalogs } = useCatalogStore()
    const [formData, setFormData] = React.useState<any>({
        nombre: "",
        alias: "",
        asociacion: "ESTADO DE MÉXICO", // Added required field
        email: "",
        web: "",
        fundacion: "",
        sector: "privado",
        telPrincipal: "",
        telSecundario: "",
        telMovil: "",
        tipoInstalaciones: "propias",
        // Domicilio Social
        calle: "",
        numExt: "",
        numInt: "",
        colonia: "",
        municipio: "",
        estado: "",
        cp: "",
        // Domicilio Fiscal
        igualDomicilio: true,
        calleFiscal: "",
        numExtFiscal: "",
        numIntFiscal: "",
        coloniaFiscal: "",
        municipioFiscal: "",
        estadoFiscal: "",
        cpFiscal: "",
        rfc: "",
        // Aparatos
        nacionales: false,
        importados: false,
        homologados: false,
        otros: false,
    })
    React.useEffect(() => {
        fetchCatalogs()
    }, [fetchCatalogs])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev: any) => ({ ...prev, [name]: checked }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }))
    }

    // Sync fiscal address with social address if igualDomicilio is true
    React.useEffect(() => {
        if (formData.igualDomicilio) {
            setFormData((prev: any) => ({
                ...prev,
                calleFiscal: prev.calle,
                numExtFiscal: prev.numExt,
                numIntFiscal: prev.numInt,
                coloniaFiscal: prev.colonia,
                municipioFiscal: prev.municipio,
                estadoFiscal: prev.estado,
                cpFiscal: prev.cp,
            }))
        }
    }, [
        formData.igualDomicilio,
        formData.calle,
        formData.numExt,
        formData.numInt,
        formData.colonia,
        formData.municipio,
        formData.estado,
        formData.cp
    ])

    // Wrapped submit handler to pass state instead of event/formData
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const result = clubSchema.safeParse(formData)

        if (!result.success) {
            // Show first error message
            const firstError = result.error.issues[0]
            if (firstError) {
                toast.error(`Error: ${firstError.path.join(".")} - ${firstError.message}`)
            }
            console.error("Validation error details:", JSON.stringify(result.error.issues, null, 2))
            return
        }

        onSubmit(result.data)
    }

    return (
        <form id={id} className={cn("space-y-6", className)} onSubmit={handleFormSubmit}>
            <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6 p-1">
                    {/* General Info */}
                    <div className="grid gap-6">
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Nombre del club *" htmlFor="nombre" className="col-span-12 md:col-span-6">
                                <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="Asociación *" className="col-span-12 md:col-span-4">
                                <Input value="ESTADO DE MÉXICO" disabled className="bg-muted/50" name="asociacion" />
                            </InputGroup>
                            <InputGroup label="Alias" htmlFor="alias" className="col-span-12 md:col-span-2">
                                <Input id="alias" name="alias" value={formData.alias} onChange={handleInputChange} />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="E-mail *" htmlFor="email" className="col-span-12 md:col-span-6">
                                <Input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="Pagina web" htmlFor="web" className="col-span-12 md:col-span-6">
                                <Input id="web" name="web" value={formData.web} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="Fundación" htmlFor="fundacion" className="col-span-12 md:col-span-6">
                                <Input
                                    id="fundacion"
                                    name="fundacion"
                                    type="date"
                                    value={formData.fundacion}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>
                            <div className="col-span-12 md:col-span-6 space-y-3">
                                <Label>Sector</Label>
                                <RadioGroup value={formData.sector} onValueChange={(v) => setFormData({ ...formData, sector: v })} className="flex gap-4" name="sector">
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
                                <Input id="tel-principal" name="telPrincipal" value={formData.telPrincipal} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="Teléfono secundario" htmlFor="tel-secundario" className="col-span-12 md:col-span-3">
                                <Input id="tel-secundario" name="telSecundario" value={formData.telSecundario} onChange={handleInputChange} />
                            </InputGroup>
                            <div className="col-span-12 md:col-span-3 space-y-3">
                                <Label>Tipo de instalaciones</Label>
                                <RadioGroup value={formData.tipoInstalaciones} onValueChange={(v) => setFormData({ ...formData, tipoInstalaciones: v })} className="flex gap-4" name="tipoInstalaciones">
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
                    </div>

                    {/* Domicilio Social */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Domicilio Social :</h3>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Calle *" htmlFor="calle" className="col-span-12 md:col-span-6">
                                <Input id="calle" name="calle" value={formData.calle} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="# Exterior *" htmlFor="num-ext" className="col-span-6 md:col-span-2">
                                <Input id="num-ext" name="numExt" value={formData.numExt} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="# Interior" htmlFor="num-int" className="col-span-6 md:col-span-2">
                                <Input id="num-int" name="numInt" value={formData.numInt} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="Colonia *" htmlFor="colonia" className="col-span-12 md:col-span-2">
                                <Input id="colonia" name="colonia" value={formData.colonia} onChange={handleInputChange} />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="CD / Delegación / Municipio *" htmlFor="municipio" className="col-span-12 md:col-span-4">
                                <Input id="municipio" name="municipio" value={formData.municipio} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="Estado *" className="col-span-12 md:col-span-4">
                                <Select name="estado" value={formData.estado} onValueChange={(v) => handleSelectChange("estado", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Estados.map((estado) => (
                                            <SelectItem key={estado.id} value={estado.id.toString()}>
                                                {estado.Nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                            <InputGroup label="C.P. *" htmlFor="cp" className="col-span-12 md:col-span-2">
                                <Input id="cp" name="cp" value={formData.cp} onChange={handleInputChange} />
                            </InputGroup>
                        </div>
                    </div>

                    {/* Domicilio Fiscal */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Domicilio Fiscal :</h3>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="igual-domicilio" name="igualDomicilio" checked={formData.igualDomicilio} onCheckedChange={(c) => handleCheckboxChange("igualDomicilio", c as boolean)} />
                            <Label htmlFor="igual-domicilio">Igual a domicilio social</Label>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="Calle *" htmlFor="calle-fiscal" className="col-span-12 md:col-span-6">
                                <Input id="calle-fiscal" name="calleFiscal" value={formData.calleFiscal} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="# Exterior *" htmlFor="num-ext-fiscal" className="col-span-6 md:col-span-2">
                                <Input id="num-ext-fiscal" name="numExtFiscal" value={formData.numExtFiscal} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="# Interior" htmlFor="num-int-fiscal" className="col-span-6 md:col-span-2">
                                <Input id="num-int-fiscal" name="numIntFiscal" value={formData.numIntFiscal} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="Colonia *" htmlFor="colonia-fiscal" className="col-span-12 md:col-span-2">
                                <Input id="colonia-fiscal" name="coloniaFiscal" value={formData.coloniaFiscal} onChange={handleInputChange} />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <InputGroup label="CD / Delegación / Municipio *" htmlFor="municipio-fiscal" className="col-span-12 md:col-span-4">
                                <Input id="municipio-fiscal" name="municipioFiscal" value={formData.municipioFiscal} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="Estado *" className="col-span-12 md:col-span-4">
                                <Select name="estadoFiscal" value={formData.estadoFiscal} onValueChange={(v) => handleSelectChange("estadoFiscal", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Estados.map((estado) => (
                                            <SelectItem key={estado.id} value={estado.id.toString()}>
                                                {estado.Nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                            <InputGroup label="C.P. *" htmlFor="cp-fiscal" className="col-span-6 md:col-span-2">
                                <Input id="cp-fiscal" name="cpFiscal" value={formData.cpFiscal} onChange={handleInputChange} />
                            </InputGroup>
                            <InputGroup label="RFC *" htmlFor="rfc" className="col-span-6 md:col-span-2">
                                <Input id="rfc" name="rfc" value={formData.rfc} onChange={handleInputChange} />
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
                                    <Checkbox id="nacionales" name="nacionales" checked={formData.nacionales} onCheckedChange={(c) => handleCheckboxChange("nacionales", c as boolean)} />
                                    <Label htmlFor="nacionales">Si</Label>
                                </div>
                            </div>
                            <div className="col-span-6 md:col-span-3 space-y-3">
                                <Label>Importados:</Label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="importados" name="importados" checked={formData.importados} onCheckedChange={(c) => handleCheckboxChange("importados", c as boolean)} />
                                    <Label htmlFor="importados">Si</Label>
                                </div>
                            </div>
                            <div className="col-span-6 md:col-span-3 space-y-3">
                                <Label>Homologados FIG:</Label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="homologados" name="homologados" checked={formData.homologados} onCheckedChange={(c) => handleCheckboxChange("homologados", c as boolean)} />
                                    <Label htmlFor="homologados">Si</Label>
                                </div>
                            </div>
                            <div className="col-span-6 md:col-span-3 space-y-3">
                                <Label>Aparatos otros:</Label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="otros" name="otros" checked={formData.otros} onCheckedChange={(c) => handleCheckboxChange("otros", c as boolean)} />
                                    <Label htmlFor="otros">Si</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>        </form>
    )
}
