"use client"

import { useState, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2, Check, X, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { getContGal } from "@/lib/noticias-service"

export interface Noticia {
    id: number
    Titulo: string
    Resumen: string
    Contenido: string
    AutorID: number
    ModalidadID: number
    Tipo: number
    extension: string | null
    Estado: string
}

function GalleryCellContent({ noticia, onGallery }: { noticia: Noticia; onGallery: (noticia: Noticia) => void }) {
    const [count, setCount] = useState<number | null>(null)

    useEffect(() => {
        getContGal(noticia.id)
            .then((data) => {
                const num = typeof data === "number" ? data : Number(data) || 0
                setCount(num)
            })
            .catch(() => setCount(0))
    }, [noticia.id])

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onGallery(noticia)}
                        className="hover:bg-teal-100 dark:hover:bg-teal-900/30 text-teal-600 dark:text-teal-400 gap-1"
                    >
                        <Image className="h-4 w-4" />
                        {count !== null && (
                            <span className="text-[10px] font-bold leading-none min-w-[14px] text-center">{count}</span>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Galería{count !== null ? ` (${count})` : ""}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export const getColumns = (
    onEdit: (noticia: Noticia) => void,
    onDelete: (noticia: Noticia) => void,
    onView: (noticia: Noticia) => void,
    onGallery: (noticia: Noticia) => void
): ColumnDef<Noticia>[] => [
        {
            id: "galeria",
            header: "Galería",
            cell: ({ row }) => <GalleryCellContent noticia={row.original} onGallery={onGallery} />
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => (
                <TooltipProvider>
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => onView(row.original)}
                                    className={cn(
                                        row.original.Estado === "Activo"
                                            ? "hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                            : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400"
                                    )}
                                >
                                    {row.original.Estado === "Activo" ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <X className="h-4 w-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                {row.original.Estado === "Activo" ? "Ocultar" : "Mostrar"}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => onEdit(row.original)}
                                    className="hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Editar</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => onDelete(row.original)}
                                    className="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Eliminar</TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            )
        },
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "Titulo",
            header: "Título",
            cell: ({ row }) => <span className="font-medium text-blue-600 dark:text-blue-400">{row.original.Titulo}</span>
        },
        {
            accessorKey: "Resumen",
            header: "Resumen",
            cell: ({ row }) => {
                const text = row.original.Resumen || ""
                const truncated = text.length > 60 ? text.substring(0, 60) + "..." : text
                return (
                    <span 
                        className="text-sm text-muted-foreground cursor-help" 
                        title={text}
                    >
                        {truncated}
                    </span>
                )
            }
        },
        {
            accessorKey: "ModalidadID",
            header: "Modalidad ID",
        },
        {
            accessorKey: "Tipo",
            header: "Tipo",
            cell: ({ row }) => {
                const tipo = row.original.Tipo
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            "px-2 py-0.5",
                            tipo === 1
                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        )}
                    >
                        {tipo === 1 ? "Carrusel" : "Normal"}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "Estado",
            header: "Estado",
            cell: ({ row }) => {
                const estado = row.original.Estado
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            "px-2 py-0.5",
                            estado === "Activo"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
                        )}
                    >
                        {estado === "Activo" ? "Visible" : "Oculto"}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "extension",
            header: "Imagen",
            cell: ({ row }) => {
                const ext = row.original.extension
                return ext
                    ? <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400">{ext.toUpperCase()}</Badge>
                    : <span className="text-xs text-muted-foreground">Sin imagen</span>
            }
        }
    ]
