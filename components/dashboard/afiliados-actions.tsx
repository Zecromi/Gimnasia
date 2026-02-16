"use client"

import { Edit, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Afiliado } from "@/lib/afiliados-service"
import { AuthData } from "@/lib/store/auth-store"

interface AffiliateActionsProps {
    afiliado: Afiliado
    onEdit: (afiliado: Afiliado) => void
    onPayment: (afiliado: Afiliado) => void
    authData: AuthData | null
}

export function AffiliateActions({
    afiliado,
    onEdit,
    onPayment,
    authData
}: AffiliateActionsProps) {
    return (
        <div className="flex items-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-green-200 dark:hover:bg-green-800 text-green-600"
                        onClick={() => onEdit(afiliado)}
                    >
                        <Edit className="h-4 w-4" />
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
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600"
                            onClick={() => onPayment(afiliado)}
                        >
                            <CreditCard className="h-4 w-4" />
                            <span className="sr-only">Pago</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Pago de Afiliación</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    )
}
