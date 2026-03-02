"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Noticia {
    id: number
    titulo: string
    resumen: string
    fecha: string
    estatus: "Publicado" | "Borrador"
    autor: string
}

export const getColumns = (
    onEdit: (noticia: Noticia) => void,
    onDelete: (noticia: Noticia) => void,
    onView: (noticia: Noticia) => void
): ColumnDef<Noticia>[] => [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "titulo",
            header: "Título",
            cell: ({ row }) => <span className="font-medium text-blue-600 dark:text-blue-400">{row.original.titulo}</span>
        },
        {
            accessorKey: "autor",
            header: "Autor",
        },
        {
            accessorKey: "fecha",
            header: "Fecha de Publicación",
            cell: ({ row }) => {
                const date = new Date(row.original.fecha)
                return date.toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                })
            }
        },
        {
            accessorKey: "estatus",
            header: "Estatus",
            cell: ({ row }) => {
                const estatus = row.original.estatus
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            "px-2 py-0.5",
                            estatus === "Publicado"
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                        )}
                    >
                        {estatus}
                    </Badge>
                )
            }
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onView(row.original)}
                        className="hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onEdit(row.original)}
                        className="hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onDelete(row.original)}
                        className="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]
