import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, TicketPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RegisterEventDialog } from "./register-event-dialog"
import { EventosConfiguradosItem } from "@/lib/evento-service"

export const columns: ColumnDef<EventosConfiguradosItem>[] = [
    {
        id: "inscribirse",
        header: "Inscribirse",
        cell: ({ row }) => {
            return (
                <div className="flex items-center pl-2">
                    <RegisterEventDialog
                        eventoId={String(row.original.id_Evento)}
                        eventoName={row.original.Nombre}
                        modalidad={row.original.Modalidad}
                        costo={row.original.Costo_base}
                    >
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-teal-100 text-teal-700">
                            <TicketPlus className="h-4 w-4" />
                            <span className="sr-only">Inscribirse</span>
                        </Button>
                    </RegisterEventDialog>
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
                    No. Evento
                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "Lugar",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Lugar
                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sede
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "F_ini_evento",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fecha de evento
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            // Simple date formatting if needed, or raw string
            return <div>{row.getValue("F_ini_evento")}</div>
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
                    ¿Tiene restricción de inscripción?
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="pl-8">{row.getValue("Restriccion")}</div>
        }
    },
    {
        accessorKey: "Status",
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
            const status = row.getValue("Status") as string
            return (
                <div className="font-medium text-gray-600">
                    {status}
                </div>
            )
        },
    },
]
