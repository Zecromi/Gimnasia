"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export type Afiliado = {
    id: string
    noAfiliado: string
    afiliado: string
    asociacion: string
    club: string
    curp: string
    modalidades: string
    segundaValidacionCurp: string
    pagoAfiliacion: string
    pagoSeguro: string
    tipoAfiliado: string
    estatus: "Alta" | "Baja"
}

export const columns: ColumnDef<Afiliado>[] = [
    {
        id: "detalle",
        header: "Detalle",
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-200 dark:hover:bg-green-800">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>Editar</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )
        },
    },
    {
        accessorKey: "noAfiliado",
        header: "No. afiliado",
    },
    {
        accessorKey: "afiliado",
        header: "Afiliado",
    },
    {
        accessorKey: "asociacion",
        header: "Asociación",
    },
    {
        accessorKey: "club",
        header: "Club",
    },
    {
        accessorKey: "curp",
        header: "CURP",
    },
    {
        accessorKey: "modalidades",
        header: "Modalidades",
    },
    {
        accessorKey: "segundaValidacionCurp",
        header: "Segunda validación CURP",
    },
    {
        accessorKey: "pagoAfiliacion",
        header: "Pago de afiliación",
    },
    {
        accessorKey: "pagoSeguro",
        header: "Pago de seguro",
    },
    {
        accessorKey: "tipoAfiliado",
        header: "Tipo afiliado",
    },
    {
        accessorKey: "estatus",
        header: "Estatus",
    },
]
