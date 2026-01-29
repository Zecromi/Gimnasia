"use client"

import * as React from "react"
import { CalendarIcon, CreditCard, Save, Mail, Globe, Phone, MapPin, Calendar as CalendarDays, Fingerprint, Building, ShieldCheck, ExternalLink, Info } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCatalogPayStore } from "@/lib/store/catalog-pay-store"
import { useClubStore } from "@/lib/store/club-store"
import { ViewClubGral, updateClubMembership, getClubs } from "@/lib/club-service"
import { useIsMobile } from "@/hooks/use-mobile"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

interface MembershipDialogProps {
    club: ViewClubGral
    children: React.ReactNode
}

export function MembershipDialog({ club, children }: MembershipDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const { Catalogo_formas_pago, fetchCatalogs } = useCatalogPayStore()
    const { setClubs } = useClubStore()

    const [formValues, setFormValues] = React.useState({
        formaPago: club.F_pago || "",
        noTicket: club.Comprobante || "",
        lugarPago: club.Lugar_p || "",
        fechaPago: club.fecha_p ? new Date(club.fecha_p) : new Date(),
    })

    React.useEffect(() => {
        if (open) {
            fetchCatalogs()
        }
    }, [open, fetchCatalogs])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formValues.formaPago) {
            toast.error("Seleccione una forma de pago")
            return
        }
        if (!formValues.noTicket) {
            toast.error("Ingrese el número de ticket")
            return
        }
        if (!formValues.lugarPago) {
            toast.error("Ingrese el lugar de pago")
            return
        }

        const selectedForma = Catalogo_formas_pago.find(f => f.Nombre === formValues.formaPago)

        setIsSubmitting(true)
        try {
            const response = await updateClubMembership({
                tipo: "1",
                id: club.id.toString(),
                total: (club.M_pago || 0).toString(),
                id_forma_pago: selectedForma?.id.toString() || "0",
                no_ticket: formValues.noTicket,
                lugar_pago: formValues.lugarPago,
                fecha_pago: format(formValues.fechaPago, "yyyy-MM-dd"),
            })

            if (response) {
                toast.success("Membresía actualizada correctamente")
                setOpen(false)

                try {
                    const clubsRes = await getClubs()
                    if (clubsRes && clubsRes.View_Club_gral) {
                        setClubs(clubsRes.View_Club_gral)
                    }
                } catch (refreshError) {
                    console.error("Error refreshing clubs store:", refreshError)
                }
            } else {
                toast.error("La respuesta del servidor no fue válida")
            }
        } catch (error) {
            console.error("Error updating membership:", error)
            toast.error("Error al actualizar la membresía")
        } finally {
            setIsSubmitting(false)
        }
    }

    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="h-[95vh]">
                    <DrawerHeader className="text-left border-b">
                        <DrawerTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                Membresía
                            </span>
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="flex flex-col gap-6">
                            <ClubInfoPanel club={club} />
                            <Separator />
                            <MembershipForm
                                club={club}
                                Catalogo_formas_pago={Catalogo_formas_pago}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                handleSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                            />
                        </div>
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
            <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                    {/* Left Side: Form */}
                    <div className="flex-1 p-6 md:p-8 bg-background overflow-y-auto">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                    Gestión de Membresía
                                </span>
                            </DialogTitle>
                            <p className="text-muted-foreground mt-1">
                                Ingrese los datos del comprobante de pago para habilitar la membresía del club.
                            </p>
                        </DialogHeader>

                        <MembershipForm
                            club={club}
                            Catalogo_formas_pago={Catalogo_formas_pago}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            handleSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </div>

                    {/* Right Side: Club Info */}
                    <ClubInfoPanel club={club} className="w-full md:w-[400px] bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8 flex flex-col border-l border-slate-200 dark:border-slate-800" />
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface MembershipFormProps {
    club: ViewClubGral
    Catalogo_formas_pago: any[]
    formValues: any
    setFormValues: React.Dispatch<React.SetStateAction<any>>
    handleSubmit: (e: React.FormEvent) => void
    isSubmitting: boolean
}

