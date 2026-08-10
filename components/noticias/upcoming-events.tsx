"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { MapPin, Award, Loader2, Calendars } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getEventos, EventosConfiguradosItem } from "@/lib/evento-service";
import dynamic from "next/dynamic";
import { DownloadPdfButton } from "./download-pdf-button";

const EventDetailsDialog = dynamic(() => import("./event-details-dialog").then(mod => mod.EventDetailsDialog), {
    ssr: false,
});
const FullCalendarDialog = dynamic(() => import("./full-calendar-dialog").then(mod => mod.FullCalendarDialog), {
    ssr: false,
});

export function UpcomingEvents() {
    const [events, setEvents] = useState<EventosConfiguradosItem[]>([]);
    const [allEvents, setAllEvents] = useState<EventosConfiguradosItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<EventosConfiguradosItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFullCalendarOpen, setIsFullCalendarOpen] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEventos();
                setAllEvents(data.Eventos_configurados);
                // Tomamos los primeros 9 eventos configurados para la sección destacada
                setEvents(data.Eventos_configurados.slice(0, 9));
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleEventClick = (event: EventosConfiguradosItem) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
            const month = monthNames[date.getMonth()];
            return { day, month };
        } catch (e) {
            return { day: "??", month: "???" };
        }
    };

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse text-sm font-medium tracking-wide">Cargando eventos...</p>
            </div>
        );
    }

    if (events.length === 0) {
        return null; // Or show a "No events found" message
    }

    return (
        <TooltipProvider>
            <section className="py-12 space-y-8">
                <div className="flex flex-col gap-1">
                    <h3 className="text-3xl font-extrabold tracking-tight flex items-center justify-start gap-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        <Calendars className="text-primary w-7 h-7 text-teal-700 dark:text-teal-400" /> Próximos <span className="font-serif italic font-normal text-teal-600 dark:text-teal-400">Eventos</span>
                    </h3>
                    <p className="text-muted-foreground">No te pierdas de las actividades más importantes del calendario.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event, index) => {
                        const { day, month } = formatDate(event.F_ini_evento);
                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    onClick={() => handleEventClick(event)}
                                    className="flex flex-row overflow-hidden border-none bg-primary/5 hover:bg-primary/10 transition-colors shadow-none cursor-pointer group h-full"
                                >
                                    {/* Date Column */}
                                    <div className="flex flex-col items-center justify-center w-24 bg-primary text-primary-foreground p-4 text-center shrink-0">
                                        <span className="text-3xl font-black">{day}</span>
                                        <span className="text-sm font-bold tracking-widest">{month}</span>
                                    </div>

                                    {/* Info Column */}
                                    <CardContent className="flex flex-col justify-center p-6 space-y-3 flex-1 overflow-hidden">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 h-[3rem]">
                                                    {event.Nombre}
                                                </h4>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="max-w-[300px] text-center">
                                                {event.Nombre}
                                            </TooltipContent>
                                        </Tooltip>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{event.Lugar}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                                                <Award className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">Modalidad: {event.Modalidad}</span>
                                            </div>
                                            <DownloadPdfButton eventId={event.id} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setIsFullCalendarOpen(true)}
                        className="rounded-full px-12 border-primary/20 hover:border-primary"
                    >
                        Ver calendario completo
                    </Button>
                </div>

                <Suspense fallback={null}>
                    <EventDetailsDialog
                        event={selectedEvent}
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                    />
                    <FullCalendarDialog
                        open={isFullCalendarOpen}
                        onOpenChange={setIsFullCalendarOpen}
                        events={allEvents}
                        onEventClick={handleEventClick}
                    />
                </Suspense>
            </section>
        </TooltipProvider>
    );
}

