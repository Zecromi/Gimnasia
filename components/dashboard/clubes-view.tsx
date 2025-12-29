"use client"

import { Suspense, lazy, useEffect, useState } from "react"
import { Search } from "lucide-react"

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

import { getClubs, ViewClubGral } from "@/lib/club-service"
import { columns } from "./clubes-columns"
import { DataTable } from "./data-table"
const ClubDialog = lazy(() => import("./club-dialog").then(module => ({ default: module.ClubDialog })))

export function ClubesView() {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<ViewClubGral[]>([])

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await getClubs()
                if (response && response.View_Club_gral) {
                    setData(response.View_Club_gral)
                }
            } catch (error) {
                console.error("Error fetching clubs:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchClubs()
    }, [])
    // ... existing render code, replacing clubesData with data ...
    if (isLoading) {
        // ...
    }

    return (
        <div className="space-y-6">
            <Card className="rounded-2xl border-none shadow-none bg-gray-50 dark:bg-zinc-900">
                <CardHeader className="pt-2 pb-0">
                    <CardTitle>
                        <h2 className="text-lg font-bold">Clubes</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-11">
                            <div className="grid gap-4">
                                {/* Row 1 */}
                                <div className="grid gap-3 md:grid-cols-12">
                                    <InputGroup label="Nombre de club :" htmlFor="club" className="md:col-span-5">
                                        <Input id="club" placeholder="" className="h-8" />
                                    </InputGroup>
                                    <InputGroup label="Asociación :" className="md:col-span-3">
                                        <Input value="ESTADO DE MÉXICO" disabled className="bg-muted/50 h-8" />
                                    </InputGroup>

                                    <InputGroup label="Estatus :" htmlFor="estatus" className="md:col-span-3">
                                        <Select defaultValue="todos">
                                            <SelectTrigger id="estatus">
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
                                    <InputGroup label="Email :" htmlFor="email" className="md:col-span-5">
                                        <Input id="email" placeholder="" className="h-8" />
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
                            <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
                                <ClubDialog />
                            </Suspense>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