function MembershipForm({ club, Catalogo_formas_pago, formValues, setFormValues, handleSubmit, isSubmitting }: MembershipFormProps) {
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="formaPago" className="text-sm font-semibold opacity-80">Forma de pago</Label>
                <Select
                    value={formValues.formaPago}
                    onValueChange={(val) => setFormValues((prev: any) => ({ ...prev, formaPago: val }))}
                >
                    <SelectTrigger id="formaPago" className="h-9 bg-muted/30 border-muted-foreground/20 focus:ring-teal-500/20">
                        <SelectValue placeholder="Seleccione una forma de pago" />
                    </SelectTrigger>
                    <SelectContent>
                        {Catalogo_formas_pago.map((item) => (
                            <SelectItem key={item.id} value={item.Nombre}>
                                {item.Nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="noTicket" className="text-sm font-semibold opacity-80">No. de ticket</Label>
                    <Input
                        id="noTicket"
                        placeholder="Ej. 12345"
                        className="h-9 bg-muted/30 border-muted-foreground/20 focus-visible:ring-teal-500/20"
                        value={formValues.noTicket}
                        onChange={(e) => setFormValues((prev: any) => ({ ...prev, noTicket: e.target.value }))}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lugarPago" className="text-sm font-semibold opacity-80">Lugar de pago</Label>
                    <Input
                        id="lugarPago"
                        placeholder="Sucursal / Banco"
                        className="h-9 bg-muted/30 border-muted-foreground/20 focus-visible:ring-teal-500/20"
                        value={formValues.lugarPago}
                        onChange={(e) => setFormValues((prev: any) => ({ ...prev, lugarPago: e.target.value }))}
                    />
                </div>
            </div>

            <div className="space-y-2 flex flex-col">
                <Label className="text-sm font-semibold opacity-80 mb-1">Fecha de pago</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full h-9 justify-start text-left font-normal bg-muted/30 border-muted-foreground/20 focus:ring-teal-500/20",
                                !formValues.fechaPago && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                            {formValues.fechaPago ? (
                                format(formValues.fechaPago, "PPP", { locale: es })
                            ) : (
                                <span>Seleccione una fecha</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none shadow-xl" align="start">
                        <Calendar
                            mode="single"
                            selected={formValues.fechaPago}
                            onSelect={(date) => date && setFormValues((prev: any) => ({ ...prev, fechaPago: date }))}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            locale={es}
                            className="rounded-md border-none"
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <DialogFooter className="pt-8 block sm:justify-between sm:flex">
                <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Procesando...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Guardar Membresía
                        </div>
                    )}
                </Button>
            </DialogFooter>
        </form>
    )
}

function ClubInfoPanel({ club, className }: { club: ViewClubGral, className?: string }) {
    return (
        <div className={className}>
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white mb-4 shadow-xl shadow-teal-500/10 ring-4 ring-white dark:ring-slate-800">
                    <Building className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold line-clamp-2 px-2">{club.Club}</h3>
                <div className="flex gap-2 mt-3">
                    <Badge variant={club.Estatus ? "default" : "destructive"} className={cn("px-3", club.Estatus ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600")}>
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        {club.Estatus ? "Alta" : "Baja"}
                    </Badge>
                    <Badge variant="outline" className={cn("px-3 border-teal-200 dark:border-teal-900/50", club.membresia ? "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400" : "bg-slate-50 text-slate-500")}>
                        <CreditCard className="mr-1 h-3 w-3" />
                        {club.membresia ? "Membresía Activa" : "Sin Membresía"}
                    </Badge>
                </div>
            </div>

            <ScrollArea className="flex-1 pr-2">
                <div className="space-y-6">
                    <InfoSection title="Información de Contacto">
                        <InfoItem icon={<Mail />} label="Email" value={club.Email} isEmail />
                        {club.Web && <InfoItem icon={<Globe />} label="Web" value={club.Web} isWeb />}
                        <InfoItem icon={<Phone />} label="Teléfono 1" value={club.Telefono1} />
                        {club.Telefono2 && <InfoItem icon={<Phone />} label="Teléfono 2" value={club.Telefono2} />}
                    </InfoSection>

                    <Separator className="opacity-50" />

                    <InfoSection title="Detalles Institucionales">
                        <InfoItem icon={<MapPin />} label="Asociación" value={club.Asociacion} />
                        <InfoItem icon={<Fingerprint />} label="RFC" value={club.rfc || "N/A"} />
                        <InfoItem icon={<CalendarDays />} label="Fundación" value={club.Fundacion ? format(new Date(club.Fundacion), "dd-MMMM-yyyy", { locale: es }) : "N/A"} />
                        {club.Alias && <InfoItem icon={<Building />} label="Alias" value={club.Alias} />}
                    </InfoSection>

                    <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 flex gap-3 mt-4">
                        <Info className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-teal-800/80 dark:text-teal-400/80 leading-relaxed font-medium">
                            Llene los datos del comprobante de pago para habilitar la membresía del club.
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

function InfoSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 pl-1">{title}</h4>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    )
}

function InfoItem({ icon, label, value, isEmail, isWeb }: { icon: React.ReactNode, label: string, value: string, isEmail?: boolean, isWeb?: boolean }) {
    return (
        <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
            <div className="p-1.5 rounded-md bg-white dark:bg-slate-800 text-slate-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:border-teal-200 dark:group-hover:border-teal-900 transition-all">
                {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-3.5 w-3.5" }) : icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground/70 font-medium leading-none mb-1">{label}</p>
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <p className="text-sm font-semibold truncate text-slate-700 dark:text-slate-300">
                        {value}
                    </p>
                    {(isEmail || isWeb) && (
                        <ExternalLink className="h-3 w-3 text-muted-foreground/40 group-hover:text-teal-500/50 transition-colors shrink-0" />
                    )}
                </div>
            </div>
        </div>
    )
}
