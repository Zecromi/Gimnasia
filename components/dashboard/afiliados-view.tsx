"use client"

import { useEffect, useState, useMemo, useCallback, Suspense, lazy } from "react"
import { Search, Plus, CreditCard } from "lucide-react"

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
} from "@/components/ui/tooltip"

import dynamic from "next/dynamic"
import { getColumns } from "./afiliados-columns"

const DataTable = dynamic<any>(() => import("./data-table").then(mod => mod.DataTable), {
    ssr: false,
    loading: () => <Skeleton className="h-[700px] w-full" />
})
const AfiliadosDialog = dynamic(() => import("./afiliados-dialog").then(module => module.AfiliadosDialog), { ssr: false })
const AffiliateMembershipDialog = dynamic(() => import("./afiliado-membership-dialog").then(module => module.AffiliateMembershipDialog), { ssr: false })
const BulkMembershipDialog = dynamic(() => import("./bulk-membership-dialog").then(module => module.BulkMembershipDialog), { ssr: false })
import { getClubs, ViewClubGral } from "@/lib/club-service"
import { getAfiliadosCatalogs, Afiliado, AfiliadosCatalogsResponse } from "@/lib/afiliados-service"

import { useCatalogStore } from "@/lib/store/catalog-store"
import { useAuthStore } from "@/lib/store/auth-store"


