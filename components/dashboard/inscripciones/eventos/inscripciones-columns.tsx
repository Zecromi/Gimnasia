import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Plus, TicketPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { RegisterEventDialog } from "./register-event-dialog"

// Data structure based on the provided image (Events list)
export type EventoInscripcion = {
    id: string
    noEvento: string
    nombre: string
    lugar: string
    sede: string
    fechaEvento: string
    restriccion: "sí" | "no"
    estatus: "Terminado" | "En curso" | "Próximo"
}

export const columns: ColumnDef<EventoInscripcion>[] = [
    {
        id: "inscribirse",
        header: "Inscribirse",
        cell: ({ row }) => {
            return (
                <div className="flex items-center pl-2">
                    <RegisterEventDialog eventoId={row.original.id} eventoName={row.original.nombre}>
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
        accessorKey: "noEvento",
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
        accessorKey: "nombre",
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
        accessorKey: "lugar",
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
        accessorKey: "sede",
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
        accessorKey: "fechaEvento",
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
    },
    {
        accessorKey: "restriccion",
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
            return <div className="pl-8">{row.getValue("restriccion")}</div>
        }
    },
    {
        accessorKey: "estatus",
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
            const status = row.getValue("estatus") as string
            return (
                <div className="font-medium text-gray-600">
                    {status}
                </div>
            )
        },
    },
]
