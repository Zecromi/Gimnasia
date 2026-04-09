"use client";

import React from "react";
import { useTheme } from "next-themes";
import { ModalityData } from "@/lib/constants/modalities";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ModalityDialogProps {
    modality: ModalityData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ModalityDialog({ modality, open, onOpenChange }: ModalityDialogProps) {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = (theme === 'system' ? resolvedTheme : theme) || 'dark';

    if (!modality) return null;

    const activeColor = currentTheme === "dark" ? modality.color.dark : modality.color.light;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="!w-[90vw] !max-w-[90vw] h-[80vh] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-xl flex flex-col"
                onPointerDown={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{modality.title}</DialogTitle>
                    <DialogDescription>
                        Información detallada sobre la modalidad de {modality.title} de la Asociación de Gimnasia.
                    </DialogDescription>
                </DialogHeader>

                {/* Header visual con color dinámico */}
                <div
                    className="h-32 md:h-48 relative flex items-end p-6 md:p-10"
                    style={{
                        background: `linear-gradient(45deg, ${activeColor}, ${activeColor}dd)`
                    }}
                >
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="relative z-10 w-full flex justify-between items-end">
                        <div className="space-y-1">
                            <Badge variant="outline" className="bg-white/20 text-white border-white/40 backdrop-blur-sm uppercase tracking-widest text-[10px] font-bold">
                                Asociación de Gimnasia
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                                {modality.title}
                            </h2>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 md:p-10 space-y-10">
                        {/* Descripción */}
                        <div className="grid md:grid-cols-5 gap-8">
                            <div className="md:col-span-3 space-y-6">
                                <div className="space-y-4">
                                    <h5
                                        className="text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                                        style={{ color: activeColor }}
                                    >
                                        <span className="w-8 h-[2px] rounded-full" style={{ backgroundColor: activeColor }} />
                                        Sobre esta modalidad
                                    </h5>
                                    {modality.description.map((par, i) => (
                                        <p key={i} className="text-muted-foreground text-lg leading-relaxed first-letter:text-2xl first-letter:font-bold">
                                            {par}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Info rápida / Highlights */}
                            <div className="md:col-span-2 space-y-6 bg-muted/50 p-6 rounded-2xl border border-muted-foreground/10 self-start">
                                <h5 className="font-bold text-sm uppercase tracking-wider text-foreground">Detalles Destacados</h5>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: activeColor }} />
                                        <span className="text-sm text-muted-foreground">Desarrollo nacional e internacional constante.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: activeColor }} />
                                        <span className="text-sm text-muted-foreground">Representación en Campeonatos Mundiales.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: activeColor }} />
                                        <span className="text-sm text-muted-foreground">Formación técnica de alto nivel.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Galería de fotos */}
                        <div className="space-y-6">
                            <h5
                                className="text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                                style={{ color: activeColor }}
                            >
                                <span className="w-8 h-[2px] rounded-full" style={{ backgroundColor: activeColor }} />
                                Galería Visual
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {modality.photos.length > 0 ? (
                                    modality.photos.map((photo, i) => (
                                        <div
                                            key={i}
                                            className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer border border-muted-foreground/10"
                                        >
                                            <Image
                                                src={photo}
                                                alt={`${modality.title} - Foto ${i + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                <span className="text-white text-xs font-medium uppercase tracking-wider">Ver imagen completa</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // 3 Placeholder cards when no photos exist
                                    [...Array(3)].map((_, i) => (
                                        <div
                                            key={`placeholder-${i}`}
                                            className="aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex items-center justify-center group hover:bg-muted/40 transition-colors"
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity"
                                                style={{ borderColor: activeColor + '40' }}
                                            >
                                                <div
                                                    className="w-1 h-1 rounded-full bg-muted-foreground"
                                                    style={{ backgroundColor: activeColor }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
