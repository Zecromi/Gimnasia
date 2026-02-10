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
import { Afiliado } from "@/lib/afiliados-service"
import { useIsMobile } from "@/hooks/use-mobile"
import { updateClubMembership } from "@/lib/club-service"
import { format } from "date-fns"

interface BulkMembershipDialogProps {
    selectedAfiliados: Afiliado[]
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function BulkMembershipDialog({
    selectedAfiliados,
    open,
    onOpenChange,
    onSuccess
}: BulkMembershipDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [currentProgress, setCurrentProgress] = React.useState(0)
    const [costo, setCosto] = React.useState("")
    const isMobile = useIsMobile()

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
            const today = format(new Date(), "yyyy-MM-dd")

            for (let i = 0; i < selectedAfiliados.length; i++) {
                const afiliado = selectedAfiliados[i]
                setCurrentProgress(i + 1)
                try {
                    await updateClubMembership({
                        tipo: "2", // 2 para Afiliado
                        id: afiliado.id.toString(),
                        total: costo,
                        id_forma_pago: "1", // 1 para Efectivo
                        no_ticket: "NA",
                        lugar_pago: "NA",
                        fecha_pago: today,
                    })
                    successCount++
                } catch (err) {
                    console.error(`Error al procesar el pago para el afiliado ${afiliado.id}:`, err)
                    errorCount++
                }
            }

            if (successCount > 0) {
                toast.success(`Pago masivo procesado para ${successCount} afiliados.${errorCount > 0 ? ` (${errorCount} errores)` : ""}`)
                onOpenChange(false)
                onSuccess?.()
            } else if (errorCount > 0) {
                toast.error(`Error al procesar los pagos masivos para ${errorCount} afiliados`)
            }
        } catch (error) {
            console.error("Error in bulk payment process:", error)
            toast.error("Error crítico al procesar el pago masivo")
        } finally {
            setIsSubmitting(false)
            setCurrentProgress(0)
        }
    }

    const title = "Pago de Afiliación Masivo"
    const description = `Realizar el pago para ${selectedAfiliados.length} afiliados seleccionados.`

    const content = (
        <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Afiliados seleccionados: <span className="text-lg font-bold">{selectedAfiliados.length}</span>
                </p>
                {isSubmitting && (
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2 font-semibold">
                        Guardando información {currentProgress} de {selectedAfiliados.length}...
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="bulk-cost" className="text-sm font-semibold">Costo por Afiliación</Label>
                <Input
                    id="bulk-cost"
                    type="number"
                    step="0.01"
                    placeholder="Ej. 500.00"
                    value={costo}
                    onChange={(e) => setCosto(e.target.value)}
                    disabled={isSubmitting}
                />
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
                    <div className="px-4">
                        {content}
                    </div>
                    <DrawerFooter>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? `Procesando (${currentProgress}/${selectedAfiliados.length})...` : "Confirmar Pago Masivo"}
                        </Button>
                        <DrawerClose asChild disabled={isSubmitting}>
                            <Button variant="outline">Cancelar</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
            <DialogContent
                className="sm:max-w-[425px]"
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
                        {isSubmitting ? `Guardando ${currentProgress}/${selectedAfiliados.length}...` : "Realizar Pago"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
