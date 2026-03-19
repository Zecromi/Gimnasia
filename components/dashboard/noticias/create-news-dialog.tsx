"use client"

import * as React from "react"
import { Plus, Save, Image as ImageIcon, Newspaper } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cargaImagen, postNoticia } from "@/lib/noticias-service"
import { useAuthStore } from "@/lib/store/auth-store"
import { useCatalogStore } from "@/lib/store/catalog-store"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

// Remove hardcoded categories array


interface CreateNewsDialogProps {
    onSuccess?: () => void
}

export function CreateNewsDialog({ onSuccess }: CreateNewsDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [imagePreview, setImagePreview] = React.useState<string | null>(null)
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

    const authData = useAuthStore((state) => state.authData)
    const { Modalidades, fetchCatalogs } = useCatalogStore()

    React.useEffect(() => {
        fetchCatalogs()
    }, [fetchCatalogs])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedFile || !imagePreview) {
            toast.error("Por favor seleccione una imagen")
            return
        }

        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const titulo = formData.get("titulo") as string
        const modalidadID = formData.get("categoria") as string // Will map based on value since they are strings
        const resumen = formData.get("descripcion") as string
        const contenido = formData.get("contenido") as string
        const isCarousel = formData.get("carousel") === "true"
        const tipo = isCarousel ? "1" : "0"

        // De acuerdo con la indicación: autorID es el "tipo_registro" de quien inicio sesion (ej. 1 o 3)
        const autorID = authData?.tipo_registro?.toString() || "1"

        const extension = selectedFile.name.split('.').pop() || "jpg"

        try {
            // 1. Crear la Noticia
            const noticiaRes = await postNoticia({
                titulo,
                resumen,
                contenido,
                autorID,
                modalidadID,
                tipo,
            })

            // PostNoticia returns [{"Column1": "2004"}]
            const noticiaId = noticiaRes?.[0]?.Column1 ?? null

            if (!noticiaId) {
                // If we cannot determine the ID, abort image upload to avoid attaching it to the wrong record
                console.error("[PostNoticia] No se pudo extraer el ID de la noticia. Respuesta:", noticiaRes)
                toast.warning("Noticia creada, pero no se pudo identificar el ID para subir la imagen. Revisa la consola.")
                setOpen(false)
                setImagePreview(null)
                setSelectedFile(null)
                onSuccess?.()
                return
            }

            // 2. Cargar la imagen atada a la nueva Noticia usando multipart/form-data
            await cargaImagen(noticiaId.toString(), extension, selectedFile)

            toast.success("Noticia e imagen creadas exitosamente")
            setOpen(false)
            setImagePreview(null)
            setSelectedFile(null)
            onSuccess?.()
        } catch (error: any) {
            console.error("Error al publicar la noticia:", error?.response?.data || error)
            const errorMsg = error?.response?.data?.message || error?.response?.data || "Ocurrió un error al cargar la noticia"
            toast.error(typeof errorMsg === 'string' ? errorMsg : "Ocurrió un error al cargar la noticia")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 transition-all hover:scale-105 active:scale-95 shadow-md">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Noticia
                </Button>
            </DialogTrigger>
            <DialogContent className="!w-[90vw] !max-w-[90vw] h-[80vh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="px-6 py-4 border-b bg-gray-50 dark:bg-zinc-900 shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Newspaper className="h-5 w-5 text-blue-600" />
                        Nueva Noticia
                    </DialogTitle>
                    <DialogDescription>
                        Complete los campos para publicar una nueva noticia en el portal.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <ScrollArea className="flex-1 h-full">
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                            {/* Columna Izquierda: Información de la Noticia */}
                            <div className="space-y-6 flex flex-col">
                                <InputGroup label="Título de la Noticia : *" htmlFor="titulo">
                                    <Input
                                        id="titulo"
                                        name="titulo"
                                        placeholder="Ej: Gran Campeonato Nacional 2026"
                                        required
                                    />
                                </InputGroup>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Modalidad : *" htmlFor="categoria">
                                        <Select name="categoria" required>
                                            <SelectTrigger id="categoria">
                                                <SelectValue placeholder="Seleccionar modalidad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Modalidades && Modalidades.map((modality: any) => (
                                                    <SelectItem key={modality.id} value={modality.id.toString()}>
                                                        {modality.Nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>

                                    <InputGroup label="Fecha : *" htmlFor="fecha">
                                        <Input
                                            id="fecha"
                                            name="fecha"
                                            type="date"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </InputGroup>
                                </div>

                                <div className="space-y-2 flex-1 flex flex-col p-1">
                                    <Label htmlFor="descripcion">Resumen : *</Label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        className="h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Escriba un breve resumen de la noticia..."
                                        maxLength={150}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 flex-1 flex flex-col p-1">
                                    <Label htmlFor="contenido">Contenido Completo : *</Label>
                                    <textarea
                                        id="contenido"
                                        name="contenido"
                                        className="flex-1 min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Escriba el contenido completo de la noticia..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Columna Derecha: Imagen y Configuración */}
                            <div className="space-y-6 flex flex-col">
                                <div className="space-y-3">
                                    <Label>Imagen de la Noticia : *</Label>
                                    <div className="grid gap-4">
                                        {imagePreview ? (
                                            <div className="relative group w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-blue-200 dark:border-blue-900/30 bg-black/5">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            setImagePreview(null)
                                                            setSelectedFile(null)
                                                        }}
                                                    >
                                                        Cambiar Imagen
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors overflow-hidden">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <div className="p-3 bg-blue-100/50 dark:bg-blue-900/30 rounded-full mb-3">
                                                        <ImageIcon className="w-8 h-8 text-blue-600" />
                                                    </div>
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold text-blue-600">Haga clic</span> o arrastre
                                                    </p>
                                                    <p className="text-xs text-gray-400">SVG, PNG, JPG (MAX. 800x400px)</p>
                                                </div>
                                                <Input
                                                    id="imagen"
                                                    name="imagen"
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                                                    onChange={handleImageChange}
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                    <Checkbox id="carousel" name="carousel" value="true" className="mt-1" />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="carousel"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            Mostrar en el carrusel principal
                                        </label>
                                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                                            Al activar esta opción, la noticia se fijará en la cabecera principal de la página de inicio, destacando sobre las demás publicaciones.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="p-4 border-t bg-gray-50 dark:bg-zinc-900 mt-auto shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full mr-2" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Guardar Noticia
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
