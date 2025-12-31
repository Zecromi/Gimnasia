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

    // Filtering states
    const [inputClub, setInputClub] = useState("")
    const [inputEmail, setInputEmail] = useState("")

    // Active filters
    const [searchClub, setSearchClub] = useState("")
    const [searchEmail, setSearchEmail] = useState("")
    const [statusFilter, setStatusFilter] = useState("todos")

    const fetchClubs = async () => {
        setIsLoading(true)
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

    useEffect(() => {
        fetchClubs()
    }, [])

    const handleSearch = () => {
        setSearchClub(inputClub)
        setSearchEmail(inputEmail)
    }

    const filteredData = data.filter((item) => {
        // Status Filter
        if (statusFilter === "alta" && !item.Estatus) return false
        if (statusFilter === "baja" && item.Estatus) return false

        // Club Name Filter
        if (searchClub && !item.Club?.toLowerCase().includes(searchClub.toLowerCase())) {
            return false
        }

        // Email Filter
        if (searchEmail && !item.Email?.toLowerCase().includes(searchEmail.toLowerCase())) {
            return false
        }

        return true
    })

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card className="rounded-2xl border-none shadow-none bg-gray-50">
                    <CardHeader className="pt-2 pb-0">
                        <Skeleton className="h-8 w-[200px]" />
                    </CardHeader>
                    <CardContent className="pt-0 pb-2">
                        <div className="grid gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
                <div className="rounded-md border p-4 bg-white">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        )
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
                                        <Input
                                            id="club"
                                            placeholder=""
                                            className="h-8"
                                            value={inputClub}
                                            onChange={(e) => setInputClub(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleSearch()
                                            }}
                                        />
                                    </InputGroup>
                                    <InputGroup label="Asociación :" className="md:col-span-3">
                                        <Input value="ESTADO DE MÉXICO" disabled className="bg-muted/50 h-8" />
                                    </InputGroup>

                                    <InputGroup label="Estatus :" htmlFor="estatus" className="md:col-span-3">
                                        <Select
                                            defaultValue="todos"
                                            value={statusFilter}
                                            onValueChange={setStatusFilter}
                                        >
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
                                        <Input
                                            id="email"
                                            placeholder=""
                                            className="h-8"
                                            value={inputEmail}
                                            onChange={(e) => setInputEmail(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleSearch()
                                            }}
                                        />
                                    </InputGroup>

                                    <div className="md:col-span-3 md:col-start-9 flex justify-end">
                                        <Button
                                            className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white h-8"
                                            onClick={handleSearch}
                                        >
                                            <Search className="mr-2 h-4 w-4" />
                                            Buscar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 flex items-center justify-center border-l pl-4">
                            <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
                                <ClubDialog onClubCreated={fetchClubs} />
                            </Suspense>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <DataTable columns={columns} data={filteredData} />
        </div>
    )
}
