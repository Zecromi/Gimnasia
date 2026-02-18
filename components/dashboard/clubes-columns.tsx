"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewClubGral } from "@/lib/club-service"
import { AuthData } from "@/lib/store/auth-store"
import dynamic from "next/dynamic"

const EditClubDialog = dynamic(() => import("./edit-club-dialog").then(mod => mod.EditClubDialog), {
    ssr: false,
    loading: () => <div className="h-8 w-8 animate-pulse bg-muted rounded-md" />
})

const MembershipDialog = dynamic(() => import("./membership-dialog").then(mod => mod.MembershipDialog), {
    ssr: false,
    loading: () => <div className="h-8 w-8 animate-pulse bg-muted rounded-md" />
})
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

export const getColumns = (authData: AuthData | null): ColumnDef<ViewClubGral>[] => {
    const columns: ColumnDef<ViewClubGral>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="px-4">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => {
                const isActive = !!row.original.membresia
                return (
                    <div className="px-4">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            disabled={isActive}
                            aria-label="Select row"
                            className={isActive ? "opacity-50 cursor-not-allowed" : ""}
                        />
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
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
                            <Button variant="ghost" size="icon-xs" className="text-gray-400 cursor-not-allowed" disabled>
                                <Edit className="h-3.5 w-3.5" />
                                <span className="sr-only">Editar</span>
                            </Button>
                        ) : (
                            <EditClubDialog club={club}>
                                <Button variant="ghost" size="icon-xs" className="hover:bg-green-200 dark:hover:bg-green-800">
                                    <Edit className="h-3.5 w-3.5" />
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
                                                size="icon-xs"
                                                className="hover:bg-blue-200 dark:hover:bg-blue-800"
                                            >
                                                <CreditCard className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                                <span className="sr-only">Membresía</span>
                                            </Button>
                                        </MembershipDialog>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Membresía</TooltipContent>
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
                <Button variant="ghost" size="xs" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    ID
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
            ),
        },
        {
            accessorKey: "Club",
            header: ({ column }) => (
                <Button variant="ghost" size="xs" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Club
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
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

    // Only Admin (tipo_registro === 1) should see the selection checkboxes
    // eslint-disable-next-line eqeqeq
    if (authData?.tipo_registro != 1) {
        return columns.filter(col => col.id !== "select")
    }

    return columns
}