export function AfiliadosView() {
    const [isLoading, setIsLoading] = useState(true)
    const [afiliados, setAfiliados] = useState<Afiliado[]>([])
    const [filteredAfiliados, setFilteredAfiliados] = useState<Afiliado[]>([])
    const [clubs, setClubs] = useState<ViewClubGral[]>([])
    const [afiliadosCatalogs, setAfiliadosCatalogs] = useState<AfiliadosCatalogsResponse | null>(null)

    const [editingAfiliado, setEditingAfiliado] = useState<Afiliado | undefined>(undefined)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [payingAfiliado, setPayingAfiliado] = useState<Afiliado | undefined>(undefined)
    const [isBulkPaymentOpen, setIsBulkPaymentOpen] = useState(false)

    const { Escolaridad, Estados, Niveles_tecnicos, fetchCatalogs } = useCatalogStore()
    const authData = useAuthStore((state) => state.authData)

    // Filter states
    const [filterAfiliado, setFilterAfiliado] = useState("")
    const [filterClub, setFilterClub] = useState("todos")
    const [filterEstatus, setFilterEstatus] = useState("todos")
    const [filterNoAfiliado, setFilterNoAfiliado] = useState("")
    const [filterCurp, setFilterCurp] = useState("")
    const [rowSelection, setRowSelection] = useState({})

    useEffect(() => {
        // If not admin, force filterClub to user's club ID
        // eslint-disable-next-line eqeqeq
        if (authData && authData.tipo_registro != 1) {
            setFilterClub(authData.id.toString())
        }
    }, [authData])

    const fetchData = useCallback(async () => {
        if (!authData) return

        console.log("AfiliadosView: executing fetchData") // Debug log
        setIsLoading(true)
        try {
            // Fetch global catalogs (via store) and local data
            fetchCatalogs()

            const [data, clubsData] = await Promise.all([
                getAfiliadosCatalogs(authData?.id, authData?.tipo_registro),
                getClubs()
            ])

            if (data && data.Afiliados) {
                let allAfiliados = data.Afiliados

                console.log("AuthData:", authData)

                console.log("Showing all (Permission Filter Disabled for Debug)")

                setAfiliados(allAfiliados)
                setFilteredAfiliados(allAfiliados)
            }
            setClubs(clubsData.View_Club_gral)
            setAfiliadosCatalogs(data)
        } catch (error) {
            console.error("Error fetching afiliados:", error)
        } finally {
            setIsLoading(false)
        }
    }, [fetchCatalogs, authData]) // Added authData dependency

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleEdit = useCallback((afiliado: Afiliado) => {
        setEditingAfiliado(afiliado)
        setIsEditOpen(true)
    }, [])

    const handlePayment = useCallback((afiliado: Afiliado) => {
        setPayingAfiliado(afiliado)
        setIsPaymentOpen(true)
    }, [])

    const selectedAfiliados = useMemo(() => {
        return Object.keys(rowSelection).map(index => filteredAfiliados[parseInt(index)]).filter(Boolean)
    }, [rowSelection, filteredAfiliados])

    const columns = useMemo(() => getColumns(fetchData, handleEdit, handlePayment, clubs, Escolaridad, Estados, Niveles_tecnicos, authData), [fetchData, handleEdit, handlePayment, clubs, Escolaridad, Estados, Niveles_tecnicos, authData])

    const handleFilter = () => {
        let filtered = [...afiliados]

        if (filterAfiliado) {
            const searchLower = filterAfiliado.toLowerCase()
            filtered = filtered.filter(a =>
                a.Nombre.toLowerCase().includes(searchLower) ||
                a.Paterno.toLowerCase().includes(searchLower) ||
                a.Materno.toLowerCase().includes(searchLower)
            )
        }

        if (filterClub && filterClub !== "todos") {
            filtered = filtered.filter(a => a.id_Club.toString() === filterClub)
        }

        if (filterEstatus && filterEstatus !== "todos") {
            if (filterEstatus === "alta") {
                filtered = filtered.filter(a => !a.Fecha_baja)
            } else {
                filtered = filtered.filter(a => !!a.Fecha_baja)
            }
        }

        if (filterNoAfiliado) {
            filtered = filtered.filter(a => a.id.toString().includes(filterNoAfiliado))
        }

        if (filterCurp) {
            filtered = filtered.filter(a => a.Curp.toLowerCase().includes(filterCurp.toLowerCase()))
        }

        setFilteredAfiliados(filtered)
    }

    if (isLoading) {
        return (
            <div className="space-y-2">
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
        <TooltipProvider>
            <div className="space-y-2">
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
                                            <Input
                                                id="afiliado"
                                                value={filterAfiliado}
                                                onChange={(e) => setFilterAfiliado(e.target.value)}
                                                placeholder="Nombre"
                                                className="h-8"
                                            />
                                        </InputGroup>
                                        <InputGroup label="Asociación :" className="md:col-span-3">
                                            <Input value="ESTADO DE MÉXICO" disabled className="bg-muted/50 h-8" />
                                        </InputGroup>
                                        <InputGroup label="Club :" htmlFor="club" className="md:col-span-2">
                                            <Select
                                                value={filterClub}
                                                onValueChange={setFilterClub}
                                                // eslint-disable-next-line eqeqeq
                                                disabled={authData?.tipo_registro != 1}
                                            >
                                                <SelectTrigger id="club">
                                                    <SelectValue placeholder="Todos" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="todos">Todos</SelectItem>
                                                    {Array.from(new Map(clubs.map(club => [club.id, club])).values()).map((club) => (
                                                        <SelectItem key={club.id} value={club.id.toString()}>
                                                            {club.Club}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </InputGroup>
                                        <InputGroup label="Estatus :" htmlFor="estatus" className="md:col-span-2">
                                            <Select value={filterEstatus} onValueChange={setFilterEstatus}>
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
                                        <InputGroup label="No. Afiliado :" htmlFor="no-afiliado" className="md:col-span-5">
                                            <Input
                                                id="no-afiliado"
                                                value={filterNoAfiliado}
                                                onChange={(e) => setFilterNoAfiliado(e.target.value)}
                                                placeholder=""
                                                className="h-8"
                                            />
                                        </InputGroup>
                                        <InputGroup label="CURP :" htmlFor="curp" className="md:col-span-5">
                                            <Input
                                                id="curp"
                                                value={filterCurp}
                                                onChange={(e) => setFilterCurp(e.target.value)}
                                                placeholder=""
                                                className="h-8"
                                            />
                                        </InputGroup>
                                        <div className="md:col-span-2 flex justify-end">
                                            <Button
                                                onClick={handleFilter}
                                                className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white h-8"
                                            >
                                                <Search className="mr-2 h-4 w-4" />
                                                Filtrar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col items-center justify-center border-l pl-4 gap-2">
                                <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
                                    <AfiliadosDialog onSuccess={fetchData} clubs={clubs} catalogs={afiliadosCatalogs || undefined} />
                                </Suspense>
                                {selectedAfiliados.length > 0 && (
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
                    data={filteredAfiliados}
                    headerClassName="bg-white dark:bg-sky-950"
                    tableHeight="h-[700px]"
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />

                <Suspense fallback={null}>
                    <AfiliadosDialog
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        afiliado={editingAfiliado}
                        trigger={<span className="sr-only"></span>}
                        clubs={clubs}
                        catalogs={afiliadosCatalogs || undefined}
                        onSuccess={() => {
                            setIsEditOpen(false)
                            fetchData()
                        }}
                    />
                </Suspense>

                {payingAfiliado && (
                    <Suspense fallback={null}>
                        <AffiliateMembershipDialog
                            open={isPaymentOpen}
                            onOpenChange={setIsPaymentOpen}
                            afiliado={payingAfiliado}
                            onSuccess={() => {
                                setIsPaymentOpen(false)
                                fetchData()
                            }}
                        />
                    </Suspense>
                )}

                {selectedAfiliados.length > 0 && (
                    <Suspense fallback={null}>
                        <BulkMembershipDialog
                            open={isBulkPaymentOpen}
                            onOpenChange={setIsBulkPaymentOpen}
                            selectedAfiliados={selectedAfiliados}
                            onSuccess={() => {
                                setIsBulkPaymentOpen(false)
                                setRowSelection({})
                                fetchData()
                            }}
                        />
                    </Suspense>
                )}
            </div>
        </TooltipProvider>
    )
}
