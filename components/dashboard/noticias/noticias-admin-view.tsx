"use client"

import { useState, useMemo, useEffect } from "react"
import { Newspaper, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getColumns, Noticia } from "./noticias-columns"
import { DataTable } from "../data-table"
import { CreateNewsDialog } from "./create-news-dialog"
import { useNoticiasStore } from "@/lib/store/noticias-store"

export function NoticiasAdminView() {
    const [searchTerm, setSearchTerm] = useState("")

    const { rawNoticias, isLoading, fetchNoticias } = useNoticiasStore()

    useEffect(() => {
        fetchNoticias()
    }, [fetchNoticias])

    const handleView = (noticia: Noticia) => {
        console.log("Viewing noticia:", noticia)
    }

    const handleEdit = (noticia: Noticia) => {
        console.log("Editing noticia:", noticia)
    }

    const handleDelete = (noticia: Noticia) => {
        console.log("Deleting noticia:", noticia)
    }

    const columns = useMemo(() => getColumns(handleEdit, handleDelete, handleView), [])

    const filteredData = useMemo(() => {
        return rawNoticias.filter(n =>
            n.Titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.Resumen.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [rawNoticias, searchTerm])

    return (
        <div className="space-y-4">
            <Card className="rounded-2xl border-none shadow-none bg-gray-50/50 dark:bg-zinc-900/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Newspaper className="h-6 w-6 text-blue-600" />
                            Administración de Noticias
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Carga, edita y gestiona las noticias y comunicados del portal.
                        </p>
                    </div>
                    <CreateNewsDialog onSuccess={() => fetchNoticias()} />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por título o resumen..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 rounded-xl bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm font-medium">Cargando noticias...</span>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            headerClassName="bg-white dark:bg-zinc-950"
                            tableHeight="h-[500px]"
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
