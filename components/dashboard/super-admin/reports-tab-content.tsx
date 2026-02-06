import * as React from "react"
import { utils, write } from "xlsx"
import { Download, Loader2, Search } from "lucide-react"
import { getClubMembershipReport, ClubMembershipItem, ClubMembershipReportParams } from "@/lib/club-service"
import { getAffiliatePaymentReport, AfiliadoPaymentReportParams, AfiliadoPaymentItem } from "@/lib/afiliados-service"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { toast } from "sonner"

export function ReportsTabContent() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [reportType, setReportType] = React.useState<"club" | "affiliate">("club")

    // Club Report State
    const [clubReportData, setClubReportData] = React.useState<ClubMembershipItem[]>([])
    const [clubFilters, setClubFilters] = React.useState<ClubMembershipReportParams>({
        nombre_club: "",
        status_membresia: "",
        status_club: "",
        forma_pago: "",
        fecha_ini: "",
        fecha_fin: ""
    })

    // Affiliate Report State
    const [affiliateReportData, setAffiliateReportData] = React.useState<AfiliadoPaymentItem[]>([])
    const [affiliateFilters, setAffiliateFilters] = React.useState<AfiliadoPaymentReportParams>({
        id_afilido: "",
        nombre: "",
        status: "",
        forma_pago: "",
        fecha_ini: "",
        fecha_fin: ""
    })

    const fetchReport = async () => {
        setIsLoading(true)
        try {
            if (reportType === "club") {
                const params: any = {
                    nombre_club: clubFilters.nombre_club || "",
                    status_membresia: clubFilters.status_membresia === "todos" ? "" : clubFilters.status_membresia,
                    status_club: clubFilters.status_club === "todos" ? "" : clubFilters.status_club,
                    forma_pago: clubFilters.forma_pago === "todos" ? "" : clubFilters.forma_pago,
                    fecha_ini: clubFilters.fecha_ini || "",
                    fecha_fin: clubFilters.fecha_fin || ""
                }
                const data = await getClubMembershipReport(params)
                const items = (data as any)?.resultados || (data as any)?.View_Club_gral || (Array.isArray(data) ? data : [])
                setClubReportData(items)
                if (items.length === 0) toast.info("No se encontraron resultados.")
            } else {
                const params: any = {
                    id_afilido: affiliateFilters.id_afilido || "",
                    nombre: affiliateFilters.nombre || "",
                    status: affiliateFilters.status === "todos" ? "" : affiliateFilters.status,
                    forma_pago: affiliateFilters.forma_pago === "todos" ? "" : affiliateFilters.forma_pago,
                    fecha_ini: affiliateFilters.fecha_ini || "",
                    fecha_fin: affiliateFilters.fecha_fin || ""
                }
                const data = await getAffiliatePaymentReport(params)
                setAffiliateReportData(data.resultados || [])
                if (!data.resultados || data.resultados.length === 0) toast.info("No se encontraron resultados.")
            }
        } catch (error) {
            console.error("Error fetching report:", error)
            toast.error("Error al generar el reporte")
        } finally {
            setIsLoading(false)
        }
    }

    // Initial fetch
    React.useEffect(() => {
        fetchReport()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportType]) // Refetch when report type changes

    const formatClubData = (club: ClubMembershipItem) => {
        return {
            Club: club.Club,
            Alias: club.Alias,
            Email: club.Email,
            Asociación: club.Asociacion,
            Membresía: club.membresia ? "Activa" : "Inactiva",
            Estatus: club.Estatus ? "Alta" : "Baja",
            "Monto Pago": club.M_pago ? `$${Number(club.M_pago).toFixed(2)}` : "$0.00",
            "F. Pago": club.F_pago,
            "Comprobante": club.Comprobante,
            "Lugar Pago": club.Lugar_p,
            "Fecha Pago": club.fecha_p ? new Date(club.fecha_p).toLocaleDateString("es-MX", { timeZone: 'UTC' }) : "-",
        }
    }

    const formatAffiliateData = (item: AfiliadoPaymentItem) => {
        return {
            "ID Afiliado": item.id_Afiliado,
            "Nombre Completo": `${item.Nombre} ${item.Paterno} ${item.Materno}`.trim(),
            "Club": item.Club,
            "Importe": item.M_pago ? `$${Number(item.M_pago).toFixed(2)}` : "$0.00",
            "Fecha Pago": item.fecha_p ? new Date(item.fecha_p).toLocaleDateString("es-MX", { timeZone: 'UTC' }) : "-",
            "Forma Pago": item.F_pago,
            "Estatus": item.Estatus
        }
    }

    const handleDownload = () => {
        const data = reportType === "club" ? clubReportData : affiliateReportData
        if (data.length === 0) {
            toast.warning("No hay datos para exportar")
            return
        }

        const dataToExport = reportType === "club"
            ? (data as ClubMembershipItem[]).map(formatClubData)
            : (data as AfiliadoPaymentItem[]).map(formatAffiliateData)

        const worksheet = utils.json_to_sheet(dataToExport)
        const workbook = utils.book_new()
        utils.book_append_sheet(workbook, worksheet, "Reporte")

        const fileName = reportType === "club" ? "reporte_clubes_membresia.xlsx" : "reporte_pagos_afiliados.xlsx"

        const wbout = write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([wbout], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleFilterChange = (key: string, value: string) => {
        if (reportType === "club") {
            setClubFilters(prev => ({ ...prev, [key]: value }))
        } else {
            setAffiliateFilters(prev => ({ ...prev, [key]: value }))
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generador de Reportes</CardTitle>
                <CardDescription>
                    Seleccione el tipo de reporte y utilice los filtros para consultar la información.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center bg-muted/20 p-4 rounded-md border">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Tipo de Reporte:</label>
                        <Select value={reportType} onValueChange={(val: "club" | "affiliate") => setReportType(val)}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Seleccione reporte" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="club">Membresías de Clubes</SelectItem>
                                <SelectItem value="affiliate">Pagos de Afiliados</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleDownload} disabled={(reportType === "club" ? clubReportData : affiliateReportData).length === 0} className="bg-green-600 hover:bg-green-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Excel
                    </Button>
                </div>

                {/* Filters */}
                <div className="grid gap-4 p-4 border rounded-md bg-muted/20">
                    <h3 className="font-semibold mb-2">Filtros de Búsqueda ({reportType === "club" ? "Clubes" : "Afiliados"})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reportType === "club" ? (
                            <>
                                <InputGroup label="Nombre Club" htmlFor="nombre_club">
                                    <Input
                                        id="nombre_club"
                                        value={clubFilters.nombre_club}
                                        onChange={(e) => handleFilterChange("nombre_club", e.target.value)}
                                        placeholder="Nombre del club"
                                    />
                                </InputGroup>

                                <InputGroup label="Estatus Membresía">
                                    <Select value={clubFilters.status_membresia} onValueChange={(val) => handleFilterChange("status_membresia", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="1">Activa</SelectItem>
                                            <SelectItem value="0">Inactiva</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </InputGroup>

                                <InputGroup label="Estatus Club">
                                    <Select value={clubFilters.status_club} onValueChange={(val) => handleFilterChange("status_club", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="1">Alta</SelectItem>
                                            <SelectItem value="0">Baja</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </InputGroup>
                            </>
                        ) : (
                            <>
                                <InputGroup label="ID Afiliado" htmlFor="id_afilido">
                                    <Input
                                        id="id_afilido"
                                        value={affiliateFilters.id_afilido}
                                        onChange={(e) => handleFilterChange("id_afilido", e.target.value)}
                                        placeholder="ID del afiliado"
                                    />
                                </InputGroup>
                                <InputGroup label="Nombre Afiliado" htmlFor="nombre">
                                    <Input
                                        id="nombre"
                                        value={affiliateFilters.nombre}
                                        onChange={(e) => handleFilterChange("nombre", e.target.value)}
                                        placeholder="Nombre del afiliado"
                                    />
                                </InputGroup>
                                <InputGroup label="Estatus">
                                    <Select value={affiliateFilters.status} onValueChange={(val) => handleFilterChange("status", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="1">Activo</SelectItem>
                                            <SelectItem value="0">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </InputGroup>
                            </>
                        )}

                        <InputGroup label="Forma de Pago">
                            <Select
                                value={reportType === "club" ? clubFilters.forma_pago : affiliateFilters.forma_pago}
                                onValueChange={(val) => handleFilterChange("forma_pago", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                                    <SelectItem value="Deposito">Depósito</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                </SelectContent>
                            </Select>
                        </InputGroup>

                        <InputGroup label="Fecha Inicio">
                            <Input
                                type="date"
                                value={reportType === "club" ? clubFilters.fecha_ini : affiliateFilters.fecha_ini}
                                onChange={(e) => handleFilterChange("fecha_ini", e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup label="Fecha Fin">
                            <Input
                                type="date"
                                value={reportType === "club" ? clubFilters.fecha_fin : affiliateFilters.fecha_fin}
                                onChange={(e) => handleFilterChange("fecha_fin", e.target.value)}
                            />
                        </InputGroup>
                    </div>
                    <div className="flex justify-end mt-2">
                        <Button onClick={fetchReport} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                            Buscar
                        </Button>
                    </div>
                </div>

                {/* Results Table */}
                <div className="rounded-md border mt-4 overflow-x-auto">
                    {isLoading ? (
                        <div className="flex h-24 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {reportType === "club" ? (
                                        <>
                                            <TableHead className="whitespace-nowrap">Club</TableHead>
                                            <TableHead className="whitespace-nowrap">Alias</TableHead>
                                            <TableHead className="whitespace-nowrap">Email</TableHead>
                                            <TableHead className="whitespace-nowrap">Asociación</TableHead>
                                            <TableHead className="whitespace-nowrap">Membresía</TableHead>
                                            <TableHead className="whitespace-nowrap">Estatus</TableHead>
                                            <TableHead className="whitespace-nowrap">Monto Pago</TableHead>
                                            <TableHead className="whitespace-nowrap">Forma Pago</TableHead>
                                            <TableHead className="whitespace-nowrap">Comprobante</TableHead>
                                            <TableHead className="whitespace-nowrap">Lugar Pago</TableHead>
                                            <TableHead className="whitespace-nowrap">Fecha Pago</TableHead>
                                        </>
                                    ) : (
                                        <>
                                            <TableHead className="whitespace-nowrap">ID</TableHead>
                                            <TableHead className="whitespace-nowrap">Nombre Completo</TableHead>
                                            <TableHead className="whitespace-nowrap">Club</TableHead>
                                            <TableHead className="whitespace-nowrap">Membresía</TableHead>
                                            <TableHead className="whitespace-nowrap">Importe</TableHead>
                                            <TableHead className="whitespace-nowrap">Fecha Pago</TableHead>
                                            <TableHead className="whitespace-nowrap">Forma Pago</TableHead>
                                            <TableHead className="whitespace-nowrap">Estatus</TableHead>
                                        </>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportType === "club" ? (
                                    clubReportData.length > 0 ? (
                                        clubReportData.map((item, index) => {
                                            const formatted = formatClubData(item)
                                            return (
                                                <TableRow key={`${item.id}-${index}`}>
                                                    <TableCell className="whitespace-nowrap">{formatted.Club}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Alias}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Email}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Asociación}</TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${item.membresia
                                                            ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-900/50'
                                                            : 'bg-slate-50 text-slate-500 border-slate-200'
                                                            }`}>
                                                            {formatted.Membresía}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.Estatus
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                            }`}>
                                                            {formatted.Estatus}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Monto Pago"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["F. Pago"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Comprobante}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Lugar Pago"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Fecha Pago"]}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={11} className="h-24 text-center">
                                                No se encontraron resultados.
                                            </TableCell>
                                        </TableRow>
                                    )
                                ) : (
                                    affiliateReportData.length > 0 ? (
                                        affiliateReportData.map((item, index) => {
                                            const formatted = formatAffiliateData(item)
                                            return (
                                                <TableRow key={`${item.id_Afiliado}-${index}`}>
                                                    <TableCell className="whitespace-nowrap">{formatted["ID Afiliado"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Nombre Completo"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Club}</TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.Estatus === "Activo" || item.Estatus === "1"
                                                            ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-900/50'
                                                            : 'bg-slate-50 text-slate-500 border-slate-200'
                                                            }`}>
                                                            {item.M_pago ? "Pagado" : "Pendiente"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Importe}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Fecha Pago"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Forma Pago"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.Estatus === "Activo" || item.Estatus == "1"
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                            }`}>
                                                            {formatted.Estatus}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center">
                                                No se encontraron resultados.
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
