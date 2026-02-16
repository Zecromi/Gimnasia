"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Users, Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const events = [
    {
        id: 1,
        title: "Copa Internacional de la Amistad",
        date: { day: "24", month: "NOV" },
        location: "Polideportivo Municipal",
        description: "Competencia abierta para todos los niveles de clubes afiliados.",
        spots: 50,
        price: "$500",
    },
    {
        id: 2,
        title: "Selectivo Panamericano 2027",
        date: { day: "15", month: "DIC" },
        location: "Centro de Alto Rendimiento",
        description: "Evaluación técnica de deportistas de alto rendimiento.",
        spots: 12,
        price: "Sin costo",
    },
    {
        id: 3,
        title: "Taller de Nutrición Deportiva",
        date: { day: "05", month: "ENE" },
        location: "Auditorio Central",
        description: "Charla magistral para padres y atletas sobre alimentación balanceada.",
        spots: 100,
        price: "$150",
    },
];

export function UpcomingEvents() {
    return (
        <section className="py-12 space-y-8">
            <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Próximos Eventos
                </h3>
                <p className="text-muted-foreground">No te pierdas de las actividades más importantes del calendario.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="flex flex-row overflow-hidden border-none bg-primary/5 hover:bg-primary/10 transition-colors shadow-none cursor-pointer group">
                            {/* Date Column */}
                            <div className="flex flex-col items-center justify-center w-24 bg-primary text-primary-foreground p-4 text-center">
                                <span className="text-3xl font-black">{event.date.day}</span>
                                <span className="text-sm font-bold tracking-widest">{event.date.month}</span>
                            </div>

                            {/* Info Column */}
                            <CardContent className="flex flex-col justify-center p-6 space-y-3 flex-1">
                                <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                    {event.title}
                                </h4>
                                <div className="space-y-1.5">
                                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                                        <Users className="h-3.5 w-3.5" />
                                        {event.spots} lugares disponibles
                                    </div>
                                    <div className="flex items-center text-xs text-primary font-bold gap-2">
                                        <Ticket className="h-3.5 w-3.5" />
                                        {event.price}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center pt-4">
                <Button variant="outline" className="rounded-full px-12 border-primary/20 hover:border-primary">
                    Ver calendario completo
                </Button>
            </div>
        </section>
    );
}
