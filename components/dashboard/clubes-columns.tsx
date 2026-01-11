"use client"



import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewClubGral } from "@/lib/club-service"
import { EditClubDialog } from "./edit-club-dialog"
import { AuthData } from "@/lib/store/auth-store"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export const getColumns = (authData: AuthData | null): ColumnDef<ViewClubGral>[] => [
    {
        id: "detalle",
        header: "Detalle",
        cell: ({ row }) => {
            // eslint-disable-next-line eqeqeq
            const canEdit = authData?.id == 1 && authData?.tipo_registro == 1

            if (!canEdit) {
                return (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 cursor-not-allowed" disabled>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                )
            }

            return (
                <div className="flex items-center">
                    <EditClubDialog club={row.original}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-200 dark:hover:bg-green-800">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                        </Button>
                    </EditClubDialog>
                </div>
            )
        },
    },
    {
        accessorKey: "Club",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Club
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "Alias",
        header: "Alias",
    },
    {
        accessorKey: "Email",
        header: "Email",
    },
    {
        accessorKey: "Asociacion",
        header: "Asociación",
    },
    {
        accessorKey: "membresia",
        header: "Membresía",
        cell: ({ row }) => (row.getValue("membresia") ? "Sí" : "No"),
    },
    {
        accessorKey: "Estatus",
        header: "Estatus",
        cell: ({ row }) => (row.getValue("Estatus") ? "Alta" : "Baja"),
    },
]
