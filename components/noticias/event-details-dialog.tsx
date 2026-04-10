"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    CalendarDays,
    MapPin,
    Users,
    Ticket,
    Award,
    Info,
    Building2,
    Globe2,
    Clock,
    UserCircle,
    FileDown,
    Loader2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventosConfiguradosItem, getArchivosEvento } from "@/lib/evento-service";

import { useTheme } from "next-themes";
import { MODALITIES_DATA } from "@/lib/constants/modalities";

interface EventDetailsDialogProps {
    event: EventosConfiguradosItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EventDetailsDialog({ event, open, onOpenChange }: EventDetailsDialogProps) {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = (theme === 'system' ? resolvedTheme : theme) || 'dark';

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfLoading, setPdfLoading] = useState(false);

    useEffect(() => {
        if (!open || !event) {
            setPdfUrl(null);
            return;
        }
        const fetchPdf = async () => {
            try {
                setPdfLoading(true);
                const data = await getArchivosEvento(String(event.id_Evento ?? event.id), "1");
                // The API may return the URL directly or nested inside `archivo`
                const url = data?.url ?? data?.archivo?.url ?? null;
                setPdfUrl(url);
            } catch {
                setPdfUrl(null);
            } finally {
                setPdfLoading(false);
            }
        };
        fetchPdf();
    }, [open, event]);

    if (!event) return null;

    // Normalizar texto para mejor emparejamiento (quitando acentos y espacios extra)
    const normalize = (text: string) =>
        text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const modalityObj = MODALITIES_DATA.find(m => {
        const modalityName = normalize(event.Modalidad);
        const mTitle = normalize(m.title);
        const mId = normalize(m.id);
        return modalityName.includes(mId) || mTitle.includes(modalityName) || modalityName.includes(mTitle);
    });

    const activeColor = modalityObj
        ? (currentTheme === 'dark' ? modalityObj.color.dark : modalityObj.color.light)
        : null;

    const formatDate = (dateString: string) => {
        if (!dateString) return "No definida";
        try {
            return new Date(dateString).toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] p-0 flex flex-col overflow-hidden border-none shadow-2xl">
                <DialogHeader
                    className="p-8 text-white relative transition-colors duration-500"
                    style={{
                        background: activeColor
                            ? `linear-gradient(45deg, ${activeColor}, ${activeColor}dd)`
                            : 'var(--primary)'
                    }}
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-1">
                            <Badge
                                variant="outline"
                                className="bg-white/20 text-white border-white/40 backdrop-blur-md mb-2 px-3 py-1 text-xs font-bold uppercase tracking-wider"
                            >
                                {event.Modalidad}
                            </Badge>
                            <DialogTitle className="text-3xl font-black leading-tight tracking-tight drop-shadow-md">
                                {event.Nombre}
                            </DialogTitle>
                            <DialogDescription className="text-white/90 font-medium drop-shadow-sm">
                                {event.Organizador} - {event.Asociacion}
                            </DialogDescription>
                        </div>
                        <div className="hidden sm:flex flex-col items-center bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0 text-white shadow-lg">
                            <CalendarDays className="h-6 w-6 mb-1" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Evento</span>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="h-[400px] md:h-[500px] w-full">
                    <div className="p-8 space-y-8">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                                <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ubicación</p>
                                    <p className="font-semibold">{event.Lugar}</p>
                                    <p className="text-sm text-muted-foreground italic">{event.Sede} ({event.Region})</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                                <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                                    <FileDown className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Detalles del evento</p>
                                    {pdfLoading ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Buscando documento...</span>
                                        </div>
                                    ) : pdfUrl ? (
                                        <a
                                            href={pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-1.5 rounded-full text-xs hover:scale-105 transition-all shadow-md"
                                        >
                                            <FileDown className="h-3.5 w-3.5" />
                                            Descargar PDF
                                        </a>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No disponible</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-primary/10" />

                        {/* Details Section */}
                        <div className="space-y-6">
                            <h5 className="font-bold text-xl flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                Detalles e Inscripciones
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CalendarDays className="h-5 w-5 text-primary shrink-0" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Inicio del evento</p>
                                            <p className="text-sm font-medium">{formatDate(event.F_ini_evento)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-primary shrink-0" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Fin del evento</p>
                                            <p className="text-sm font-medium">{formatDate(event.F_fin_evento)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                                        <Clock className="h-5 w-5 shrink-0" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold uppercase opacity-80">Cierre de inscripciones</p>
                                            <p className="text-sm font-bold">
                                                {formatDate(event.F_fin_incripciones)} a las {event.Hora_limite_inscripciones}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="h-5 w-5 text-primary shrink-0" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Cupo limitado</p>
                                            <p className="text-sm font-medium">
                                                {event.Limite_participantes || "Sin límite"} participantes
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {event.Restriccion && (
                            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-5">
                                <p className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase mb-2 tracking-widest">Información Adicional / Restricciones</p>
                                <p className="text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed font-semibold">
                                    {event.Restriccion}
                                </p>
                            </div>
                        )}

                        <div className="pt-2">
                            <p className="text-[10px] text-muted-foreground font-medium italic">
                                * Toda inscripción debe ser gestionada a través del sistema oficial de la Asociación por los clubes afiliados.
                            </p>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-6 bg-muted/20 border-t flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${event.Status === "ACTIVO" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                        <span className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Estado: {event.Status}</span>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="bg-primary text-primary-foreground font-bold px-8 py-2 rounded-full text-sm hover:scale-105 transition-all shadow-md"
                    >
                        Entendido
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
