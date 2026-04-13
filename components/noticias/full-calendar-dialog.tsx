"use client";

import React, { useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventosConfiguradosItem } from "@/lib/evento-service";
import { Search, CalendarDays, MapPin, Ticket, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FullCalendarDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    events: EventosConfiguradosItem[];
    onEventClick: (event: EventosConfiguradosItem) => void;
}

export function FullCalendarDialog({ open, onOpenChange, events, onEventClick }: FullCalendarDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEvents = useMemo(() => {
        if (!searchQuery) return events;
        const query = searchQuery.toLowerCase();
        return events.filter(e => 
            e.Nombre?.toLowerCase().includes(query) ||
            e.Modalidad?.toLowerCase().includes(query) ||
            e.Lugar?.toLowerCase().includes(query)
        );
    }, [events, searchQuery]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            return { day, month, year };
        } catch (e) {
            return { day: "??", month: "???", year: "????" };
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0 border-none shadow-2xl">
                <DialogHeader className="p-6 bg-muted/30 border-b space-y-4">
                    <div>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <CalendarDays className="h-6 w-6 text-primary" />
                            Calendario Completo de Eventos
                        </DialogTitle>
                        <DialogDescription className="mt-1">
                            Explora y encuentra los próximos eventos de gimnasia programados.
                        </DialogDescription>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por nombre, modalidad o lugar..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-full bg-background border-primary/20 focus-visible:ring-primary/30"
                        />
                    </div>
                </DialogHeader>

                <ScrollArea className="h-[60vh] min-h-[400px] w-full p-6">
                    {filteredEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <CalendarDays className="h-12 w-12 opacity-20 mb-4" />
                            <p>No se encontraron eventos que coincidan con tu búsqueda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredEvents.map(event => {
                                const { day, month, year } = formatDate(event.F_ini_evento);
                                return (
                                    <div 
                                        key={event.id}
                                        onClick={() => {
                                            onEventClick(event);
                                        }}
                                        className="group flex flex-col sm:flex-row bg-card border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex sm:flex-col items-center justify-center bg-primary/10 text-primary p-4 min-w-[90px] border-b sm:border-b-0 sm:border-r border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <span className="text-2xl sm:text-3xl font-black leading-none">{day}</span>
                                            <span className="text-sm font-bold uppercase tracking-wider">{month}</span>
                                            <span className="text-xs opacity-80">{year}</span>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="font-bold text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                        {event.Nombre}
                                                    </h4>
                                                    <Badge variant="outline" className="text-[10px] shrink-0 border-primary/20 text-primary">
                                                        {event.Modalidad}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 mt-2">
                                                    <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                        <span className="truncate">{event.Lugar}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                                                        <Ticket className="h-3.5 w-3.5 shrink-0" />
                                                        <span>{event.Costo_base === "0" || !event.Costo_base ? "Sin costo" : `$${event.Costo_base}`}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex items-center justify-center pr-4 text-muted-foreground group-hover:text-primary transition-colors">
                                            <ChevronRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-4 border-t bg-muted/20 text-center text-xs text-muted-foreground">
                    Mostrando {filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventos'}
                </div>
            </DialogContent>
        </Dialog>
    );
}
