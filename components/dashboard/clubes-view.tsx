"use client"

import { Suspense, lazy, useEffect, useState, useMemo } from "react"
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
import { useClubStore } from "@/lib/store/club-store"
import { DataTable } from "./data-table"

const ClubDialog = lazy(() => import("./club-dialog").then(module => ({ default: module.ClubDialog })))
const BulkClubMembershipDialog = dynamic(() => import("./bulk-club-membership-dialog").then(module => module.BulkClubMembershipDialog), { ssr: false })

import { useAuthStore } from "@/lib/store/auth-store"
import { getColumns } from "./clubes-columns"
import dynamic from "next/dynamic"
import { CreditCard } from "lucide-react"

// ... inside component

export function ClubesView() {
    const [isLoading, setIsLoading] = useState(true)
    const { clubs, setClubs } = useClubStore()
    const authData = useAuthStore((state) => state.authData)
    const [rowSelection, setRowSelection] = useState({})
    const [isBulkPaymentOpen, setIsBulkPaymentOpen] = useState(false)

    // Use loose equality to handle potential string/number mismatches
    // eslint-disable-next-line eqeqeq
    const canEdit = authData?.tipo_registro == 1

    const columns = useMemo(() => {
        return getColumns(authData)
    }, [authData])

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
                setClubs(response.View_Club_gral)
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

    const filteredData = clubs.filter((item) => {
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

    const selectedClubs = useMemo(() => {
        return Object.keys(rowSelection).map(index => filteredData[parseInt(index)]).filter(Boolean)
    }, [rowSelection, filteredData])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card className="rounded-2xl border-none shadow-none bg-gray-50 dark:bg-zinc-900">
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
                <div className="rounded-md border p-4 bg-white dark:bg-zinc-900">
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
                            {/* ... filters ... */}
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
                        <div className="col-span-1 flex flex-col items-center justify-center border-l pl-4 gap-2">
                            {canEdit && (
                                <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
                                    <ClubDialog onClubCreated={fetchClubs} />
                                </Suspense>
                            )}
                            {selectedClubs.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 shadow-sm"
                                    onClick={() => setIsBulkPaymentOpen(true)}
                                >
                                    <CreditCard className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <DataTable
                columns={columns}
                data={filteredData}
                headerClassName="bg-white dark:bg-sky-950"
                tableHeight="h-[700px]"
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                enableRowSelection={(row: { original: ViewClubGral }) => !row.original.membresia}
            />

            {selectedClubs.length > 0 && (
                <Suspense fallback={null}>
                    <BulkClubMembershipDialog
                        open={isBulkPaymentOpen}
                        onOpenChange={setIsBulkPaymentOpen}
                        selectedClubs={selectedClubs}
                        onSuccess={() => {
                            setIsBulkPaymentOpen(false)
                            setRowSelection({})
                            fetchClubs()
                        }}
                    />
                </Suspense>
            )}
        </div>
    )
}
