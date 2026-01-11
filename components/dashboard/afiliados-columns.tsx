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
import { AfiliadosDialog } from "./afiliados-dialog"

import { ViewClubGral, CatalogoItem, Estado } from "@/lib/club-service"

export const getColumns = (
    onSuccess: () => void,
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
                    <div className="flex items-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="inline-block">
                                    <AfiliadosDialog
                                        afiliado={row.original}
                                        onSuccess={onSuccess}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-200 dark:hover:bg-green-800">
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Editar</span>
                                            </Button>
                                        }
                                    />
                                </div>
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
