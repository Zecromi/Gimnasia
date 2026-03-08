"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hammer, Info } from "lucide-react";

interface NewsDetailDialogProps {
    news: {
        title: string;
        category: string;
    } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewsDetailDialog({ news, open, onOpenChange }: NewsDetailDialogProps) {
    if (!news) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-none shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
                        <Hammer className="h-8 w-8 text-primary animate-bounce" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-center tracking-tight">
                        Funcionalidad en construcción
                    </DialogTitle>
                    <DialogDescription className="text-center font-medium">
                        {news.title}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-32 w-full pr-4">
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Estamos trabajando para brindarte una experiencia completa. Muy pronto podrás leer la nota completa, ver galerías de fotos y descargar documentos técnicos relacionados con esta noticia.
                        </p>
                        <div className="flex items-center gap-2 bg-accent/50 px-4 py-2 rounded-lg border border-accent">
                            <Info className="h-4 w-4 text-primary" />
                            <span className="text-xs font-semibold uppercase tracking-widest">Próximamente</span>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="w-full rounded-full font-bold transition-all hover:scale-105"
                    >
                        Entendido
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
