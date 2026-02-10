"use client"

import * as React from "react"
import { CalendarIcon, CreditCard, Save, Mail, Phone, MapPin, Calendar as CalendarDays, Fingerprint, User, ShieldCheck, Info, ExternalLink } from "lucide-react"
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
import { Afiliado } from "@/lib/afiliados-service"
import { updateClubMembership } from "@/lib/club-service"
import { useIsMobile } from "@/hooks/use-mobile"
import { afiliadoPaymentSchema } from "@/lib/schemas/afiliados/afiliado-payment-schema"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer"

interface AffiliateMembershipDialogProps {
    afiliado: Afiliado
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export function AffiliateMembershipDialog({ afiliado, open: controlledOpen, onOpenChange: controlledOnOpenChange, onSuccess, trigger }: AffiliateMembershipDialogProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const { Catalogo_formas_pago, fetchCatalogs } = useCatalogPayStore()

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? (controlledOnOpenChange || (() => { })) : setInternalOpen

    const [formValues, setFormValues] = React.useState({
        formaPago: afiliado.F_pago || "",
        noTicket: afiliado.Comprobante || "",
        lugarPago: afiliado.Lugar_p || "",
        total: afiliado.M_pago?.toString() || "",
        fechaPago: afiliado.fecha_p ? new Date(afiliado.fecha_p) : new Date(),
    })

    React.useEffect(() => {
        if (open) {
            fetchCatalogs()
            // Reset form values when opening with a new/different affiliate
            setFormValues({
                formaPago: afiliado.F_pago || "",
                noTicket: afiliado.Comprobante || "",
                lugarPago: afiliado.Lugar_p || "",
                total: afiliado.M_pago?.toString() || "",
                fechaPago: afiliado.fecha_p ? new Date(afiliado.fecha_p) : new Date(),
            })
        }
    }, [open, fetchCatalogs, afiliado])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate with Zod
        const result = afiliadoPaymentSchema.safeParse(formValues)
        if (!result.success) {
            toast.error(result.error.issues[0].message)
            return
        }

        const selectedForma = Catalogo_formas_pago.find(f => f.Nombre === formValues.formaPago)

        setIsSubmitting(true)
        try {
            const response = await updateClubMembership({
                tipo: "2", // 2 for Affiliate
                id: afiliado.id.toString(),
                total: formValues.total,
                id_forma_pago: selectedForma?.id.toString() || "0",
                no_ticket: formValues.noTicket,
                lugar_pago: formValues.lugarPago,
                fecha_pago: format(formValues.fechaPago, "yyyy-MM-dd"),
            })

            if (response) {
                toast.success("Pago de afiliación actualizado correctamente")
                setOpen(false)
                onSuccess?.()
            } else {
                toast.error("La respuesta del servidor no fue válida")
            }
        } catch (error) {
            console.error("Error updating affiliate membership:", error)
            toast.error("Error al actualizar el pago de afiliación")
        } finally {
            setIsSubmitting(false)
        }
    }

    const isMobile = useIsMobile()

    // Check if already paid
    const isAlreadyPaid = (afiliado.M_pago || 0) > 0 && !!afiliado.F_pago

    const formContent = (
        <MembershipForm
            Catalogo_formas_pago={Catalogo_formas_pago}
            formValues={formValues}
            setFormValues={setFormValues}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isAlreadyPaid={isAlreadyPaid}
        />
    )

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
                <DrawerContent className="h-[95vh]">
                    <DrawerHeader className="text-left border-b">
                        <DrawerTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Pago de Afiliación
                            </span>
                        </DrawerTitle>
                        <DrawerDescription>
                            Ingrese los datos del pago para el afiliado {afiliado.Nombre} {afiliado.Paterno}.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="flex flex-col gap-6">
                            <AfiliadoInfoPanel afiliado={afiliado} />
                            <Separator />
                            {formContent}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                    {/* Left Side: Form */}
                    <div className="flex-1 p-6 md:p-8 bg-background overflow-y-auto">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Pago de Afiliación
                                </span>
                            </DialogTitle>
                            <p className="text-muted-foreground mt-1">
                                {isAlreadyPaid
                                    ? "Este afiliado ya cuenta con un registro de pago. No es posible guardar cambios nuevamente."
                                    : "Ingrese los datos del comprobante de pago para este afiliado."}
                            </p>
                        </DialogHeader>

                        {formContent}
                    </div>

                    {/* Right Side: Affiliate Info */}
                    <AfiliadoInfoPanel afiliado={afiliado} className="w-full md:w-[400px] bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8 flex flex-col border-l border-slate-200 dark:border-slate-800" />
                </div>
            </DialogContent>
        </Dialog>
    )
}

