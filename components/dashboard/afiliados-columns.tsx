"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit, ArrowUpDown, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Afiliado } from "@/lib/afiliados-service"

import { ViewClubGral, CatalogoItem, Estado } from "@/lib/club-service"

export const getColumns = (
    onSuccess: () => void,
    onEdit: (afiliado: Afiliado) => void,
    onPayment: (afiliado: Afiliado) => void,
    clubs: ViewClubGral[] = [],
    escolaridadList: CatalogoItem[] = [],
    estadosList: Estado[] = [],
    nivelesTecnicosList: { id: number; Descripcion: string }[] = []
): ColumnDef<Afiliado>[] => [
        {
            id: "detalle",
            header: "Detalle",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-green-200 dark:hover:bg-green-800 text-green-600"
                                    onClick={() => onEdit(row.original)}
                                >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Editar Afiliado</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600"
                                    onClick={() => onPayment(row.original)}
                                >
                                    <CreditCard className="h-4 w-4" />
                                    <span className="sr-only">Pago</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Pago de Afiliación</p>
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
