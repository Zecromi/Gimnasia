"use client"

import * as React from "react"
import { utils, write } from "xlsx"
import { Download, Loader2, Search, FileText, Printer } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { getClubMembershipReport, ClubMembershipItem, ClubMembershipReportParams } from "@/lib/club-service"
import { getAffiliatePaymentReport, AfiliadoPaymentReportParams, AfiliadoPaymentItem } from "@/lib/afiliados-service"
import { getInscripcionesReport, InscripcionReportItem, InscripcionesReportParams } from "@/lib/evento-service"
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { toast } from "sonner"

export function ReportsTabContent() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [reportType, setReportType] = React.useState<"club" | "affiliate" | "inscripciones">("club")

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
        club: "",
        fecha_ini: "",
        fecha_fin: ""
    })

    // Inscripciones Report State
    const [inscripcionesReportData, setInscripcionesReportData] = React.useState<InscripcionReportItem[]>([])
    const [inscripcionesFilters, setInscripcionesFilters] = React.useState<InscripcionesReportParams>({
        id_evento: "",
        nombre_event: "",
        club: "",
        id_afiliado: "",
        nom_afiliado: "",
        status: ""
    })

    // PDF Preview State
    const [showPdfPreview, setShowPdfPreview] = React.useState(false)
    const [pdfUrl, setPdfUrl] = React.useState<string | null>(null)
    const [pdfFileName, setPdfFileName] = React.useState("")

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
            } else if (reportType === "affiliate") {
                // Construct params dynamically to avoid sending empty strings which might break backend filtering
                const params: any = {}
                if (affiliateFilters.id_afilido) params.id_afilido = affiliateFilters.id_afilido
                if (affiliateFilters.nombre) params.nombre = affiliateFilters.nombre
                if (affiliateFilters.status && affiliateFilters.status !== "todos") params.status = affiliateFilters.status
                if (affiliateFilters.forma_pago && affiliateFilters.forma_pago !== "todos") params.forma_pago = affiliateFilters.forma_pago
                if (affiliateFilters.club) params.club = affiliateFilters.club
                if (affiliateFilters.fecha_ini) params.fecha_ini = affiliateFilters.fecha_ini
                if (affiliateFilters.fecha_fin) params.fecha_fin = affiliateFilters.fecha_fin

                const data = await getAffiliatePaymentReport(params)
                setAffiliateReportData(data.resultados || [])
                if (!data.resultados || data.resultados.length === 0) toast.info("No se encontraron resultados.")
            } else if (reportType === "inscripciones") {
                const params: any = {}
                if (inscripcionesFilters.id_evento) params.id_evento = inscripcionesFilters.id_evento
                if (inscripcionesFilters.nombre_event) params.nombre_event = inscripcionesFilters.nombre_event
                if (inscripcionesFilters.club) params.club = inscripcionesFilters.club
                if (inscripcionesFilters.id_afiliado) params.id_afiliado = inscripcionesFilters.id_afiliado
                if (inscripcionesFilters.nom_afiliado) params.nom_afiliado = inscripcionesFilters.nom_afiliado
                if (inscripcionesFilters.status && inscripcionesFilters.status !== "todos") params.status = inscripcionesFilters.status

                const data = await getInscripcionesReport(params)
                setInscripcionesReportData(data.resultados || [])
                if (!data.resultados || data.resultados.length === 0) toast.info("No se encontraron resultados.")
            }
        } catch (error: any) {
            console.error("Error fetching report:", error)
            if (error.response && error.response.status === 400) {
                toast.info("No se encontraron resultados con los filtros aplicados.")
                if (reportType === "club") {
                    setClubReportData([])
                } else {
                    setAffiliateReportData([])
                }
            } else {
                toast.error("Error al generar el reporte")
            }
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
        const data = reportType === "club" ? clubReportData : reportType === "affiliate" ? affiliateReportData : inscripcionesReportData

        if (data.length === 0) {
            toast.warning("No hay datos para exportar")
            return
        }

        let dataToExport: any[] = []

        if (reportType === "club") {
            const clubData = data as ClubMembershipItem[]
            dataToExport = clubData.map(formatClubData)
            const total = clubData.reduce((sum, item) => sum + (Number(item.M_pago) || 0), 0)
            dataToExport.push({
                "Club": "Total General",
                "Alias": "",
                "Email": "",
                "Asociación": "",
                "Membresía": "",
                "Estatus": "",
                "Monto Pago": `$${total.toFixed(2)}`,
                "F. Pago": "",
                "Comprobante": "",
                "Lugar Pago": "",
                "Fecha Pago": ""
            })
        } else if (reportType === "affiliate") {
            const affiliateData = data as AfiliadoPaymentItem[]
            dataToExport = affiliateData.map(formatAffiliateData)
            const total = affiliateData.reduce((sum, item) => sum + (Number(item.M_pago) || 0), 0)
            dataToExport.push({
                "ID Afiliado": "",
                "Nombre Completo": "",
                "Club": "",
                "Importe": `$${total.toFixed(2)}`,
                "Fecha Pago": "",
                "Forma Pago": "",
                "Estatus": ""
            })
        } else if (reportType === "inscripciones") {
            const inscripcionesData = data as InscripcionReportItem[]
            dataToExport = inscripcionesData.map(item => ({
                "ID Evento": item.id_evento,
                "Evento": item.evento,
                "Club": item.club,
                "ID Afiliado": item.id_afiliado,
                "Afiliado": item.afiliado,
                "Costo Individual": item.Costo_ind ? `$${Number(item.Costo_ind).toFixed(2)}` : "$0.00",
                "Total": item.Total ? `$${Number(item.Total).toFixed(2)}` : "$0.00",
                "Estatus": item.Status
            }))
            const totalCosto = inscripcionesData.reduce((sum, item) => sum + (Number(item.Costo_ind) || 0), 0)
            dataToExport.push({
                "ID Evento": "",
                "Evento": "",
                "Club": "",
                "ID Afiliado": "",
                "Afiliado": "Total General",
                "Costo Individual": `$${totalCosto.toFixed(2)}`,
                "Total": "",
                "Estatus": ""
            })
        }

        const worksheet = utils.json_to_sheet(dataToExport)
        const workbook = utils.book_new()
        utils.book_append_sheet(workbook, worksheet, "Reporte")

        const fileName = reportType === "club" ? "reporte_clubes_membresia.xlsx" : reportType === "affiliate" ? "reporte_pagos_afiliados.xlsx" : "reporte_inscripciones.xlsx"

        const wbout = write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([wbout], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }

    const generatePdf = () => {
        const doc = new jsPDF()
        const data = reportType === "club" ? clubReportData : reportType === "affiliate" ? affiliateReportData : inscripcionesReportData

        if (data.length === 0) {
            toast.warning("No hay datos para generar el PDF")
            return null
        }

        const title = reportType === "club" ? "Reporte de Membresías de Clubes" : reportType === "affiliate" ? "Reporte de Pagos de Afiliados" : "Reporte de Inscripciones"
        const formattedDate = new Date().toLocaleDateString("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
        const fileName = `${title}-${formattedDate}`

        doc.setProperties({
            title: fileName
        })

        doc.text(title, 14, 15)
        doc.setFontSize(10)
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 22)

        if (reportType === "club") {
            const clubData = data as ClubMembershipItem[]
            const tableData = clubData.map(item => {
                const f = formatClubData(item)
                return [
                    String(f.Club || ""),
                    String(f.Alias || ""),
                    String(f.Membresía || ""),
                    String(f.Estatus || ""),
                    String(f["Monto Pago"] || ""),
                    String(f["F. Pago"] || ""),
                    String(f["Fecha Pago"] || "")
                ]
            })

            const total = clubData.reduce((sum, item) => sum + (Number(item.M_pago) || 0), 0)
            tableData.push(["", "", "", "Total General:", `$${total.toFixed(2)}`, "", ""])

            autoTable(doc, {
                startY: 25,
                head: [["Club", "Alias", "Membresía", "Estatus", "Monto", "Forma Pago", "Fecha Pago"]],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [22, 163, 74] } // Green color
            })
        } else if (reportType === "affiliate") {
            const affiliateData = data as AfiliadoPaymentItem[]
            const tableData = affiliateData.map(item => {
                const f = formatAffiliateData(item)
                return [
                    String(f["ID Afiliado"] || ""),
                    String(f["Nombre Completo"] || ""),
                    String(f.Club || ""),
                    String(f.Estatus || ""),
                    String(f.Importe || ""),
                    String(f["Forma Pago"] || ""),
                    String(f["Fecha Pago"] || "")
                ]
            })

            const total = affiliateData.reduce((sum, item) => sum + (Number(item.M_pago) || 0), 0)
            tableData.push(["", "", "", "Total General:", `$${total.toFixed(2)}`, "", ""])

            autoTable(doc, {
                startY: 25,
                head: [["ID", "Nombre", "Club", "Estatus", "Importe", "Forma Pago", "Fecha Pago"]],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [22, 163, 74] }
            })
        } else if (reportType === "inscripciones") {
            const inscripcionesData = data as InscripcionReportItem[]
            const tableData = inscripcionesData.map(item => ([
                String(item.id_evento || ""),
                String(item.evento || ""),
                String(item.club || ""),
                String(item.id_afiliado || ""),
                String(item.afiliado || ""),
                String(item.Status || ""),
                String(item.Costo_ind ? `$${Number(item.Costo_ind).toFixed(2)}` : "$0.00")

            ]))

            // Calculate totals
            const total = inscripcionesData.reduce((sum, item) => sum + (Number(item.Total) || 0), 0)
            tableData.push(["", "", "", "", "Total General:", "", `$${total.toFixed(2)}`])

            autoTable(doc, {
                startY: 25,
                head: [["ID Evento", "Evento", "Club", "ID Afiliado", "Afiliado", "Estatus", "Costo"]],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [22, 163, 74] }
            })
        }

        return { url: String(doc.output('bloburl')), fileName }
    }

    const handlePreviewPdf = () => {
        const result = generatePdf()
        if (result) {
            setPdfUrl(result.url)
            setPdfFileName(result.fileName)
            setShowPdfPreview(true)
        }
    }

    const handleFilterChange = (key: string, value: string) => {
        if (reportType === "club") {
            setClubFilters(prev => ({ ...prev, [key]: value }))
        } else if (reportType === "affiliate") {
            setAffiliateFilters(prev => ({ ...prev, [key]: value }))
        } else if (reportType === "inscripciones") {
            setInscripcionesFilters(prev => ({ ...prev, [key]: value }))
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
                        <Select value={reportType} onValueChange={(val: "club" | "affiliate" | "inscripciones") => setReportType(val)}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Seleccione reporte" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="club">Membresías de Clubes</SelectItem>
                                <SelectItem value="affiliate">Pagos de Afiliados</SelectItem>
                                <SelectItem value="inscripciones">Inscripciones</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handlePreviewPdf} disabled={(reportType === "club" ? clubReportData : reportType === "affiliate" ? affiliateReportData : inscripcionesReportData).length === 0} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                            <Printer className="mr-2 h-4 w-4" />
                            Ver PDF
                        </Button>
                        <Button onClick={handleDownload} disabled={(reportType === "club" ? clubReportData : reportType === "affiliate" ? affiliateReportData : inscripcionesReportData).length === 0} className="bg-green-600 hover:bg-green-700 text-white">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar Excel
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid gap-4 p-4 border rounded-md bg-muted/20">
                    <h3 className="font-semibold mb-2">Filtros de Búsqueda ({reportType === "club" ? "Clubes" : reportType === "affiliate" ? "Afiliados" : "Inscripciones"})</h3>
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
                        ) : reportType === "affiliate" ? (
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
                                <InputGroup label="Club" htmlFor="club">
                                    <Input
                                        id="club"
                                        value={affiliateFilters.club || ""}
                                        onChange={(e) => handleFilterChange("club", e.target.value)}
                                        placeholder="Nombre del club"
                                    />
                                </InputGroup>
                                <InputGroup label="Estatus">
                                    <Select value={affiliateFilters.status} onValueChange={(val) => handleFilterChange("status", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="Afiliado">Afiliado</SelectItem>
                                            <SelectItem value="Sin Afiliacion">Sin Afiliación</SelectItem>
                                            <SelectItem value="Activo">Activo</SelectItem>
                                            <SelectItem value="Baja">Baja</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </InputGroup>
                            </>
                        ) : (
                            <>
                                <InputGroup label="ID Evento" htmlFor="id_evento">
                                    <Input
                                        id="id_evento"
                                        value={inscripcionesFilters.id_evento}
                                        onChange={(e) => handleFilterChange("id_evento", e.target.value)}
                                        placeholder="ID Evento"
                                    />
                                </InputGroup>
                                <InputGroup label="Nombre Evento" htmlFor="nombre_event">
                                    <Input
                                        id="nombre_event"
                                        value={inscripcionesFilters.nombre_event}
                                        onChange={(e) => handleFilterChange("nombre_event", e.target.value)}
                                        placeholder="Nombre del evento"
                                    />
                                </InputGroup>
                                <InputGroup label="Club" htmlFor="club_insc">
                                    <Input
                                        id="club_insc"
                                        value={inscripcionesFilters.club}
                                        onChange={(e) => handleFilterChange("club", e.target.value)}
                                        placeholder="Nombre del club"
                                    />
                                </InputGroup>
                                <InputGroup label="ID Afiliado" htmlFor="id_afiliado">
                                    <Input
                                        id="id_afiliado"
                                        value={inscripcionesFilters.id_afiliado}
                                        onChange={(e) => handleFilterChange("id_afiliado", e.target.value)}
                                        placeholder="ID Afiliado"
                                    />
                                </InputGroup>
                                <InputGroup label="Nombre Afiliado" htmlFor="nom_afiliado">
                                    <Input
                                        id="nom_afiliado"
                                        value={inscripcionesFilters.nom_afiliado}
                                        onChange={(e) => handleFilterChange("nom_afiliado", e.target.value)}
                                        placeholder="Nombre del afiliado"
                                    />
                                </InputGroup>
                                <InputGroup label="Estatus">
                                    <Select value={inscripcionesFilters.status} onValueChange={(val) => handleFilterChange("status", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="Pagado">Pagado</SelectItem>
                                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                                            <SelectItem value="En Curso">En Curso</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </InputGroup>
                            </>

                        )}

                        {reportType !== "inscripciones" && (
                            <>
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
                            </>
                        )}
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
                                    ) : reportType === "affiliate" ? (
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
                                    ) : (
                                        <>
                                            <TableHead className="whitespace-nowrap">ID Evento</TableHead>
                                            <TableHead className="whitespace-nowrap">Evento</TableHead>
                                            <TableHead className="whitespace-nowrap">Club</TableHead>
                                            <TableHead className="whitespace-nowrap">ID Afiliado</TableHead>
                                            <TableHead className="whitespace-nowrap">Afiliado</TableHead>
                                            <TableHead className="whitespace-nowrap">Estatus</TableHead>
                                            <TableHead className="whitespace-nowrap text-right">Costo Unitario</TableHead>
                                            <TableHead className="whitespace-nowrap text-right">Total</TableHead>
                                        </>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportType === "club" ? (
                                    clubReportData.length > 0 ? (
                                        <>
                                            {clubReportData.map((item, index) => {
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
                                            })}
                                            <TableRow className="bg-muted/50 font-medium border-t-2">
                                                <TableCell colSpan={6} className="text-right pr-4">Total Monto Pago:</TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    ${clubReportData.reduce((sum, item) => sum + (Number(item.M_pago) || 0), 0).toFixed(2)}
                                                </TableCell>
                                                <TableCell colSpan={4}></TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={11} className="h-24 text-center">
                                                No se encontraron resultados.
                                            </TableCell>
                                        </TableRow>
                                    )
                                ) : reportType === "affiliate" ? (
                                    affiliateReportData.length > 0 ? (
                                        <>
                                            {affiliateReportData.map((item, index) => {
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
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.Estatus === "Activo" || item.Estatus === "1" || item.Estatus === "Afiliado"
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                                }`}>
                                                                {formatted.Estatus}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                            <TableRow className="bg-muted/50 font-medium border-t-2">
                                                <TableCell colSpan={4} className="text-right pr-4">Total Importe:</TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    ${affiliateReportData.reduce((sum, item) => sum + (Number(item.M_pago) || 0), 0).toFixed(2)}
                                                </TableCell>
                                                <TableCell colSpan={3}></TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center">
                                                No se encontraron resultados.
                                            </TableCell>
                                        </TableRow>
                                    )
                                ) : (
                                    inscripcionesReportData.length > 0 ? (
                                        <>
                                            {inscripcionesReportData.map((item, index) => (
                                                <TableRow key={`${item.id_evento}-${item.id_afiliado}-${index}`}>
                                                    <TableCell className="whitespace-nowrap">{item.id_evento}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.evento}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.club}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.id_afiliado}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.afiliado}</TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.Status === "Pagado" || item.Status === "En Curso"
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                            }`}>
                                                            {item.Status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap text-right">{item.Costo_ind ? `$${Number(item.Costo_ind).toFixed(2)}` : "$0.00"}</TableCell>
                                                    <TableCell className="whitespace-nowrap text-right">{item.Total ? `$${Number(item.Total).toFixed(2)}` : "$0.00"}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="bg-muted/50 font-medium border-t-2">
                                                <TableCell colSpan={6} className="text-right pr-4">Total General:</TableCell>
                                                <TableCell className="whitespace-nowrap text-right">
                                                    ${inscripcionesReportData.reduce((sum, item) => sum + (Number(item.Costo_ind) || 0), 0).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-right"></TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
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

            <Dialog open={showPdfPreview} onOpenChange={setShowPdfPreview}>
                <DialogContent
                    className="max-w-[95vw] w-[95vw] h-[75vh] sm:max-w-[95vw]"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader className="">
                        <DialogTitle>Vista Previa del Reporte</DialogTitle>
                    </DialogHeader>
                    {pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-[60vh] rounded-md border"
                            title="Vista previa del PDF"
                        />
                    )}
                    <DialogFooter className="mr-6">
                        <Button variant="secondary" onClick={() => setShowPdfPreview(false)}>Cerrar</Button>
                        <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                            <a href={pdfUrl || ""} download={pdfFileName}>
                                <Download className="mr-2 h-4 w-4" />
                                Descargar PDF
                            </a>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card >
    )
}
