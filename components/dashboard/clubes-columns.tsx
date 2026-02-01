"use client"



import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewClubGral } from "@/lib/club-service"
import { EditClubDialog } from "./edit-club-dialog"
import { MembershipDialog } from "./membership-dialog"
import { AuthData } from "@/lib/store/auth-store"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { CreditCard } from "lucide-react"

export const getColumns = (authData: AuthData | null): ColumnDef<ViewClubGral>[] => [
    {
        id: "acciones",
        header: "Detalle",
        cell: ({ row }) => {
            // eslint-disable-next-line eqeqeq
            const canEdit = authData?.tipo_registro == 1
            const club = row.original

            return (
                <div className="flex items-center gap-1">
                    {!canEdit ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 cursor-not-allowed" disabled>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                        </Button>
                    ) : (
                        <EditClubDialog club={club}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-200 dark:hover:bg-green-800">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                            </Button>
                        </EditClubDialog>
                    )}
                    {(authData?.tipo_registro === 1 || authData?.tipo_registro === 3) && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <MembershipDialog club={club}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-blue-200 dark:hover:bg-blue-800"
                                        >
                                            <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="sr-only">Membresía</span>
                                        </Button>
                                    </MembershipDialog>
                                </TooltipTrigger>
                                <TooltipContent>Membresía</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "Club",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Club
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
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
        cell: ({ row }) => {
            const isActive = row.getValue("membresia")
            return (
                <Badge variant="outline" className={cn("px-3 border-teal-200 dark:border-teal-900/50", isActive ? "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400" : "bg-slate-50 text-slate-500")}>
                    <CreditCard className="mr-1 h-3 w-3" />
                    {isActive ? "Membresía Activa" : "Sin Membresía"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "Estatus",
        header: "Estatus",
        cell: ({ row }) => (row.getValue("Estatus") ? "Alta" : "Baja"),
    },
    {
        accessorKey: "Web",
        header: "Web",
    },
    {
        accessorKey: "rfc",
        header: "RFC",
    },
    {
        accessorKey: "Tipo_aparatos_nac",
        header: "Aparatos Nac.",
        cell: ({ row }) => (row.original.Tipo_aparatos_nac ? "Sí" : "No"),
    },
    {
        accessorKey: "Tipo_aparatos_imp",
        header: "Aparatos Imp.",
        cell: ({ row }) => (row.original.Tipo_aparatos_imp ? "Sí" : "No"),
    },
    {
        accessorKey: "Tipos_aparatos_fig",
        header: "Aparatos FIG",
        cell: ({ row }) => (row.original.Tipos_aparatos_fig ? "Sí" : "No"),
    },
    {
        accessorKey: "Tipos_aparatos_otros",
        header: "Otros Aparatos",
        cell: ({ row }) => (row.original.Tipos_aparatos_otros ? "Sí" : "No"),
    },
    {
        accessorKey: "Fundacion",
        header: "Fundación",
        cell: ({ row }) => {
            const dateStr = row.original.Fundacion
            if (!dateStr) return "-"
            try {
                return new Date(dateStr).toLocaleDateString("es-MX")
            } catch {
                return dateStr
            }
        },
    },
    {
        accessorKey: "Sector",
        header: "Sector",
        cell: ({ row }) => (row.original.Sector ? "Privado" : "Público"),
    },
    {
        accessorKey: "Tipo_instalaciones",
        header: "Instalaciones",
        cell: ({ row }) => (row.original.Tipo_instalaciones ? "Rentadas" : "Propias"),
    },
    {
        accessorKey: "Telefono1",
        header: "Teléfono 1",
    },
    {
        accessorKey: "Telefono2",
        header: "Teléfono 2",
    },
    {
        accessorKey: "M_pago",
        header: "Monto Pago",
        cell: ({ row }) => {
            const monto = row.original.M_pago
            return monto ? `$${monto.toFixed(2)}` : "$0.00"
        },
    },
    {
        accessorKey: "F_pago",
        header: "F. Pago",
    },
    {
        accessorKey: "Lugar_p",
        header: "Lugar Pago",
    },
    {
        accessorKey: "fecha_p",
        header: "Fecha Pago",
        cell: ({ row }) => {
            const dateStr = row.original.fecha_p
            if (!dateStr) return "-"
            try {
                return new Date(dateStr).toLocaleDateString("es-MX")
            } catch {
                return dateStr
            }
        },
    },
]
