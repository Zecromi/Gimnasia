"use client"

import { Suspense, useState } from "react"
import { Search, Calendar as CalendarIcon, Plus } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { columns, EventoInscripcion } from "./inscripciones-columns"
import { DataTable } from "@/components/dashboard/data-table"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function InscripcionesEventosView() {
    const [date, setDate] = useState<Date>()
    const [eventos] = useState<EventoInscripcion[]>([])
    // Estado para manejo de errores de carga (simulado por ahora)
    const [error] = useState<string | null>(null)

    return (
        <div className="space-y-6" >
            <Card className="rounded-2xl border-none shadow-none bg-gray-50 dark:bg-zinc-900">
                <CardHeader className="pt-2 pb-0">
                    <CardTitle>
                        <h2 className="text-lg font-bold">Inscripciones de eventos</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                    <div className="flex flex-col xl:grid xl:grid-cols-12 gap-4">
                        <div className="xl:col-span-11">
                            <div className="grid gap-4">
                                {/* Row 1 */}
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
                                    <InputGroup label="No. Evento :" htmlFor="no-evento">
                                        <Input id="no-evento" className="h-8" />
                                    </InputGroup>
                                    <InputGroup label="Modalidad :">
                                        <Select>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Pirámide :">
                                        <Select>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Organizador :">
                                        <Select>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                </div>

                                {/* Row 2 */}
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
                                    <InputGroup label="Tipo de evento :">
                                        <Select>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Región de evento :">
                                        <Select>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todas">Todas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Fecha de evento :">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full h-8 pl-3 text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    {date ? (
                                                        format(date, "P", { locale: es })
                                                    ) : (
                                                        <span>Seleccionar fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    locale={es}
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </InputGroup>
                                    <div>
                                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white h-8">
                                            <Search className="mr-2 h-4 w-4" />
                                            Filtrar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {error ? (
                <div className="text-center p-10 text-red-500">
                    <p>Error al cargar los datos. Por favor intente nuevamente o recargue la página.</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={eventos}
                    noResultsMessage="No existen registros de eventos"
                />
            )}
        </div >
    )
}
