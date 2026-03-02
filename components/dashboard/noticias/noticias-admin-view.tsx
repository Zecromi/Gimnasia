"use client"

import { useState, useMemo } from "react"
import { Plus, Newspaper, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getColumns, Noticia } from "./noticias-columns"
import { DataTable } from "../data-table"
import { CreateNewsDialog } from "./create-news-dialog"

// Mock data
const MOCK_NOTICIAS: Noticia[] = [
    {
        id: 1,
        titulo: "Inscripciones Abiertas - Nacional GAF 2024",
        resumen: "Ya se encuentran abiertas las inscripciones para el campeonato nacional de gimnasia artística femenina.",
        fecha: "2024-03-01",
        estatus: "Publicado",
        autor: "Administrador"
    },
    {
        id: 2,
        titulo: "Nuevo Reglamento de Competencia",
        resumen: "Se ha publicado el nuevo reglamento técnico para el ciclo 2024-2025.",
        fecha: "2024-02-15",
        estatus: "Borrador",
        autor: "Coordinación Técnica"
    },
    {
        id: 3,
        titulo: "Resultados Estatales 2024",
        resumen: "Consulta los resultados del pasado evento estatal celebrado en el Club Benito Juárez.",
        fecha: "2024-02-10",
        estatus: "Publicado",
        autor: "Prensa"
    }
]

export function NoticiasAdminView() {
    const [searchTerm, setSearchTerm] = useState("")

    const handleView = (noticia: Noticia) => {
        console.log("Viewing noticia:", noticia)
    }

    const handleEdit = (noticia: Noticia) => {
        console.log("Editing noticia:", noticia)
    }

    const handleDelete = (noticia: Noticia) => {
        console.log("Deleting noticia:", noticia)
    }

    const fetchData = () => {
        console.log("Fetching news data...")
        // In a real app, this would re-fetch from API
    }

    const columns = useMemo(() => getColumns(handleEdit, handleDelete, handleView), [])

    const filteredData = useMemo(() => {
        return MOCK_NOTICIAS.filter(n =>
            n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.autor.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm])

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
                    <CreateNewsDialog onSuccess={fetchData} />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por título o autor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 rounded-xl bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredData}
                        headerClassName="bg-white dark:bg-zinc-950"
                        tableHeight="h-[500px]"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
