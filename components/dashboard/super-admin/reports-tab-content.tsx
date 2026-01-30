import * as React from "react"
import { utils, write } from "xlsx"
import { Download, FileText, Loader2 } from "lucide-react"
import { getClubs } from "@/lib/club-service"
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
import { useClubStore } from "@/lib/store/club-store"

export function ReportsTabContent() {
    const { clubs, setClubs } = useClubStore()
    const [reportType, setReportType] = React.useState<string>("")
    const [isLoading, setIsLoading] = React.useState(false)

    React.useEffect(() => {
        const fetchData = async () => {
            if (reportType === "clubs" && clubs.length === 0) {
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
        }
        fetchData()
    }, [reportType, clubs.length, setClubs])

    const formatClubData = (club: any) => {
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
            "Monto Pago": club.M_pago ? `$${club.M_pago.toFixed(2)}` : "$0.00",
            "F. Pago": club.F_pago,
            "Lugar Pago": club.Lugar_p,
            "Fecha Pago": club.fecha_p ? new Date(club.fecha_p).toLocaleDateString("es-MX") : "-",
        }
    }

    const handleDownload = () => {
        if (reportType === "clubs") {
            const formattedData = clubs.map(formatClubData)
            const worksheet = utils.json_to_sheet(formattedData)
            const workbook = utils.book_new()
            utils.book_append_sheet(workbook, worksheet, "Clubes")

            // Generate buffer
            const wbout = write(workbook, { bookType: 'xlsx', type: 'array' })

            // Create blob and download
            const blob = new Blob([wbout], { type: 'application/octet-stream' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "reporte_clubes.xlsx"
            a.click()
            URL.revokeObjectURL(url)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generador de Reportes</CardTitle>
                <CardDescription>
                    Seleccione el tipo de reporte que desea generar y descargar.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Select onValueChange={setReportType} value={reportType}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Seleccionar tipo de reporte" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="clubs">Clubes Registrados</SelectItem>
                        </SelectContent>
                    </Select>

                    {reportType && (
                        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar Excel
                        </Button>
                    )}
                </div>

                {reportType === "clubs" && (
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
                                        <TableHead className="whitespace-nowrap">Ap. Nac.</TableHead>
                                        <TableHead className="whitespace-nowrap">Ap. Imp.</TableHead>
                                        <TableHead className="whitespace-nowrap">Ap. FIG</TableHead>
                                        <TableHead className="whitespace-nowrap">Otros Ap.</TableHead>
                                        <TableHead className="whitespace-nowrap">Fundación</TableHead>
                                        <TableHead className="whitespace-nowrap">Sector</TableHead>
                                        <TableHead className="whitespace-nowrap">Instalaciones</TableHead>
                                        <TableHead className="whitespace-nowrap">Teléfono 1</TableHead>
                                        <TableHead className="whitespace-nowrap">Teléfono 2</TableHead>
                                        <TableHead className="whitespace-nowrap">Monto Pago</TableHead>
                                        <TableHead className="whitespace-nowrap">F. Pago</TableHead>
                                        <TableHead className="whitespace-nowrap">Lugar Pago</TableHead>
                                        <TableHead className="whitespace-nowrap">Fecha Pago</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clubs.length > 0 ? (
                                        clubs.map((club) => {
                                            const formatted = formatClubData(club)
                                            return (
                                                <TableRow key={club.id}>
                                                    <TableCell className="font-medium whitespace-nowrap">{formatted.ID}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Club}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Alias}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Email}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Asociación}</TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${club.membresia
                                                                ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-900/50'
                                                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                                            }`}>
                                                            {formatted.Membresía}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${club.Estatus
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                            }`}>
                                                            {formatted.Estatus}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Web}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.RFC}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Aparatos Nac."]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Aparatos Imp."]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Aparatos FIG"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Otros Aparatos"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Fundación}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Sector}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted.Instalaciones}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Teléfono 1"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Teléfono 2"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Monto Pago"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["F. Pago"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Lugar Pago"]}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{formatted["Fecha Pago"]}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={22} className="h-24 text-center">
                                                No hay datos de clubes disponibles.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                )}

                {!reportType && (
                    <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground border rounded-md border-dashed">
                        <FileText className="h-16 w-16 mb-4 opacity-20" />
                        <p>Seleccione un reporte para visualizar la información previa.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
