"use client"

import { useEffect, useState } from "react"
import { Search, CalendarPlus, Calendar as CalendarIcon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { columns } from "./eventos-columns"
import { DataTable } from "../data-table"
import eventosData from "./eventos-data.json"
import { NewEventoDialog } from "./new-evento-dialog"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function EventosView() {
    const [isLoading, setIsLoading] = useState(true)
    const [date, setDate] = useState<Date>()

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card className="rounded-2xl border-none shadow-none">
                    <CardHeader>
                        <CardTitle>
                            <h2 className="text-lg font-bold">Eventos</h2>
                            <Skeleton className="h-8 w-48 mt-2" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card className="rounded-2xl border-none shadow-none bg-gray-50 dark:bg-zinc-900">
                <CardHeader className="pt-2 pb-0">
                    <CardTitle>
                        <h2 className="text-lg font-bold">Eventos</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <div className="col-span-1 lg:col-span-11">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="no-evento">No. Evento :</Label>
                                    <Input id="no-evento" className="bg-white dark:bg-zinc-950" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Modalidad :</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white dark:bg-zinc-950">
                                            <SelectValue placeholder="Seleccione una opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todas">Todas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Pirámide :</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white dark:bg-zinc-950">
                                            <SelectValue placeholder="Seleccione una opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todas">Todas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Organizador :</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white dark:bg-zinc-950">
                                            <SelectValue placeholder="Seleccione una opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tipo de evento :</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white dark:bg-zinc-950">
                                            <SelectValue placeholder="Seleccione una opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Región de evento :</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white dark:bg-zinc-950">
                                            <SelectValue placeholder="Seleccione una opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todas">Todas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label>Fecha de evento :</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full bg-white dark:bg-zinc-950 pl-3 text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                {date ? (
                                                    format(date, "P", { locale: es })
                                                ) : (
                                                    <span>Seleccione una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
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
                                </div>
                                <div className="flex items-end">
                                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                                        <Search className="mr-2 h-4 w-4" />
                                        Filtrar
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 flex items-center justify-center pt-4 lg:col-span-1 lg:border-l lg:pl-4 lg:pt-0 border-t lg:border-t-0">
                            <NewEventoDialog />
                        </div>
                    </div>
                </CardContent>
            </Card>


            <DataTable columns={columns} data={eventosData as any} />
        </div>
    )
}

