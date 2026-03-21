"use client"

import * as React from "react"
import { Save, Image as ImageIcon, Newspaper } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { putNoticia, cargaImagen } from "@/lib/noticias-service"
import { useAuthStore } from "@/lib/store/auth-store"
import { useCatalogStore } from "@/lib/store/catalog-store"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { NoticiaRaw } from "@/lib/store/noticias-store"

interface EditNewsDialogProps {
    noticia: NoticiaRaw | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function EditNewsDialog({ noticia, open, onOpenChange, onSuccess }: EditNewsDialogProps) {
    const [isLoading, setIsLoading] = React.useState(false)
    const [imagePreview, setImagePreview] = React.useState<string | null>(null)
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
    const [tipoState, setTipoState] = React.useState<boolean>(false)

    const authData = useAuthStore((state) => state.authData)
    const { Modalidades, fetchCatalogs } = useCatalogStore()

    React.useEffect(() => {
        fetchCatalogs()
    }, [fetchCatalogs])

    // Reset file/tipo state when dialog opens with a new noticia
    React.useEffect(() => {
        if (open && noticia) {
            setTipoState(noticia.Tipo === 1)
        }
        if (!open) {
            setImagePreview(null)
            setSelectedFile(null)
        }
    }, [open, noticia])

    if (!noticia) return null

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const titulo = formData.get("titulo") as string
        const modalidadID = formData.get("categoria") as string
        const resumen = formData.get("descripcion") as string
        const contenido = formData.get("contenido") as string
        const tipo = tipoState ? "1" : "2"
        const autorID = authData?.tipo_registro?.toString() || "1"

        const payload = { titulo, resumen, contenido, autorID, modalidadID, tipo }
        console.log("[PutNoticia] Payload enviado:", payload)

        try {
            // 1. Update noticia text fields
            await putNoticia(noticia.id.toString(), payload)

            // 2. Upload new image only if a file was selected
            if (selectedFile) {
                const extension = selectedFile.name.split(".").pop() || "jpg"
                await cargaImagen(noticia.id.toString(), extension, selectedFile)
            }

            toast.success("Noticia actualizada exitosamente")
            onOpenChange(false)
            onSuccess?.()
        } catch (error: any) {
            console.error("Error al actualizar la noticia:", error?.response?.data || error)
            const errorMsg = error?.response?.data?.message || error?.response?.data || "Ocurrió un error al actualizar la noticia"
            toast.error(typeof errorMsg === "string" ? errorMsg : "Ocurrió un error al actualizar la noticia")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="!w-[90vw] !max-w-[90vw] h-[80vh] p-0 overflow-hidden flex flex-col"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-6 py-4 border-b bg-gray-50 dark:bg-zinc-900 shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Newspaper className="h-5 w-5 text-blue-600" />
                        Editar Noticia <span className="text-muted-foreground font-normal text-sm">#{noticia.id}</span>
                    </DialogTitle>
                    <DialogDescription>
                        Modifica los campos que deseas actualizar. La imagen es opcional — si no seleccionas una nueva, se conserva la actual.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <ScrollArea className="flex-1 h-full">
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                            {/* Columna Izquierda: Información */}
                            <div className="space-y-6 flex flex-col">
                                <InputGroup label="Título de la Noticia : *" htmlFor="titulo">
                                    <Input
                                        id="titulo"
                                        name="titulo"
                                        defaultValue={noticia.Titulo}
                                        required
                                    />
                                </InputGroup>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Modalidad : *" htmlFor="categoria">
                                        <Select name="categoria" defaultValue={noticia.ModalidadID?.toString()} required>
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
                                </div>

                                <div className="space-y-2 flex-1 flex flex-col p-1">
                                    <Label htmlFor="descripcion">Resumen : *</Label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        defaultValue={noticia.Resumen}
                                        className="h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        maxLength={150}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 flex-1 flex flex-col p-1">
                                    <Label htmlFor="contenido">Contenido Completo : *</Label>
                                    <textarea
                                        id="contenido"
                                        name="contenido"
                                        defaultValue={noticia.Contenido}
                                        className="flex-1 min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Columna Derecha: Imagen y Tipo */}
                            <div className="space-y-6 flex flex-col">
                                <div className="space-y-3">
                                    <Label>Imagen de la Noticia <span className="text-muted-foreground text-xs">(opcional — cambia solo si seleccionas una nueva)</span></Label>
                                    <div className="grid gap-4">
                                        {imagePreview ? (
                                            <div className="relative group w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-blue-200 dark:border-blue-900/30 bg-black/5">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => { setImagePreview(null); setSelectedFile(null) }}
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
                                                        <span className="font-semibold text-blue-600">Clic</span> para cambiar imagen
                                                    </p>
                                                    {noticia.extension && (
                                                        <p className="text-xs text-muted-foreground">Imagen actual: <span className="font-semibold">.{noticia.extension}</span></p>
                                                    )}
                                                </div>
                                                <Input
                                                    id="imagen-edit"
                                                    name="imagen"
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                    <Checkbox
                                        id="carousel-edit"
                                        name="carousel"
                                        value="true"
                                        checked={tipoState}
                                        onCheckedChange={(checked) => setTipoState(!!checked)}
                                        className="mt-1"
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="carousel-edit"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            Mostrar en el carrusel principal
                                        </label>
                                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                                            Al activar esta opción, la noticia se fijará en la cabecera principal de la página de inicio.
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
                            onClick={() => onOpenChange(false)}
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
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
