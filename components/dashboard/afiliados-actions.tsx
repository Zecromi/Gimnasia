"use client"

import { Edit, CreditCard, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Afiliado } from "@/lib/afiliados-service"
import { AuthData } from "@/lib/store/auth-store"

interface AffiliateActionsProps {
    afiliado: Afiliado
    onEdit: (afiliado: Afiliado) => void
    onPayment: (afiliado: Afiliado) => void
    onUnsubscribe?: (afiliado: Afiliado) => void
    authData: AuthData | null
}

export function AffiliateActions({
    afiliado,
    onEdit,
    onPayment,
    onUnsubscribe,
    authData
}: AffiliateActionsProps) {
    return (
        <div className="flex items-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        className="hover:bg-green-200 dark:hover:bg-green-800 text-green-600"
                        onClick={() => onEdit(afiliado)}
                    >
                        <Edit className="h-3.5 w-3.5" />
                        <span className="sr-only">Editar</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Editar Afiliado</p>
                </TooltipContent>
            </Tooltip>

            {(authData?.tipo_registro === 1 || authData?.tipo_registro === 3) && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            className="hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600"
                            onClick={() => onPayment(afiliado)}
                        >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span className="sr-only">Pago</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Pago de Afiliación</p>
                    </TooltipContent>
                </Tooltip>
            )}

            {/* <AlertDialog>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                className="hover:bg-rose-200 dark:hover:bg-rose-800 text-rose-600"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Quitar suscripción</span>
                            </Button>
                        </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Quitar suscripción al evento</p>
                    </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro de quitar la suscripción?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción quitará la suscripción del afiliado "{afiliado.Nombre} {afiliado.Paterno}" al evento actual.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onUnsubscribe?.(afiliado)}
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> */}
        </div>
    )
}
