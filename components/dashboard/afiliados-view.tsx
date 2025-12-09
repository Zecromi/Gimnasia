"use client"

import { useEffect, useState } from "react"
import { Search, Plus } from "lucide-react"

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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { columns } from "./afiliados-columns"
import { DataTable } from "./data-table"
import afiliadosData from "./afiliados-data.json"

export function AfiliadosView() {
    const [isLoading, setIsLoading] = useState(true)

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
                            <h2 className="text-lg font-bold">Afiliados</h2>
                            <Skeleton className="h-8 w-48 mt-2" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Skeleton className="h-32 rounded-xl" />
                                <Skeleton className="h-32 rounded-xl" />
                                <Skeleton className="h-32 rounded-xl" />
                                <Skeleton className="h-32 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
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
                        <h2 className="text-lg font-bold">Afiliados</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-11">
                            <div className="grid gap-4">
                                {/* Row 1 */}
                                <div className="grid gap-3 md:grid-cols-12">
                                    <InputGroup label="Afiliado :" htmlFor="afiliado" className="md:col-span-5">
                                        <Input id="afiliado" placeholder="" className="h-8" />
                                    </InputGroup>
                                    <InputGroup label="Asociación :" className="md:col-span-3">
                                        <Input value="ESTADO DE MÉXICO" disabled className="bg-muted/50 h-8" />
                                    </InputGroup>
                                    <InputGroup label="Club :" htmlFor="club" className="md:col-span-2">
                                        <Select>
                                            <SelectTrigger id="club" size="sm">
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                                <SelectItem value="club1">Club 1</SelectItem>
                                                <SelectItem value="club2">Club 2</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                    <InputGroup label="Estatus :" htmlFor="estatus" className="md:col-span-2">
                                        <Select defaultValue="todos">
                                            <SelectTrigger id="estatus" size="sm">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                                <SelectItem value="alta">Alta</SelectItem>
                                                <SelectItem value="baja">Baja</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                </div>

                                {/* Row 2 */}
                                <div className="grid gap-3 md:grid-cols-12 items-end">
                                    <InputGroup label="No. Afiliado :" htmlFor="no-afiliado" className="md:col-span-5">
                                        <Input id="no-afiliado" placeholder="" className="h-8" />
                                    </InputGroup>
                                    <InputGroup label="CURP :" htmlFor="curp" className="md:col-span-5">
                                        <Input id="curp" placeholder="" className="h-8" />
                                    </InputGroup>
                                    <div className="md:col-span-2 flex justify-end">
                                        <Button className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white h-8">
                                            <Search className="mr-2 h-4 w-4" />
                                            Filtrar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 flex items-center justify-center border-l pl-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                                            <Plus className="h-6 w-6" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Nuevo Afiliado</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <DataTable columns={columns} data={afiliadosData as any} />
        </div>
    )
}
