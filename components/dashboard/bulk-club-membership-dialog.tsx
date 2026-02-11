"use client"

import * as React from "react"
import { CreditCard, Save } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
    DrawerDescription,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ViewClubGral, updateClubMembership } from "@/lib/club-service"
import { useIsMobile } from "@/hooks/use-mobile"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useCatalogPayStore } from "@/lib/store/catalog-pay-store"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BulkClubMembershipDialogProps {
    selectedClubs: ViewClubGral[]
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function BulkClubMembershipDialog({
    selectedClubs,
    open,
    onOpenChange,
    onSuccess
}: BulkClubMembershipDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [currentProgress, setCurrentProgress] = React.useState(0)
    const [costo, setCosto] = React.useState("")
    const [formaPago, setFormaPago] = React.useState("")
    const [lugarPago, setLugarPago] = React.useState("")
    const [fechaPago, setFechaPago] = React.useState<Date | undefined>(new Date())
    const isMobile = useIsMobile()
    const { Catalogo_formas_pago, fetchCatalogs } = useCatalogPayStore()

    React.useEffect(() => {
        if (open) {
            fetchCatalogs()
        }
    }, [open, fetchCatalogs])

    const handleConfirm = async () => {
        if (!costo || isNaN(Number(costo))) {
            toast.error("Por favor ingresa un costo válido.")
            return
        }

        setIsSubmitting(true)
        setCurrentProgress(0)
        let successCount = 0
        let errorCount = 0

        try {
            const selectedForma = Catalogo_formas_pago.find(f => f.Nombre === formaPago)
            const formattedDate = fechaPago ? format(fechaPago, "yyyy-MM-dd") : ""

            for (let i = 0; i < selectedClubs.length; i++) {
                const club = selectedClubs[i]
                setCurrentProgress(i + 1)
                try {
                    await updateClubMembership({
                        tipo: "1", // 1 para Club
                        id: club.id.toString(),
                        total: costo,
                        id_forma_pago: selectedForma?.id.toString() || "5",
                        no_ticket: "",
                        lugar_pago: lugarPago || "",
                        fecha_pago: formattedDate,
                    })
                    successCount++
                } catch (err) {
                    console.error(`Error al procesar el pago para el club ${club.id}:`, err)
                    errorCount++
                }
            }

            if (successCount > 0) {
                toast.success(`Pago masivo procesado para ${successCount} clubes.${errorCount > 0 ? ` (${errorCount} errores)` : ""}`)
                onOpenChange(false)
                onSuccess?.()
            } else if (errorCount > 0) {
                toast.error(`Error al procesar los pagos masivos para ${errorCount} clubes`)
            }
        } catch (error) {
            console.error("Error in bulk payment process:", error)
            toast.error("Error crítico al procesar el pago masivo")
        } finally {
            setIsSubmitting(false)
            setCurrentProgress(0)
        }
    }

    const title = "Pago de Membresía Masivo"
    const description = `Realizar el pago para ${selectedClubs.length} clubes seleccionados.`

    const content = (
        <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Clubes seleccionados: <span className="text-lg font-bold">{selectedClubs.length}</span>
                </p>
                {isSubmitting && (
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2 font-semibold">
                        Guardando información {currentProgress} de {selectedClubs.length}...
                    </p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="bulk-cost-club" className="text-sm font-semibold">Costo por Membresía *</Label>
                    <Input
                        id="bulk-cost-club"
                        type="number"
                        step="0.01"
                        placeholder="Ej. 1500.00"
                        value={costo}
                        onChange={(e) => setCosto(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bulk-forma-pago-club" className="text-sm font-semibold">Forma de pago</Label>
                    <Select
                        value={formaPago}
                        onValueChange={setFormaPago}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="bulk-forma-pago-club">
                            <SelectValue placeholder="Seleccione..." />
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

                <div className="space-y-2">
                    <Label htmlFor="bulk-lugar-pago-club" className="text-sm font-semibold">Lugar de pago</Label>
                    <Input
                        id="bulk-lugar-pago-club"
                        placeholder="Ej. Oficina"
                        value={lugarPago}
                        onChange={(e) => setLugarPago(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="space-y-2 flex flex-col">
                    <Label className="text-sm font-semibold mb-1">Fecha de pago</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full h-10 justify-start text-left font-normal",
                                    !fechaPago && "text-muted-foreground"
                                )}
                                disabled={isSubmitting}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                {fechaPago ? (
                                    format(fechaPago, "PPP", { locale: es })
                                ) : (
                                    <span>Seleccione una fecha</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={fechaPago}
                                onSelect={setFechaPago}
                                initialFocus
                                locale={es}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={isSubmitting ? undefined : onOpenChange} dismissible={!isSubmitting}>
                <DrawerContent onPointerDownOutside={isSubmitting ? (e) => e.preventDefault() : undefined}>
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 overflow-y-auto max-h-[60vh]">
                        {content}
                    </div>
                    <DrawerFooter className="pt-2">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? `Procesando (${currentProgress}/${selectedClubs.length})...` : "Confirmar Pago Masivo"}
                        </Button>
                        <DrawerClose asChild disabled={isSubmitting}>
                            <Button variant="outline" className="w-full">Cancelar</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
            <DialogContent
                className="sm:max-w-[500px]"
                onPointerDownOutside={isSubmitting ? (e) => e.preventDefault() : undefined}
                onEscapeKeyDown={isSubmitting ? (e) => e.preventDefault() : undefined}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {content}
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? `Guardando ${currentProgress}/${selectedClubs.length}...` : "Realizar Pago"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
