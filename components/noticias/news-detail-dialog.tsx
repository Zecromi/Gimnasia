"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, X, ZoomIn, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getImagenGalUrl } from "@/lib/noticias-service";

interface NewsDetailDialogProps {
    news: {
        id?: number;
        title: string;
        date?: string;
        description?: string;
        content?: string;
        category: string;
        image?: string;
    } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function GalleryImage({ src, alt, onClick, className }: { src: string; alt: string; onClick: () => void; className?: string }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div 
            onClick={onClick}
            className={cn(
                "relative overflow-hidden rounded-2xl bg-muted border border-border/40 shadow-inner group cursor-pointer w-full h-full",
                className
            )}
        >
            {!loaded && (
                <Skeleton className="absolute inset-0 w-full h-full bg-muted/60 animate-pulse" />
            )}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                    loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/logo-gimnasios.png";
                    setLoaded(true);
                }}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-all duration-305 flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-black/60 border border-white/10 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ZoomIn className="h-3.5 w-3.5" />
                    Ampliar
                </span>
            </div>
        </div>
    );
}

const GALLERY_IMAGE_COUNT = 5;

export function NewsDetailDialog({ news, open, onOpenChange }: NewsDetailDialogProps) {
    const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [isLoadingGallery, setIsLoadingGallery] = useState(false);

    // Fetch gallery images from /Obt_img_gal when dialog opens
    useEffect(() => {
        if (open && news?.id) {
            setIsLoadingGallery(true);
            setGalleryImages([]);

            const urls = Array.from({ length: GALLERY_IMAGE_COUNT }, (_, i) =>
                getImagenGalUrl(news.id!, i + 1)
            );

            const checks = urls.map(
                (url) =>
                    new Promise<string | null>((resolve) => {
                        const img = new window.Image();
                        img.onload = () => resolve(url);
                        img.onerror = () => resolve(null);
                        img.src = url;
                    })
            );

            Promise.all(checks).then((results) => {
                setGalleryImages(results.filter((url): url is string => url !== null));
                setIsLoadingGallery(false);
            });
        }
    }, [open, news?.id]);

    if (!news) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                {/* The dialog content is wide enough for good reading and borderless */}
                <DialogContent
                    className="max-w-5xl w-[95vw] sm:w-[90vw] h-[85vh] p-0 border-none shadow-2xl bg-background overflow-hidden flex flex-col [&>button]:hidden"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    {/* Custom absolute close button */}
                    <div className="absolute top-3 right-3 z-50">
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all shadow-md"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Cerrar Noticia</span>
                        </Button>
                    </div>

                    {/* Visual Header with Image */}
                    <div 
                        className="w-full shrink-0 h-40 sm:h-56 relative bg-muted cursor-zoom-in group overflow-hidden"
                        onClick={() => setActiveImageUrl(news.image ?? "/logo-gimnasios.png")}
                    >
                        <img
                            src={news.image ?? "/logo-gimnasios.png"}
                            alt={news.title}
                            className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/logo-gimnasios.png";
                            }}
                        />
                        {/* Gradient overlay for text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        
                        {/* Hover Overlay for zooming main banner */}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-1.5 shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                                <ZoomIn className="h-4 w-4" />
                                Ampliar Portada
                            </span>
                        </div>

                        <div className="absolute bottom-4 left-6 flex items-center gap-2 z-10">
                            <Badge className="bg-primary/90 text-primary-foreground hover:bg-primary/90 border-none px-3 py-1 font-semibold tracking-wide">
                                {news.category}
                            </Badge>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-1 min-h-0">
                        {/* Scrollable entire body content (including header and gallery) */}
                        <ScrollArea className="flex-1 w-full pr-2">
                            <div className="space-y-8 pb-4">
                                <DialogHeader className="space-y-3 shrink-0">
                                    <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight text-left">
                                        {news.title}
                                    </DialogTitle>
                                    <DialogDescription asChild>
                                        {/* Force it to render visually distinct without throwing hydration errors */}
                                        {news.date ? (
                                            <div className="flex items-center text-sm text-muted-foreground gap-2 font-medium">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                {news.date}
                                            </div>
                                        ) : <span />}
                                    </DialogDescription>

                                    {/* Resumen section explicitly rendered underneath the title */}
                                    {news.description && (
                                        <div className="mt-4 border-l-4 border-primary pl-4 py-1.5 bg-primary/5 rounded-r-lg">
                                            <p className="text-base sm:text-lg font-medium italic text-muted-foreground leading-relaxed">
                                                {news.description}
                                            </p>
                                        </div>
                                    )}
                                </DialogHeader>

                                <div className="text-base md:text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                    {/* Show 'content' here */}
                                    {news.content}
                                </div>

                                {/* Galería de Imágenes */}
                                <div className="border-t border-border/40 pt-6">
                                    <h3 className="text-lg font-semibold tracking-tight text-foreground/95 mb-4 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                        Galería del Evento
                                    </h3>
                                    
                                    {isLoadingGallery ? (
                                        <div className="flex flex-col items-center justify-center py-10 px-4 gap-3">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <p className="text-sm font-medium text-muted-foreground">Cargando galería...</p>
                                        </div>
                                    ) : galleryImages.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[180px] sm:auto-rows-[220px]">
                                            {galleryImages.map((src, index) => (
                                                <div key={index} className={index === 0 ? "col-span-2 md:col-span-2 md:row-span-2" : ""}>
                                                    <GalleryImage
                                                        src={src}
                                                        alt={`Imagen de galería ${index + 1}`}
                                                        onClick={() => setActiveImageUrl(src)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-dashed border-border/40 bg-muted/10 text-center space-y-2">
                                            <span className="text-3xl opacity-50">📷</span>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Esta noticia no cuenta con galería de imágenes del evento.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Lightbox Dialog */}
            <Dialog open={!!activeImageUrl} onOpenChange={(open) => !open && setActiveImageUrl(null)}>
                <DialogContent 
                    showCloseButton={false}
                    overlayClassName="bg-black/90 backdrop-blur-md z-[60]"
                    className="max-w-[95vw] max-h-[95vh] md:max-w-5xl p-0 bg-transparent border-none shadow-none flex items-center justify-center z-[70] outline-none select-none [&>button]:hidden animate-in fade-in-0 zoom-in-95 duration-200"
                >
                    {/* Screen reader only headers for Radix Dialog compliance */}
                    <DialogHeader className="sr-only">
                        <DialogTitle>Imagen ampliada</DialogTitle>
                        <DialogDescription>
                            Vista a pantalla completa de la imagen seleccionada de la noticia
                        </DialogDescription>
                    </DialogHeader>

                    {activeImageUrl && (
                        <div 
                            className="relative w-full h-full flex items-center justify-center p-4 cursor-zoom-out"
                            onClick={() => setActiveImageUrl(null)}
                        >
                            <img
                                src={activeImageUrl}
                                alt="Imagen ampliada"
                                className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-305 animate-in zoom-in-95"
                            />
                            {/* Visual floating close indicator */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImageUrl(null);
                                }}
                                className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/85 text-white border border-white/10 p-2.5 transition-all shadow-lg hover:scale-105"
                            >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Cerrar vista ampliada</span>
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
