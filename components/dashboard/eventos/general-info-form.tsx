"use clock" // ignore
"use client"

import * as React from "react"
import { Clock, Trophy, Globe, User, Building2, Users, MapPin, CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EventosConfiguradosItem as Evento } from "@/lib/evento-service"

export function GeneralInfoForm({ id, evento }: { id: string, evento: Evento }) {
    return (
        <div className="space-y-8 px-2">
            {/* Header / Status & Main Date */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-muted/50 p-4 rounded-lg border border-dashed border-teal-200 dark:border-teal-900">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-teal-700 dark:text-teal-400">
                        {evento.Nombre}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <span className="font-semibold mr-2 text-foreground">No. Evento:</span>
                        {evento.id_Evento}
                    </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                    <Badge variant={evento.Status === 'Abierto' ? 'default' : 'secondary'} className={`${evento.Status === 'Abierto' ? 'bg-teal-600 hover:bg-teal-700' : ''} text-base px-4 py-1`}>
                        {evento.Status}
                    </Badge>
                    <div className="flex items-center text-sm font-medium">
                        <Clock className="w-4 h-4 mr-2 text-teal-600" />
                        <span>Inscripción hasta: {evento.Hora_limite_inscripciones}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1: Core Details */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground border-b pb-2 mb-4">Detalles del Evento</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                                    <Trophy className="w-3.5 h-3.5 mr-1.5" />
                                    Tipo
                                </p>
                                <p className="font-medium mt-1">Competencia</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                                    Región
                                </p>
                                <p className="font-medium mt-1">{evento.Region}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                                    <User className="w-3.5 h-3.5 mr-1.5" />
                                    Organizador
                                </p>
                                <p className="font-medium mt-1">{evento.Organizador}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                                    <Building2 className="w-3.5 h-3.5 mr-1.5" />
                                    Asociación
                                </p>
                                <p className="font-medium mt-1">{evento.Asociacion}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center">
                                <Users className="w-3.5 h-3.5 mr-1.5" />
                                Límite de participantes
                            </p>
                            <Badge variant="outline" className="mt-1 border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-950/30">
                                {evento.Limite_participantes === 0 ? "Ilimitado" : evento.Limite_participantes}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Column 2: Dates & Location */}
                <div className="space-y-6">
                    {/* Location */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground border-b pb-2 mb-4">Ubicación</h4>
                        <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-md">
                            <MapPin className="w-5 h-5 text-teal-600 mt-0.5" />
                            <div>
                                <p className="font-semibold">{evento.Sede}</p>
                                <p className="text-sm text-muted-foreground">{evento.Lugar}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground border-b pb-2 mb-4">Fechas Importantes</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Fecha de Evento</span>
                                <Badge variant="outline" className="flex gap-2 py-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {evento.F_ini_evento.split('T')[0]}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Inicio Inscripción</span>
                                <Badge variant="outline" className="flex gap-2 py-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {evento.F_ini_incripciones.split('T')[0]}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Fin Inscripción</span>
                                <Badge variant="outline" className="flex gap-2 py-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {evento.F_fin_incripciones.split('T')[0]}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
