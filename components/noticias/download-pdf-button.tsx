"use client";

import React, { useState } from "react";
import { Loader2, FileDown } from "lucide-react";
import { downloadArchivoEventoPdf } from "@/lib/evento-service";
import { toast } from "sonner";

interface DownloadPdfButtonProps {
    eventId: string | number;
    className?: string;
    text?: string;
    downloadingText?: string;
    iconProps?: { className?: string };
}

export function DownloadPdfButton({ 
    eventId, 
    className,
    text = "Detalle",
    downloadingText = "Descargando...",
    iconProps = { className: "h-3 w-3 shrink-0" }
}: DownloadPdfButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPdf = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setIsDownloading(true);
            const response = await downloadArchivoEventoPdf(String(eventId), "1");

            // Check if the response is actually JSON acting as an error
            const contentType = String(response.headers['content-type'] || '');
            if (contentType.includes('application/json')) {
                const responseText = await response.data.text();
                try {
                    const json = JSON.parse(responseText);
                    if (json.status === false || json.error) {
                        toast.error("El archivo no existe o no está disponible.");
                        return;
                    }
                } catch (err) {
                    // Not valid JSON or handled differently
                }
            }

            if (response.data.size === 0) {
                toast.error("El archivo no existe.");
                return;
            }

            let filename = `Detalles_Evento_${eventId}.pdf`;
            const disposition = response.headers['content-disposition'];
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const utf8FilenameRegex = /filename\*=UTF-8''([^;\n]+)/i;
                const utf8Matches = utf8FilenameRegex.exec(disposition);

                if (utf8Matches != null && utf8Matches[1]) {
                    filename = decodeURIComponent(utf8Matches[1]);
                } else {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Descarga completada");
        } catch (error) {
            console.error(error);
            toast.error("El archivo no existe o hubo un problema al descargarlo");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className={className || "inline-flex items-center justify-center gap-1.5 w-fit mt-1 bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-400 disabled:opacity-70 disabled:cursor-not-allowed font-semibold px-3 py-1.5 rounded-full text-[10px] transition-colors border border-teal-200 dark:border-teal-800"}
        >
            {isDownloading ? (
                <Loader2 className={`animate-spin ${iconProps.className}`} />
            ) : (
                <FileDown className={iconProps.className} />
            )}
            {isDownloading ? downloadingText : text}
        </button>
    );
}
