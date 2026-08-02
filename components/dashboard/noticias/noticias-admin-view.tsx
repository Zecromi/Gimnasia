"use client"

import { useState, useMemo, useEffect } from "react"
import { Newspaper, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getColumns, Noticia } from "./noticias-columns"
import { DataTable } from "../data-table"
import { CreateNewsDialog } from "./create-news-dialog"
import { EditNewsDialog } from "./edit-news-dialog"
import { NewsGalleryDialog } from "./news-gallery-dialog"
import { useNoticiasStore, NoticiaRaw } from "@/lib/store/noticias-store"
import { postPresentaNoticia } from "@/lib/noticias-service"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function NoticiasAdminView() {
    const [searchTerm, setSearchTerm] = useState("")
    const [editingNoticia, setEditingNoticia] = useState<NoticiaRaw | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [deletingNoticia, setDeletingNoticia] = useState<Noticia | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [galleryNoticia, setGalleryNoticia] = useState<NoticiaRaw | null>(null)
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)

    const { rawNoticias, isLoading, fetchNoticias } = useNoticiasStore()

    useEffect(() => {
        fetchNoticias()
    }, [fetchNoticias])

    const handleView = async (noticia: Noticia) => {
        // "Activo" means visible -> send "2" to hide it.
        // "Inactivo" means hidden -> send "1" to show it.
        const newTipo = noticia.Estado === "Activo" ? "2" : "1"
        const actionText = newTipo === "1" ? "visible" : "oculta"

        try {
            await postPresentaNoticia(noticia.id.toString(), newTipo)
            toast.success(`Noticia marcada como ${actionText}`)
            handleEditSuccess() // Refresh the table
        } catch (error) {
            console.error("Error cambiando visibilidad:", error)
            toast.error("Error al cambiar la visibilidad de la noticia")
        }
    }

    const handleEdit = (noticia: Noticia) => {
        setEditingNoticia(noticia as NoticiaRaw)
        setIsEditOpen(true)
    }

    const handleGallery = (noticia: Noticia) => {
        setGalleryNoticia(noticia as NoticiaRaw)
        setIsGalleryOpen(true)
    }

    const handleDelete = (noticia: Noticia) => {
        setDeletingNoticia(noticia)
    }

    const confirmDelete = async () => {
        if (!deletingNoticia) return
        
        setIsDeleting(true)
        try {
            await postPresentaNoticia(deletingNoticia.id.toString(), "3")
            toast.success("Noticia eliminada correctamente")
            handleEditSuccess() // Refresh the table
        } catch (error) {
            console.error("Error eliminando noticia:", error)
            toast.error("Error al eliminar la noticia")
        } finally {
            setIsDeleting(false)
            setDeletingNoticia(null)
        }
    }

    const handleEditSuccess = () => {
        // Invalidate cache so the table refreshes with fresh data
        useNoticiasStore.setState({ noticias: [], rawNoticias: [] })
        fetchNoticias()
    }

    const columns = useMemo(
        () => getColumns(handleEdit, handleDelete, handleView, handleGallery),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const filteredData = useMemo(() => {
        return rawNoticias.filter(n =>
            n.Titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.Resumen.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [rawNoticias, searchTerm])

    return (
        <div className="space-y-0">
            <Card className="rounded-2xl border-none shadow-none bg-gray-50/50 dark:bg-zinc-900/50 pb-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2 pt-2">
                            <Newspaper className="h-6 w-6 text-blue-600" />
                            Administración de Noticias
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Carga, edita y gestiona las noticias y comunicados del portal.
                        </p>
                    </div>
                    <CreateNewsDialog onSuccess={() => {
                        useNoticiasStore.setState({ noticias: [], rawNoticias: [] })
                        fetchNoticias()
                    }} />
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

            <EditNewsDialog
                noticia={editingNoticia}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSuccess={handleEditSuccess}
            />

            <NewsGalleryDialog
                noticia={galleryNoticia}
                open={isGalleryOpen}
                onOpenChange={setIsGalleryOpen}
                onSuccess={handleEditSuccess}
            />

            <AlertDialog open={!!deletingNoticia} onOpenChange={(open) => !open && setDeletingNoticia(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar noticia?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar la noticia id: {deletingNoticia?.id}? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                confirmDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
