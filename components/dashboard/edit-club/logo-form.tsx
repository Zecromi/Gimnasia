"use client"

import * as React from "react"
import { Building2, Upload, Loader2, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ViewClubGral } from "@/lib/club-service"
import { postArchivoEvento } from "@/lib/evento-service"
import { cn } from "@/lib/utils"

export function LogoForm({ id, club }: { id: string, club: ViewClubGral }) {
    const [file, setFile] = React.useState<File | null>(null)
    const [isUploading, setIsUploading] = React.useState(false)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const [isDragging, setIsDragging] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) {
            processFile(selectedFile)
        }
    }

    const processFile = (selectedFile: File) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(selectedFile.type)) {
            toast.error("Solo se permiten archivos JPG o PNG")
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        
        const img = new Image()
        img.onload = () => {
            if (img.width < 150 || img.height < 150) {
                toast.error("La imagen debe ser de al menos 150x150 píxeles")
                if (fileInputRef.current) fileInputRef.current.value = ''
                URL.revokeObjectURL(objectUrl)
                return
            }
            
            if (img.width >= 1000 || img.height >= 1000) {
                toast.error("La imagen debe ser menor a 1000x1000 píxeles")
                if (fileInputRef.current) fileInputRef.current.value = ''
                URL.revokeObjectURL(objectUrl)
                return
            }

            setFile(selectedFile)
            setPreviewUrl(objectUrl)
        }
        img.onerror = () => {
            toast.error("El archivo seleccionado no es una imagen válida")
            if (fileInputRef.current) fileInputRef.current.value = ''
            URL.revokeObjectURL(objectUrl)
        }
        img.src = objectUrl
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
            const droppedFile = e.dataTransfer.files[0]
            processFile(droppedFile)
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(droppedFile)
                fileInputRef.current.files = dataTransfer.files
            }
        }
    }

    const removeFile = () => {
        setFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        // Could reset preview to club.logo URL here if available in the future
    }

    const handleUpload = async () => {
        if (!file) {
            toast.error("Seleccione una imagen primero")
            return
        }

        try {
            setIsUploading(true)
            
            const fileExtension = file.name.split('.').pop() || 'png'
            const fileName = file.name.substring(0, file.name.lastIndexOf('.')) || "logo"
            const clubIdStr = club.id ? club.id.toString() : "0"

            toast.loading("Subiendo logo...", { id: "upload-logo" })
            
            await postArchivoEvento(
                clubIdStr,
                fileExtension,
                "2",
                fileName,
                file
            )

            toast.success("Logo actualizado exitosamente", { id: "upload-logo" })
            
            // Keep the preview so the user sees the new logo, but clear 'file' so "Guardar" disappears
            setFile(null)
        } catch (error) {
            console.error("Error al subir el logo:", error)
            toast.error("Error al subir el logo", { id: "upload-logo" })
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    React.useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <Building2 className="mr-2 h-5 w-5" />
                Identidad del Club
            </h3>
            
            <div 
                className={cn(
                    "flex flex-col items-center justify-center gap-6 p-10 border-2 border-dashed rounded-xl transition-colors relative min-h-[300px]",
                    isDragging 
                        ? "border-teal-500 bg-teal-50/50 dark:bg-teal-900/20" 
                        : "border-teal-200 dark:border-teal-900 bg-muted/10",
                    file ? "border-teal-400 bg-teal-50/10" : ""
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center shadow-inner overflow-hidden relative z-10 pointer-events-none">
                    {previewUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                        <Building2 className="h-16 w-16 text-muted-foreground" />
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>

                {!file ? (
                    <>
                        <div className="text-center space-y-2 relative z-10 pointer-events-none">
                            <h4 className="text-lg font-semibold">Logo del Club</h4>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Arrastre una imagen (PNG, JPG) aquí o haga clic para seleccionar.
                            </p>
                            <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
                                Tamaño mínimo: 150x150 | Tamaño máximo: 999x999
                            </p>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange}
                        />
                    </>
                ) : (
                    <div className="relative w-full max-w-[400px] z-30">
                        <div className="p-4 bg-background rounded-lg border border-teal-200 dark:border-teal-800 flex items-center justify-between shadow-sm">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="p-2 bg-teal-50 dark:bg-teal-900/40 rounded-md">
                                    <Building2 className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={removeFile}
                                disabled={isUploading}
                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {file && (
                <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={removeFile} disabled={isUploading}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleUpload} className="bg-teal-600 hover:bg-teal-700 text-white" disabled={isUploading}>
                        {isUploading ? "Subiendo..." : "Guardar Imagen"}
                    </Button>
                </div>
            )}
        </div>
    )
}
