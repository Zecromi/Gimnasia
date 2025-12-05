"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Club = {
    id: string
    nombre: string
    asociacion: string
    club: string
    estatus: "Alta" | "Baja"
    noAfiliado: string
    curp: string
}

export const columns: ColumnDef<Club>[] = [
    {
        accessorKey: "nombre",
        header: "Nombre",
    },
    {
        accessorKey: "asociacion",
        header: "Asociación",
    },
    {
        accessorKey: "club",
        header: "Club",
    },
    {
        accessorKey: "estatus",
        header: "Estatus",
    },
    {
        accessorKey: "noAfiliado",
        header: "No. Afiliado",
    },
    {
        accessorKey: "curp",
        header: "CURP",
    },
]
