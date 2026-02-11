"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Afiliado } from "@/lib/afiliados-service"
import { ViewClubGral, CatalogoItem, Estado } from "@/lib/club-service"
import { AuthData } from "@/lib/store/auth-store"
import { Checkbox } from "@/components/ui/checkbox"
import dynamic from "next/dynamic"

const AffiliateActions = dynamic(() => import("./afiliados-actions").then(mod => mod.AffiliateActions), {
    ssr: false,
    loading: () => <div className="w-16 h-8 animate-pulse bg-muted rounded-md" />
})

export const getColumns = (
    onSuccess: () => void,
    onEdit: (afiliado: Afiliado) => void,
    onPayment: (afiliado: Afiliado) => void,
    clubs: ViewClubGral[] = [],
    escolaridadList: CatalogoItem[] = [],
    estadosList: Estado[] = [],
    nivelesTecnicosList: { id: number; Descripcion: string }[] = [],
    authData: AuthData | null = null
): ColumnDef<Afiliado>[] => {
    const columns: ColumnDef<Afiliado>[] = [
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
                const isPaid = !!row.original.Afiliado
                return (
                    <div className="px-4">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            disabled={isPaid}
                            aria-label="Select row"
                            className={isPaid ? "opacity-50 cursor-not-allowed" : ""}
                        />
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "detalle",
            header: "Detalle",
            cell: ({ row }) => (
                <AffiliateActions
                    afiliado={row.original}
                    onEdit={onEdit}
                    onPayment={onPayment}
                    authData={authData}
                />
            ),
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
            header: "Club",
            cell: ({ row }) => {
                const idClub = row.getValue("id_Club")
                // console.log(`Row idClub: ${idClub} (${typeof idClub})`)
                // console.log("Available Club IDs:", clubs.map(c => c.id))

                if (!idClub) return "-"
                const club = clubs.find(c => c.id.toString() === idClub.toString())
                return club ? club.Club : `ID: ${idClub} (Not Found)`
            }
        },
        {
            id: "Asociacion", // Virtual column derived from club
            header: "Asociación",
            cell: ({ row }) => {
                const idClub = row.getValue("id_Club")
                if (!idClub) return "-"
                const club = clubs.find(c => c.id.toString() === idClub.toString())
                return club ? club.Asociacion : "-"
            }
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
            header: "Escolaridad",
            cell: ({ row }) => {
                const idEscolaridad = row.getValue("id_Escolaridad")
                if (!idEscolaridad) return "-"
                const item = escolaridadList.find(i => i.id.toString() === idEscolaridad.toString())
                return item ? item.Nombre : idEscolaridad
            }
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
            cell: ({ row }) => {
                const idEstado = row.getValue("Estado")
                if (!idEstado) return "-"
                const item = estadosList.find(i => i.id.toString() === idEstado.toString())
                return item ? item.Nombre : idEstado
            }
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
            header: "Nivel Tec",
            cell: ({ row }) => {
                const idNivel = row.getValue("id_nivel_tec")
                if (!idNivel) return "-"
                const item = nivelesTecnicosList.find(i => i.id.toString() === idNivel.toString())
                return item ? item.Descripcion : idNivel
            }
        },
        {
            accessorKey: "Modalidad",
            header: "Modalidad",
        },
        {
            accessorKey: "M_pago",
            header: "Monto Pago",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("M_pago"))
                return isNaN(amount) ? "-" : new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
            }
        },
        {
            accessorKey: "F_pago",
            header: "Forma Pago",
        },
        {
            accessorKey: "Comprobante",
            header: "Comprobante",
        },
        {
            accessorKey: "Lugar_p",
            header: "Lugar Pago",
        },
        {
            accessorKey: "fecha_p",
            header: "Fecha Pago",
            cell: ({ row }) => {
                const date = row.getValue("fecha_p") as string
                return date ? new Date(date).toLocaleDateString() : "-"
            }
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

    // Only Admin (tipo_registro === 1) should see the selection checkboxes
    // eslint-disable-next-line eqeqeq
    if (authData?.tipo_registro != 1) {
        return columns.filter(col => col.id !== "select")
    }

    return columns
}