const MembershipForm = React.memo(({ Catalogo_formas_pago, formValues, setFormValues, handleSubmit, isSubmitting, isAlreadyPaid }: any) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="formaPago" className="text-sm font-semibold opacity-80">Forma de pago</Label>
                <Select
                    value={formValues.formaPago}
                    onValueChange={(val) => setFormValues((prev: any) => ({ ...prev, formaPago: val }))}
                    disabled={isAlreadyPaid}
                >
                    <SelectTrigger id="formaPago" className="h-9 bg-muted/30 border-muted-foreground/20 focus:ring-blue-500/20">
                        <SelectValue placeholder="Seleccione una forma de pago" />
                    </SelectTrigger>
                    <SelectContent>
                        {Catalogo_formas_pago.map((item: any) => (
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
                        className="h-9 bg-muted/30 border-muted-foreground/20 focus-visible:ring-blue-500/20"
                        value={formValues.noTicket}
                        onChange={(e) => setFormValues((prev: any) => ({ ...prev, noTicket: e.target.value }))}
                        disabled={isAlreadyPaid}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lugarPago" className="text-sm font-semibold opacity-80">Lugar de pago</Label>
                    <Input
                        id="lugarPago"
                        placeholder="Sucursal / Banco"
                        className="h-9 bg-muted/30 border-muted-foreground/20 focus-visible:ring-blue-500/20"
                        value={formValues.lugarPago}
                        onChange={(e) => setFormValues((prev: any) => ({ ...prev, lugarPago: e.target.value }))}
                        disabled={isAlreadyPaid}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="total" className="text-sm font-semibold opacity-80">Monto total</Label>
                    <Input
                        id="total"
                        type="number"
                        step="0.01"
                        placeholder="Ej. 500.00"
                        className="h-9 bg-muted/30 border-muted-foreground/20 focus-visible:ring-blue-500/20"
                        value={formValues.total}
                        onChange={(e) => setFormValues((prev: any) => ({ ...prev, total: e.target.value }))}
                        disabled={isAlreadyPaid}
                    />
                </div>

                <div className="space-y-2 flex flex-col">
                    <Label className="text-sm font-semibold opacity-80 mb-1">Fecha de pago</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full h-9 justify-start text-left font-normal bg-muted/30 border-muted-foreground/20 focus:ring-blue-500/20",
                                    !formValues.fechaPago && "text-muted-foreground"
                                )}
                                disabled={isAlreadyPaid}
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
            </div>

            <DialogFooter className="pt-8 block sm:justify-between sm:flex">
                <Button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSubmitting || isAlreadyPaid}
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Procesando...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Guardar Pago
                        </div>
                    )}
                </Button>
            </DialogFooter>
        </form>
    )
});

const AfiliadoInfoPanel = React.memo(({ afiliado, className }: { afiliado: Afiliado, className?: string }) => {
    return (
        <div className={className}>
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-500/10 ring-4 ring-white dark:ring-slate-800">
                    <User className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold line-clamp-2 px-2">{afiliado.Nombre} {afiliado.Paterno} {afiliado.Materno}</h3>
                <div className="flex gap-2 mt-3">
                    <Badge variant={afiliado.Fecha_baja ? "destructive" : "default"} className={cn("px-3", !afiliado.Fecha_baja ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600")}>
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        {!afiliado.Fecha_baja ? "Alta" : "Baja"}
                    </Badge>
                    <Badge variant="outline" className={cn("px-3 border-blue-200 dark:border-blue-900/50", afiliado.F_pago ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : "bg-slate-50 text-slate-500")}>
                        <CreditCard className="mr-1 h-3 w-3" />
                        {afiliado.F_pago ? "Pagado" : "Pendiente"}
                    </Badge>
                </div>
            </div>

            <ScrollArea className="flex-1 pr-2">
                <div className="space-y-6">
                    <InfoSection title="Información Personal">
                        <InfoItem icon={<Fingerprint />} label="CURP" value={afiliado.Curp} />
                        <InfoItem icon={<CalendarDays />} label="Nacimiento" value={afiliado.Fecha_nacimiento ? format(new Date(afiliado.Fecha_nacimiento), "dd-MMMM-yyyy", { locale: es }) : "N/A"} />
                        <InfoItem icon={<User />} label="Género" value={afiliado.Genero} />
                    </InfoSection>

                    <Separator className="opacity-50" />

                    <InfoSection title="Contacto">
                        <InfoItem icon={<MapPin />} label="Dirección" value={`${afiliado.Calle} ${afiliado.Exterior}, ${afiliado.Colonia}`} />
                        <InfoItem icon={<MapPin />} label="Ciudad" value={`${afiliado.Ciudad}, ${afiliado.Estado}`} />
                        <InfoItem icon={<Phone />} label="Tel. Particular" value={afiliado.Telefono_c} />
                        <InfoItem icon={<Phone />} label="Celular" value={afiliado.Telefono_cel} />
                    </InfoSection>

                    <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3 mt-4">
                        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800/80 dark:text-blue-400/80 leading-relaxed font-medium">
                            Llene los datos del comprobante de pago para registrar la afiliación.
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
});

const InfoSection = React.memo(({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 pl-1">{title}</h4>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    )
});

const InfoItem = React.memo(({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => {
    return (
        <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
            <div className="p-1.5 rounded-md bg-white dark:bg-slate-800 text-slate-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-900 transition-all">
                {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-3.5 w-3.5" }) : icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground/70 font-medium leading-none mb-1">{label}</p>
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <p className="text-sm font-semibold truncate text-slate-700 dark:text-slate-300">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    )
});

MembershipForm.displayName = "MembershipForm";
AfiliadoInfoPanel.displayName = "AfiliadoInfoPanel";
InfoSection.displayName = "InfoSection";
InfoItem.displayName = "InfoItem";
