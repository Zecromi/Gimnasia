"use client"

import * as React from "react"
import { FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { postArchivoEvento, EventosConfiguradosItem as Evento } from "@/lib/evento-service"

export function InfoEventoPdfForm({ id, evento }: { id: string, evento: Evento }) {
    const [file, setFile] = React.useState<File | null>(null)
    const [uploading, setUploading] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
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
            const droppedFile = e.dataTransfer.files[0]
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile)
                if (fileInputRef.current) {
                    const dataTransfer = new DataTransfer()
                    dataTransfer.items.add(droppedFile)
                    fileInputRef.current.files = dataTransfer.files
                }
            } else {
                toast.error("Por favor, seleccione únicamente un archivo PDF")
            }
        }
    }

    const removeFile = () => {
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            toast.error("Seleccione un archivo PDF primero")
            return
        }

        try {
            setUploading(true)
            const extension = file.name.split('.').pop() || "pdf"
            const response = await postArchivoEvento(String(evento.id), String(extension), "1", file)

            console.log(response.data)
            toast.success("Documento de información del evento actualizado correctamente")

            setFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ""
        } catch (error) {
            toast.error("Error al subir el archivo")
        } finally {
            setUploading(false)
        }
    }

    return (
        <form id={id} onSubmit={handleUpload} className="space-y-6 px-2 py-4">
            <div className="space-y-4">
                <Label className="text-base font-semibold">Documento de Información del Evento</Label>
                <p className="text-sm text-muted-foreground">
                    Cargue un documento PDF con toda la información relevante, costos adicionales, reglamentos y cronograma del evento.
                </p>
                <div
                    className={cn(
                        "mt-4 rounded-md border-2 border-dashed p-8 flex flex-col items-center justify-center space-y-4 transition-colors relative min-h-[200px]",
                        isDragging
                            ? "border-teal-500 bg-teal-50/50 dark:bg-teal-900/20"
                            : "border-teal-200 dark:border-teal-900 bg-muted/10",
                        file ? "border-teal-400 bg-teal-50/10" : ""
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className={cn(
                        "p-4 rounded-full transition-colors",
                        isDragging ? "bg-teal-100 dark:bg-teal-800/50" : "bg-teal-50 dark:bg-teal-900/30",
                        file ? "bg-transparent p-0 hidden" : ""
                    )}>
                        {!file && <FileText className={cn("h-8 w-8", isDragging ? "text-teal-700 dark:text-teal-300" : "text-teal-600 dark:text-teal-400")} />}
                    </div>

                    {!file ? (
                        <>
                            <div className="space-y-2 text-center relative z-10 pointer-events-none">
                                <p className="text-sm font-medium">Arrastre un archivo PDF aquí o haga clic para seleccionar</p>
                                <p className="text-xs text-muted-foreground">Solo archivos .pdf hasta 10MB</p>
                            </div>
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                onChange={handleFileChange}
                            />
                        </>
                    ) : (
                        <div className="relative w-full max-w-[400px] z-30">
                            <div className="p-4 bg-white dark:bg-zinc-950 rounded-lg border border-teal-200 dark:border-teal-800 flex items-center justify-between shadow-sm group">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="p-2 bg-teal-50 dark:bg-teal-900/40 rounded-md">
                                        <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
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
                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                <Button type="button" variant="outline" onClick={removeFile} disabled={!file || uploading}>
                    Cancelar
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white" disabled={!file || uploading}>
                    {uploading ? "Subiendo..." : "Guardar Archivo"}
                </Button>
            </div>
        </form>
    )
}
