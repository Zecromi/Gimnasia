"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PersonalItem } from "@/lib/personal-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { format, parseISO } from "date-fns"

const PUESTOS: Record<number, string> = {
    1: "Administrador",
    2: "Club",
    3: "Super Administrador",
}

const trimStr = (val: string | null | undefined) => (val ?? "").trim()

export const getPersonalColumns = (onEdit: (item: PersonalItem) => void): ColumnDef<PersonalItem>[] => [
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => (
            <Button
                variant="ghost"
                size="icon-sm"
                className="hover:bg-blue-100 text-blue-600"
                onClick={() => onEdit(row.original)}
            >
                <Edit className="h-3.5 w-3.5" />
                <span className="sr-only">Editar</span>
            </Button>
        ),
    },
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
        size: 60,
    },
    {
        id: "nombre_completo",
        header: "Nombre",
        cell: ({ row }) => {
            const { Nombre, Paterno, Materno } = row.original
            return <span>{`${trimStr(Nombre)} ${trimStr(Paterno)} ${trimStr(Materno)}`}</span>
        },
    },
    {
        accessorKey: "Curp",
        header: "CURP",
        cell: ({ row }) => <span className="font-mono text-xs">{trimStr(row.original.Curp)}</span>,
    },
    {
        id: "puesto",
        header: "Puesto",
        cell: ({ row }) => {
            const label = PUESTOS[row.original.id_puesto] ?? `Puesto ${row.original.id_puesto}`
            return <Badge variant="secondary">{label}</Badge>
        },
    },
    {
        id: "telefono",
        header: "Teléfono 1",
        cell: ({ row }) => <span>{trimStr(row.original.Tel1)}</span>,
    },
    {
        id: "telefono2",
        header: "Teléfono 2",
        cell: ({ row }) => {
            const tel2 = trimStr(row.original.Tel2)
            return <span>{tel2 || "—"}</span>
        },
    },
    {
        id: "direccion",
        header: "Dirección",
        cell: ({ row }) => {
            const { Calle, Exterior, Colonia, Cp } = row.original
            return (
                <span className="text-xs text-muted-foreground">
                    {`${trimStr(Calle)} #${trimStr(Exterior)}, ${trimStr(Colonia)}, CP ${trimStr(Cp)}`}
                </span>
            )
        },
    },
    {
        accessorKey: "Fecha_alta",
        header: "Fecha Alta",
        cell: ({ row }) => {
            try {
                return <span className="text-xs">{format(parseISO(row.original.Fecha_alta), "dd/MM/yyyy")}</span>
            } catch {
                return <span className="text-xs">—</span>
            }
        },
    },
    {
        accessorKey: "Fecha_baja",
        header: "Fecha Baja",
        cell: ({ row }) => {
            const baja = row.original.Fecha_baja
            try {
                return baja
                    ? <span className="text-xs">{format(parseISO(baja), "dd/MM/yyyy")}</span>
                    : <span className="text-xs text-muted-foreground">—</span>
            } catch {
                return <span className="text-xs">—</span>
            }
        },
    },
    {
        id: "estatus",
        header: "Estatus",
        cell: ({ row }) => {
            const baja = row.original.Fecha_baja
            return baja
                ? <Badge variant="destructive">Baja</Badge>
                : <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Activo</Badge>
        },
    },
]
