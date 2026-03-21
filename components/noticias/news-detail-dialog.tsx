"use client";

import React from "react";
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
import { Calendar, X } from "lucide-react";

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

export function NewsDetailDialog({ news, open, onOpenChange }: NewsDetailDialogProps) {
    if (!news) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* The dialog content is wide enough for good reading and borderless */}
            <DialogContent
                className="max-w-3xl max-h-[90vh] p-0 border-none shadow-2xl bg-background overflow-hidden flex flex-col [&>button]:hidden"
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
                <div className="w-full shrink-0 h-48 sm:h-64 relative bg-muted">
                    <img
                        src={news.image ?? "/logo-gimnasios.png"}
                        alt={news.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/logo-gimnasios.png";
                        }}
                    />
                    {/* Gradient overlay for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-2">
                        <Badge className="bg-primary/90 text-primary-foreground hover:bg-primary/90 border-none px-3 py-1 font-semibold tracking-wide">
                            {news.category}
                        </Badge>
                    </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1 min-h-0">
                    <DialogHeader className="mb-6 space-y-3 shrink-0">
                        <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight text-left">
                            {news.title}
                        </DialogTitle>
                        <DialogDescription asChild>
                            {/* Force it to render visually distinct without throwing hydration errors */}
                            {news.date ? (
                                <div className="flex items-center text-sm text-muted-foreground gap-2 font-medium">
                                    <Calendar className="h-4 w-4" />
                                    {news.date}
                                </div>
                            ) : <span />}
                        </DialogDescription>

                        {/* Resumen section explicitly rendered underneath the title */}
                        {news.description && (
                            <div className="mt-4 border-l-4 border-primary pl-4 py-1">
                                <p className="text-lg md:text-xl font-medium italic text-muted-foreground">
                                    {news.description}
                                </p>
                            </div>
                        )}
                    </DialogHeader>

                    {/* Scrollable textual content */}
                    <ScrollArea className="flex-1 w-full pr-4 pb-4 mt-2">
                        <div className="text-base md:text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {/* Show 'content' here */}
                            {news.content}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
