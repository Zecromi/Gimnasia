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
        header: "ID Club",
    },
    {
        accessorKey: "Fecha_nacimiento",
        header: "Fecha Nacimiento",
        cell: ({ row }) => {
            const date = row.getValue("Fecha_nacimiento") as string
            return date ? new Date(date).toLocaleDateString() : ""
        }
    },
    {
        accessorKey: "Curp",
        header: "CURP",
    },
    {
        accessorKey: "Genero",
        header: "Género",
    },
    {
        accessorKey: "id_Escolaridad",
        header: "Escolaridad (ID)",
    },
    {
        accessorKey: "Fecha_afiliacion",
        header: "Fecha Afiliación",
        cell: ({ row }) => {
            const date = row.getValue("Fecha_afiliacion") as string
            return date ? new Date(date).toLocaleDateString() : ""
        }
    },
    {
        accessorKey: "Fecha_baja",
        header: "Fecha Baja",
        cell: ({ row }) => {
            const date = row.getValue("Fecha_baja") as string
            return date ? new Date(date).toLocaleDateString() : "-"
        }
    },
    {
        accessorKey: "Calle",
        header: "Calle",
    },
    {
        accessorKey: "Exterior",
        header: "Ext",
    },
    {
        accessorKey: "Interior",
        header: "Int",
    },
    {
        accessorKey: "Colonia",
        header: "Colonia",
    },
    {
        accessorKey: "CP",
        header: "C.P.",
    },
    {
        accessorKey: "Ciudad",
        header: "Ciudad",
    },
    {
        accessorKey: "Estado",
        header: "Estado",
    },
    {
        accessorKey: "Telefono_c",
        header: "Tel. Casa",
    },
    {
        accessorKey: "Telefono_cel",
        header: "Celular",
    },
    {
        accessorKey: "Afiliacion_1",
        header: "Afiliación 1",
    },
    {
        accessorKey: "Afiliacion_2",
        header: "Afiliación 2",
    },
    {
        accessorKey: "id_nivel_tec",
        header: "Nivel Tec (ID)",
    },
    {
        accessorKey: "Modalidad",
        header: "Modalidad",
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
            return row.original.Fecha_baja ? "Baja" : "Alta"
        }
    },
]
