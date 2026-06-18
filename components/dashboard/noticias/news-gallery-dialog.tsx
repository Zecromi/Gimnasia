"use client"

import * as React from "react"
import { Image as ImageIcon, UploadCloud, Trash2, X, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NoticiaRaw } from "@/lib/store/noticias-store"
import { cargaImagenGal, getImagenGalUrl } from "@/lib/noticias-service"

interface NewsGalleryDialogProps {
    noticia: NoticiaRaw | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

interface GalleryImageItem {
    src: string
    isNew: boolean
    file?: File
}

const GALLERY_IMAGE_COUNT = 5

export function NewsGalleryDialog({ noticia, open, onOpenChange, onSuccess }: NewsGalleryDialogProps) {
    const [images, setImages] = React.useState<GalleryImageItem[]>([])
    const [isDragging, setIsDragging] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isFetchingGallery, setIsFetchingGallery] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Fetch existing gallery images from /Obt_img_gal when the dialog opens
    React.useEffect(() => {
        if (open && noticia) {
            setIsFetchingGallery(true)
            setImages([])

            // Build URLs for images 1-5 and probe which ones exist
            const urls = Array.from({ length: GALLERY_IMAGE_COUNT }, (_, i) =>
                getImagenGalUrl(noticia.id, i + 1)
            )

            // Check each URL by loading it as an Image to see if the server returns a valid image
            const checks = urls.map(
                (url) =>
                    new Promise<GalleryImageItem | null>((resolve) => {
                        const img = new window.Image()
                        img.onload = () => resolve({ src: url, isNew: false })
                        img.onerror = () => resolve(null)
                        img.src = url
                    })
            )

            Promise.all(checks).then((results) => {
                const existingImages = results.filter(
                    (item): item is GalleryImageItem => item !== null
                )
                setImages(existingImages)
                setIsFetchingGallery(false)
            })
        }
    }, [open, noticia])

    if (!noticia) return null

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            processFiles(files)
        }
    }

    const processFiles = (files: FileList) => {
        const newImages: GalleryImageItem[] = []
        let processedCount = 0

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if (file.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    newImages.push({
                        src: reader.result as string,
                        isNew: true,
                        file
                    })
                    processedCount++
                    if (processedCount === files.length) {
                        setImages((prev) => [...prev, ...newImages])
                        toast.success(`${files.length} imagen(es) agregada(s) a la galería`)
                    }
                }
                reader.readAsDataURL(file)
            } else {
                toast.error("Por favor, seleccione únicamente archivos de imagen")
            }
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files)
        }
    }

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        toast.info("Imagen removida de la lista")
    }

    const handleSave = async () => {
        const newImagesToUpload = images.filter((img) => img.isNew && img.file)
        if (newImagesToUpload.length === 0) {
            toast.info("No hay nuevas imágenes por guardar")
            onOpenChange(false)
            return
        }

        setIsLoading(true)
        try {
            // Upload all new files sequentially to /Carga_Imagen_gal
            for (const img of newImagesToUpload) {
                const file = img.file!
                const extension = file.name.split(".").pop() || "jpg"
                await cargaImagenGal(noticia.id.toString(), extension, file)
            }

            toast.success("Galería de fotos guardada correctamente en el servidor")
            onOpenChange(false)
            onSuccess?.()
        } catch (error: any) {
            console.error("Error al guardar la galería:", error)
            const errorMsg = error?.response?.data?.message || error?.response?.data || "Ocurrió un error al guardar las imágenes en la galería"
            toast.error(typeof errorMsg === "string" ? errorMsg : "Ocurrió un error al guardar las imágenes en la galería")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="!w-[90vw] !max-w-[80vw] h-[80vh] p-0 overflow-hidden flex flex-col"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-6 py-4 border-b bg-gray-50 dark:bg-zinc-900 shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-teal-600" />
                        Galería de Imágenes <span className="text-muted-foreground font-normal text-sm">#{noticia.id}</span>
                    </DialogTitle>
                    <DialogDescription className="line-clamp-1">
                        Gestiona las imágenes de la galería para la noticia: <strong>{noticia.Titulo}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
                    {/* Left Panel: Dropzone/Uploader */}
                    <div className="w-full lg:w-[320px] p-6 border-b lg:border-b-0 lg:border-r flex flex-col shrink-0 bg-gray-50/30 dark:bg-zinc-900/10">
                        <div className="space-y-4 flex flex-col h-full justify-between">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Subir Imágenes</h3>
                                <p className="text-xs text-muted-foreground">
                                    Añade nuevas fotografías para el carrusel de la galería de este comunicado.
                                </p>
                            </div>

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors relative min-h-[160px] lg:min-h-0 ${
                                    isDragging
                                        ? "border-teal-500 bg-teal-50/50 dark:bg-teal-900/20"
                                        : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900/50"
                                }`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                />
                                <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-full mb-3">
                                    <UploadCloud className="h-6 w-6" />
                                </div>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Arrastra imágenes aquí o haz clic para buscarlas
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    PNG, JPG, WEBP de hasta 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Gallery Grid */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    Imágenes en Galería
                                    <span className="text-xs font-normal text-muted-foreground">
                                        ({images.length} item{images.length !== 1 && "s"})
                                    </span>
                                </h3>

                                {isFetchingGallery ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                                        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                                        <p className="text-sm font-medium text-muted-foreground">Cargando galería...</p>
                                    </div>
                                ) : images.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 dark:border-zinc-900 rounded-xl bg-gray-50/20">
                                        <span className="text-4xl mb-3 opacity-40">📷</span>
                                        <h4 className="font-medium text-sm text-gray-500">Galería vacía</h4>
                                        <p className="text-xs text-muted-foreground max-w-[240px] mt-1">
                                            Aún no has cargado fotos. Sube imágenes desde el panel izquierdo.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800 bg-black/5 hover:shadow-md transition-all animate-in fade-in-0 duration-300"
                                            >
                                                <img
                                                    src={img.src}
                                                    alt={`Galería ${index + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = "/logo-gimnasios.png"
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon-xs"
                                                        className="h-8 w-8 rounded-full shadow-lg"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-gray-50 dark:bg-zinc-900 mt-auto shrink-0 flex items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        className="bg-teal-600 hover:bg-teal-700 text-white min-w-[120px]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full mr-2" />
                        ) : (
                            <Plus className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "Guardando..." : "Guardar Galería"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
