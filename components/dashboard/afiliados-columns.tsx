"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Afiliado } from "@/lib/afiliados-service"

export const columns: ColumnDef<Afiliado>[] = [
    {
        id: "detalle",
        header: "Detalle",
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <div className="flex items-center">
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
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    No. afiliado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "nombreCompleto",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Afiliado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const affiliate = row.original
            return `${affiliate.Nombre} ${affiliate.Paterno} ${affiliate.Materno}`.trim()
        }
    },
    {
        accessorKey: "id_Club",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Club (ID)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "Curp",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    CURP
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "Modalidad",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Modalidad
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "Afiliacion_p", // Mapping to Tipo Afiliado
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tipo afiliado (ID)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "estatus",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Estatus
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            // Logic: if Fecha_baja is null/empty -> Alta, else Baja
            return row.original.Fecha_baja ? "Baja" : "Alta"
        }
    },
]
