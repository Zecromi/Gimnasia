import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, TicketPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { EventosConfiguradosItem } from "@/lib/evento-service"

export const getColumns = (
    onSuccess: () => void,
    onRegister: (evento: EventosConfiguradosItem) => void
): ColumnDef<EventosConfiguradosItem>[] => [
        {
            id: "inscribirse",
            header: "Inscribirse",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center pl-2">
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            className="hover:bg-teal-100 text-teal-700"
                            onClick={() => onRegister(row.original)}
                        >
                            <TicketPlus className="h-3.5 w-3.5" />
                            <span className="sr-only">Inscribirse</span>
                        </Button>
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
                        size="xs"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        No. Evento
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "Nombre",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nombre
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "Organizador",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Organizador
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
            ),
        },
        {
            accessorKey: "Asociacion",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Asociación
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
            ),
        },
        {
            accessorKey: "Lugar",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Lugar
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "Sede",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Sede
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "Region",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Región
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
            ),
        },
        {
            accessorKey: "F_ini_evento",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fecha de evento
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const dateStr = row.getValue("F_ini_evento") as string
                if (!dateStr) return <div>-</div>
                const date = new Date(dateStr)
                return <div>{format(date, "P", { locale: es })}</div>
            }
        },
        {
            accessorKey: "Restriccion",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Restricción
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return <div className="pl-4">{row.getValue("Restriccion")}</div>
            }
        },
        {
            accessorKey: "Status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Estatus
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const status = row.getValue("Status") as string
                return (
                    <div className="font-medium text-gray-600">
                        {status}
                    </div>
                )
            },
        },
    ]
