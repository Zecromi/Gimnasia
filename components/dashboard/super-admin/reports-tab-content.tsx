import * as React from "react"
import { utils, write } from "xlsx"
import { Download, Loader2, Search } from "lucide-react"
import { getClubMembershipReport, ClubMembershipItem, ClubMembershipReportParams } from "@/lib/club-service"
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

    // Payment/Membership Report State
    const [reportData, setReportData] = React.useState<ClubMembershipItem[]>([])
    const [filters, setFilters] = React.useState<ClubMembershipReportParams>({
        nombre_club: "",
        status_membresia: "",
        status_club: "",
        forma_pago: "",
        fecha_ini: "",
        fecha_fin: ""
    })

    const fetchReport = async () => {
        setIsLoading(true)
        try {
            // Send parameters as empty strings if not set, as per requirement
            const params: any = {
                nombre_club: filters.nombre_club || "",
                status_membresia: filters.status_membresia === "todos" ? "" : filters.status_membresia,
                status_club: filters.status_club === "todos" ? "" : filters.status_club,
                forma_pago: filters.forma_pago === "todos" ? "" : filters.forma_pago,
                fecha_ini: filters.fecha_ini || "",
                fecha_fin: filters.fecha_fin || ""
            }

            const data = await getClubMembershipReport(params)

            // Handle various response structures: 
            // 1. { "resultados": [...] } (User reported)
            // 2. { "View_Club_gral": [...] } (Previous assumption)
            // 3. [...] (Direct array)
            const items = (data as any)?.resultados || (data as any)?.View_Club_gral || (Array.isArray(data) ? data : [])
            setReportData(items)

            if (items.length === 0) {
                toast.info("No se encontraron resultados con los filtros seleccionados.")
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
    }, [])

    const formatClubData = (club: ClubMembershipItem) => {
        return {
            ID: club.id,
            Club: club.Club,
            Alias: club.Alias,
            Email: club.Email,
            Asociación: club.Asociacion,
            Membresía: club.membresia ? "Activa" : "Inactiva",
            Estatus: club.Estatus ? "Alta" : "Baja",
            Web: club.Web,
            RFC: club.rfc,
            "Aparatos Nac.": club.Tipo_aparatos_nac ? "Sí" : "No",
            "Aparatos Imp.": club.Tipo_aparatos_imp ? "Sí" : "No",
            "Aparatos FIG": club.Tipos_aparatos_fig ? "Sí" : "No",
            "Otros Aparatos": club.Tipos_aparatos_otros ? "Sí" : "No",
            Fundación: club.Fundacion ? new Date(club.Fundacion).toLocaleDateString("es-MX") : "-",
            Sector: club.Sector ? "Privado" : "Público",
            Instalaciones: club.Tipo_instalaciones ? "Rentadas" : "Propias",
            "Teléfono 1": club.Telefono1,
            "Teléfono 2": club.Telefono2,
            "Monto Pago": club.M_pago ? `$${Number(club.M_pago).toFixed(2)}` : "$0.00",
            "F. Pago": club.F_pago,
            "Lugar Pago": club.Lugar_p,
            "Fecha Pago": club.fecha_p ? new Date(club.fecha_p).toLocaleDateString("es-MX", { timeZone: 'UTC' }) : "-",
        }
    }

    const handleDownload = () => {
        if (reportData.length === 0) {
            toast.warning("No hay datos para exportar")
            return
        }

        const dataToExport = reportData.map(formatClubData)
        const worksheet = utils.json_to_sheet(dataToExport)
        const workbook = utils.book_new()
        utils.book_append_sheet(workbook, worksheet, "Reporte")

        const wbout = write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([wbout], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "reporte_clubes_membresia.xlsx"
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generador de Reportes</CardTitle>
                <CardDescription>
                    Utilice los filtros para generar el reporte de clubes y membresías.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-end">
                    <Button onClick={handleDownload} disabled={reportData.length === 0} className="bg-green-600 hover:bg-green-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
                    </Button>
                </div>

                {/* Filters */}
                <div className="grid gap-4 p-4 border rounded-md bg-muted/20">
                    <h3 className="font-semibold mb-2">Filtros de Búsqueda</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputGroup label="Nombre Club" htmlFor="nombre_club">
                            <Input
                                id="nombre_club"
                                value={filters.nombre_club}
                                onChange={(e) => handleFilterChange("nombre_club", e.target.value)}
                                placeholder="Nombre del club"
                            />
                        </InputGroup>

                        <InputGroup label="Estatus Membresía">
                            <Select value={filters.status_membresia} onValueChange={(val) => handleFilterChange("status_membresia", val)}>
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
                            <Select value={filters.status_club} onValueChange={(val) => handleFilterChange("status_club", val)}>
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

                        <InputGroup label="Forma de Pago">
                            <Select value={filters.forma_pago} onValueChange={(val) => handleFilterChange("forma_pago", val)}>
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
                                value={filters.fecha_ini}
                                onChange={(e) => handleFilterChange("fecha_ini", e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup label="Fecha Fin">
                            <Input
                                type="date"
                                value={filters.fecha_fin}
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
                                    <TableHead className="whitespace-nowrap">ID</TableHead>
                                    <TableHead className="whitespace-nowrap">Club</TableHead>
                                    <TableHead className="whitespace-nowrap">Alias</TableHead>
                                    <TableHead className="whitespace-nowrap">Email</TableHead>
                                    <TableHead className="whitespace-nowrap">Asociación</TableHead>
                                    <TableHead className="whitespace-nowrap">Membresía</TableHead>
                                    <TableHead className="whitespace-nowrap">Estatus</TableHead>
                                    <TableHead className="whitespace-nowrap">Web</TableHead>
                                    <TableHead className="whitespace-nowrap">RFC</TableHead>
                                    <TableHead className="whitespace-nowrap">Fundación</TableHead>
                                    <TableHead className="whitespace-nowrap">Sector</TableHead>
                                    <TableHead className="whitespace-nowrap">Instalaciones</TableHead>
                                    <TableHead className="whitespace-nowrap">Teléfono 1</TableHead>
                                    <TableHead className="whitespace-nowrap">Monto Pago</TableHead>
                                    <TableHead className="whitespace-nowrap">Forma Pago</TableHead>
                                    <TableHead className="whitespace-nowrap">Lugar Pago</TableHead>
                                    <TableHead className="whitespace-nowrap">Fecha Pago</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.length > 0 ? (
                                    reportData.map((item, index) => {
                                        const formatted = formatClubData(item)
                                        return (
                                            <TableRow key={`${item.id}-${index}`}>
                                                <TableCell className="font-medium whitespace-nowrap">{formatted.ID}</TableCell>
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
                                                <TableCell className="whitespace-nowrap">{formatted.Web}</TableCell>
                                                <TableCell className="whitespace-nowrap">{formatted.RFC}</TableCell>
                                                <TableCell className="whitespace-nowrap">{formatted.Fundación}</TableCell>
                                                <TableCell className="whitespace-nowrap">{formatted.Sector}</TableCell>
                                                <TableCell className="whitespace-nowrap">{formatted.Instalaciones}</TableCell>
                                                <TableCell className="whitespace-nowrap">{formatted["Teléfono 1"]}</TableCell>
                                                <TableCell className="whitespace-nowrap">{formatted["Monto Pago"]}</TableCell>
                                                <TableCell className="whitespace-nowrap">{formatted["F. Pago"]}</TableCell>
                                                <TableCell className="whitespace-nowrap">{formatted["Lugar Pago"]}</TableCell>
                                                <TableCell className="whitespace-nowrap">{formatted["Fecha Pago"]}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={17} className="h-24 text-center">
                                            No se encontraron resultados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
