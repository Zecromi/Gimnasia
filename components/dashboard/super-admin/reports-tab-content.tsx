"use client"

import * as React from "react"
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
import { useInscripcionesStore } from "@/lib/store/inscripciones-store"

export interface ReportsTabContentProps {
    defaultReportType?: "club" | "affiliate" | "inscripciones"
    forcedClubId?: string
    hideFilters?: string[]
}

export function ReportsTabContent({ defaultReportType, forcedClubId, hideFilters = [] }: ReportsTabContentProps = {}) {
    const [isLoading, setIsLoading] = React.useState(false)
    const [reportType, setReportType] = React.useState<"club" | "affiliate" | "inscripciones">(defaultReportType || "club")

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

    // Inscripciones Report State (Global Store)
    const {
        allData: allInscripcionesData,
        filteredData: inscripcionesReportData,
        filters: inscripcionesFilters,
        suggestions,
        showSuggestions,
        isFiltering,
        hasSelectedEvent,
        setAllData: setAllInscripcionesData,
        setFilters: setInscripcionesFilters,
        filterData: filterInscripcionesData,
        setShowSuggestions,
        setIsFiltering,
        setHasSelectedEvent
    } = useInscripcionesStore()

    React.useEffect(() => {
        if (forcedClubId) {
            setInscripcionesFilters({ ...inscripcionesFilters, club: forcedClubId })
            // Also set for other report types if needed, or if they share state structure
            setAffiliateFilters(prev => ({ ...prev, club: forcedClubId }))
            // Club report likely filters by club name, which might be different from ID. 
            // If forcedClubId is a name, it works. If ID, might need mapping.
            // Assuming string matching "club" param in APIs.
        }
    }, [forcedClubId]) // eslint-disable-line react-hooks/exhaustive-deps

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
                setAllInscripcionesData(data.resultados || [])
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

    // Initial fetch handled by the debounced effect below
    // React.useEffect(() => {
    //    fetchReport()
    // }, [reportType]) 


    // Debounced filtering effect for Inscripciones
    React.useEffect(() => {
        if (reportType !== "inscripciones") return

        const timer = setTimeout(() => {
            filterInscripcionesData()
        }, 300)

        setIsFiltering(true)

        return () => clearTimeout(timer)
    }, [inscripcionesFilters, reportType, filterInscripcionesData, setIsFiltering])

    // Debounced auto-fetch for all report types
    React.useEffect(() => {
        const timer = setTimeout(() => {
            fetchReport()
        }, 500)

        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportType, clubFilters, affiliateFilters, inscripcionesFilters.id_evento, inscripcionesFilters.nombre_event, inscripcionesFilters.club, inscripcionesFilters.id_afiliado, inscripcionesFilters.nom_afiliado, inscripcionesFilters.status])

    const handleSuggestionClick = (key: string, value: string) => {
        setInscripcionesFilters((prev) => ({ ...prev, [key]: value }))
        setShowSuggestions((prev) => ({ ...prev, [key]: false }))
        if (key === "nombre_event") {
            setHasSelectedEvent(true)
        }
    }

    const handleBlur = (key: string) => {
        // Small delay to allow click event on suggestion to fire
        setTimeout(() => {
            setShowSuggestions((prev) => ({ ...prev, [key]: false }))
        }, 200)
    }

    const handleFocus = (key: string) => {
        setShowSuggestions((prev) => ({ ...prev, [key]: true }))
    }


    const formatClubData = (club: ClubMembershipItem) => {
        return {
            Club: club.Club,
            Alias: club.Alias,
            Email: club.Email,
            Asociación: club.Asociacion,
            Membresía: club.membresia ? "Activa" : "Inactiva",
            Estatus: club.Estatus ? "Alta" : "Baja",
            "Monto Pago": club.M_pago ? `$${Number(club.M_pago).toFixed(2)}` : "$0.00",
            "Forma Pago": club.F_pago,
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
            "Membresía": item.M_pago ? "Pagado" : "Pendiente",
            "Importe": item.M_pago ? `$${Number(item.M_pago).toFixed(2)}` : "$0.00",
            "Fecha Pago": item.fecha_p ? new Date(item.fecha_p).toLocaleDateString("es-MX", { timeZone: 'UTC' }) : "-",
            "Forma Pago": item.F_pago,
            "Estatus": item.Estatus
        }
    }

    const handleDownload = async () => {
        const data = reportType === "club" ? clubReportData : reportType === "affiliate" ? affiliateReportData : inscripcionesReportData

        if (data.length === 0) {
            toast.warning("No hay datos para exportar")
            return
        }

        const formattedDownloadDate = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })
        const currentYear = new Date().getFullYear().toString()

        // ── Shared ExcelJS header helper ──
        const buildExcelHeader = async (wb: any, sheetName: string, titleLine: string, subtitleLine: string, colHeaders: string[]) => {
            const ws = wb.addWorksheet(sheetName)
            const NUM_COLS = colHeaders.length
            const addTitle = (rowNum: number, value: string, fontSize = 11) => {
                ws.mergeCells(rowNum, 1, rowNum, NUM_COLS)
                const row = ws.getRow(rowNum)
                row.height = fontSize + 6
                const cell = row.getCell(1)
                cell.value = value
                cell.font = { bold: true, size: fontSize }
                cell.alignment = { horizontal: "center", vertical: "middle" }
            }
            const addMeta = (rowNum: number, label: string, value: string) => {
                const row = ws.getRow(rowNum)
                row.getCell(1).value = label
                row.getCell(1).font = { bold: true, size: 9 }
                row.getCell(2).value = value
                row.getCell(2).font = { size: 9 }
            }
            addTitle(1, titleLine, 13)
            addTitle(2, subtitleLine, 11)
            ws.getRow(3).height = 6
            addMeta(4, "Fecha de descarga:", formattedDownloadDate)
            addMeta(5, "Año del evento:", currentYear)
            ws.getRow(6).height = 6
            const headerRow = ws.addRow(colHeaders)
            headerRow.eachCell((cell: any) => {
                cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 9 }
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF16A34A" } }
                cell.alignment = { horizontal: "center", vertical: "middle" }
                cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
            })
            headerRow.height = 16
            return ws
        }

        if (reportType === "club") {
            const clubData = data as ClubMembershipItem[]
            const ExcelJS = (await import("exceljs")).default
            const wb = new ExcelJS.Workbook()
            const colHeaders = ["Club", "Alias", "Email", "Asociación", "Membresía", "Estatus", "Monto Pago", "Forma Pago", "Comprobante", "Lugar Pago", "Fecha Pago"]
            const ws = await buildExcelHeader(wb, "Reporte", "Membresías de Clubes", "", colHeaders)
            clubData.forEach(item => {
                const f = formatClubData(item)
                ws.addRow([f.Club, f.Alias, f.Email, f.Asociación, f.Membresía, f.Estatus, f["Monto Pago"], f["Forma Pago"], f.Comprobante, f["Lugar Pago"], f["Fecha Pago"]])
            })
            const total = clubData.reduce((sum, item) => sum + (Number(item.M_pago) || 0), 0)
            const totalRow = ws.addRow(["", "", "", "", "", "Total General", `$${total.toFixed(2)}`, "", "", "", ""])
            totalRow.getCell(6).font = { bold: true }
            totalRow.getCell(7).font = { bold: true }
            ws.columns = [{ width: 22 }, { width: 14 }, { width: 24 }, { width: 16 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }]
            const buffer = await wb.xlsx.writeBuffer()
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url; a.download = "reporte_clubes_membresia.xlsx"; a.click()
            URL.revokeObjectURL(url)
            return
        } else if (reportType === "affiliate") {
            const affiliateData = data as AfiliadoPaymentItem[]
            const ExcelJS = (await import("exceljs")).default
            const wb = new ExcelJS.Workbook()
            const colHeaders = ["ID Afiliado", "Nombre Completo", "Club", "Membresía", "Importe", "Fecha Pago", "Forma Pago", "Estatus"]
            const ws = await buildExcelHeader(wb, "Reporte", "Pagos de Afiliados", "", colHeaders)
            affiliateData.forEach(item => {
                const f = formatAffiliateData(item)
                ws.addRow([f["ID Afiliado"], f["Nombre Completo"], f.Club, f.Membresía, f.Importe, f["Fecha Pago"], f["Forma Pago"], f.Estatus])
            })
            const total = affiliateData.reduce((sum, item) => sum + (Number(item.M_pago) || 0), 0)
            const totalRow = ws.addRow(["", "", "", "Total General", `$${total.toFixed(2)}`, "", "", ""])
            totalRow.getCell(4).font = { bold: true }
            totalRow.getCell(5).font = { bold: true }
            ws.columns = [{ width: 12 }, { width: 28 }, { width: 18 }, { width: 12 }, { width: 12 }, { width: 14 }, { width: 14 }, { width: 12 }]
            const buffer = await wb.xlsx.writeBuffer()
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url; a.download = "reporte_pagos_afiliados.xlsx"; a.click()
            URL.revokeObjectURL(url)
            return
        } else if (reportType === "inscripciones") {
            const inscripcionesData = data as InscripcionReportItem[]
            const first = inscripcionesData[0]
            const formattedDownloadDate = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })
            const currentYear = new Date().getFullYear().toString()
            const totalCosta = inscripcionesData.reduce((sum, item) => sum + (Number(item.Costo_ind) || 0), 0)

            const ExcelJS = (await import("exceljs")).default
            const wb = new ExcelJS.Workbook()
            const ws = wb.addWorksheet("Reporte")

            const NUM_COLS = 13

            // Helper: merge row, set value, bold + centered
            const addTitle = (rowNum: number, value: string, fontSize = 11) => {
                ws.mergeCells(rowNum, 1, rowNum, NUM_COLS)
                const row = ws.getRow(rowNum)
                row.height = fontSize + 6
                const cell = row.getCell(1)
                cell.value = value
                cell.font = { bold: true, size: fontSize }
                cell.alignment = { horizontal: "center", vertical: "middle" }
            }

            // Helper: left-aligned label + value pair
            const addMeta = (rowNum: number, label: string, value: string) => {
                const row = ws.getRow(rowNum)
                row.getCell(1).value = label
                row.getCell(1).font = { bold: true, size: 9 }
                row.getCell(2).value = value
                row.getCell(2).font = { size: 9 }
            }

            // ── Header rows ──
            addTitle(1, "Listado de Inscritos", 13)
            addTitle(2, first?.evento ?? "", 11)
            addTitle(3, first?.Asociación ?? "", 10)
            ws.getRow(4).height = 6  // spacer
            addMeta(5, "Fecha de descarga:", formattedDownloadDate)
            addMeta(6, "Año del evento:", currentYear)
            ws.getRow(7).height = 6  // spacer

            // ── Column header row (row 8) ──
            const headerRow = ws.addRow([
                "ID Evento", "Evento", "Club", "ID Afiliado", "Afiliado",
                "CURP", "Fecha Nacimiento", "Edades", "Nivel",
                "Sub División", "Concepto", "Asociación", "Costo Individual"
            ])
            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 9 }
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF16A34A" } }
                cell.alignment = { horizontal: "center", vertical: "middle" }
                cell.border = {
                    top: { style: "thin" }, bottom: { style: "thin" },
                    left: { style: "thin" }, right: { style: "thin" }
                }
            })
            headerRow.height = 16

            // ── Data rows ──
            inscripcionesData.forEach(item => {
                ws.addRow([
                    item.id_evento, item.evento, item.club, item.id_afiliado, item.afiliado,
                    item.Curp,
                    item.Fecha_nacimiento ? item.Fecha_nacimiento.split("T")[0] : "",
                    item.Edades, item.Nivel, item.Sub_División, item.Concepto, item.Asociación,
                    item.Costo_ind ? `$${Number(item.Costo_ind).toFixed(2)}` : "$0.00"
                ])
            })

            // ── Total row ──
            const totalRow = ws.addRow(["", "", "", "", "", "", "", "", "", "", "", "Total General", `$${totalCosta.toFixed(2)}`])
            totalRow.getCell(12).font = { bold: true }
            totalRow.getCell(13).font = { bold: true }

            // ── Column widths ──
            ws.columns = [
                { width: 10 }, { width: 22 }, { width: 14 }, { width: 12 }, { width: 26 },
                { width: 20 }, { width: 16 }, { width: 24 }, { width: 10 },
                { width: 14 }, { width: 14 }, { width: 20 }, { width: 16 }
            ]

            const buffer = await wb.xlsx.writeBuffer()
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "reporte_inscripciones.xlsx"
            a.click()
            URL.revokeObjectURL(url)
            return
        }
    }

    const generatePdf = () => {
        const doc = new jsPDF({ orientation: "landscape" })
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

        // ── Shared PDF header helper ──
        const addPdfHeader = (headerTitle: string, subtitle = "") => {
            const pageWidth = doc.internal.pageSize.getWidth()
            doc.setTextColor(0, 0, 0)
            doc.setFontSize(13)
            doc.setFont("helvetica", "bold")
            doc.text(headerTitle, pageWidth / 2, 15, { align: "center" })
            if (subtitle) {
                doc.setFontSize(10)
                doc.text(subtitle, pageWidth / 2, 22, { align: "center" })
            }
            let metaY = subtitle ? 30 : 22
            const metaX = 20
            const addMeta = (label: string, value: string) => {
                doc.setFontSize(8)
                doc.setFont("helvetica", "bold")
                doc.setTextColor(0, 0, 0)
                doc.text(`${label}:`, metaX, metaY)
                doc.setFont("helvetica", "normal")
                doc.text(value, metaX + 38, metaY)
                metaY += 6
            }
            const fd = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })
            addMeta("Fecha de descarga", fd)
            addMeta("Año del evento", new Date().getFullYear().toString())
            doc.setTextColor(0, 0, 0)
            return metaY + 2
        }

        if (reportType === "club") {
            const clubData = data as ClubMembershipItem[]
            const tableData = clubData.map(item => {
                const f = formatClubData(item)
                return [
                    String(f.Club || ""),
                    String(f.Alias || ""),
                    String(f.Email || ""),
                    String(f.Asociación || ""),
                    String(f.Membresía || ""),
                    String(f.Estatus || ""),
                    String(f["Monto Pago"] || ""),
                    String(f["Forma Pago"] || ""),
                    String(f.Comprobante || ""),
                    String(f["Lugar Pago"] || ""),
                    String(f["Fecha Pago"] || "")
                ]
            })

            const total = clubData.reduce((sum, item) => sum + (Number(item.M_pago) || 0), 0)
            tableData.push(["", "", "", "", "", "Total General:", `$${total.toFixed(2)}`, "", "", "", ""])

            const clubStartY = addPdfHeader("Membresías de Clubes")
            autoTable(doc, {
                startY: clubStartY,
                head: [["Club", "Alias", "Email", "Asociación", "Membresía", "Estatus", "Monto", "Forma Pago", "Comprobante", "Lugar Pago", "Fecha Pago"]],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 7 },
                headStyles: { fillColor: [22, 163, 74] }
            })
        } else if (reportType === "affiliate") {
            const affiliateData = data as AfiliadoPaymentItem[]
            const tableData = affiliateData.map(item => {
                const f = formatAffiliateData(item)
                return [
                    String(f["ID Afiliado"] || ""),
                    String(f["Nombre Completo"] || ""),
                    String(f.Club || ""),
                    String(f.Membresía || ""),
                    String(f.Importe || ""),
                    String(f["Fecha Pago"] || ""),
                    String(f["Forma Pago"] || ""),
                    String(f.Estatus || "")
                ]
            })

            const total = affiliateData.reduce((sum, item) => sum + (Number(item.M_pago) || 0), 0)
            tableData.push(["", "", "", "Total General:", `$${total.toFixed(2)}`, "", "", ""])

            const affiliateStartY = addPdfHeader("Pagos de Afiliados")
            autoTable(doc, {
                startY: affiliateStartY,
                head: [["ID", "Nombre", "Club", "Membresía", "Importe", "Fecha Pago", "Forma Pago", "Estatus"]],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [22, 163, 74] }
            })
        } else if (reportType === "inscripciones") {
            const inscripcionesData = data as InscripcionReportItem[]
            const first = inscripcionesData[0]
            const pageWidth = doc.internal.pageSize.getWidth()
            const formattedDownloadDate = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })
            const currentYear = new Date().getFullYear().toString()

            // — Header section —
            doc.setTextColor(0, 0, 0)
            doc.setFontSize(11)
            doc.setFont("helvetica", "bold")
            doc.text("Listado de Inscritos", pageWidth / 2, 15, { align: "center" })

            doc.setFontSize(10)
            doc.text(first?.evento ?? "", pageWidth / 2, 22, { align: "center" })

            doc.setFontSize(9)
            doc.setFont("helvetica", "normal")
            doc.text(first?.Asociación ?? "", pageWidth / 2, 28, { align: "center" })

            const metaX = 20
            let metaY = 38

            const addMeta = (label: string, value: string) => {
                doc.setFontSize(8)
                doc.setFont("helvetica", "bold")
                doc.setTextColor(0, 0, 0)
                doc.text(`${label}:`, metaX, metaY)
                doc.setFont("helvetica", "normal")
                doc.text(value, metaX + 38, metaY)
                metaY += 6
            }

            addMeta("Fecha de descarga", formattedDownloadDate)
            addMeta("Año del evento", currentYear)


            const tableData = inscripcionesData.map(item => ([
                String(item.id_evento || ""),
                String(item.evento || ""),
                String(item.club || ""),
                String(item.id_afiliado || ""),
                String(item.afiliado || ""),
                String(item.Curp || ""),
                String(item.Fecha_nacimiento ? item.Fecha_nacimiento.split("T")[0] : ""),
                String(item.Edades || ""),
                String(item.Nivel || ""),
                String(item.Sub_División || ""),
                String(item.Concepto || ""),
                String(item.Asociación || ""),
                String(item.Costo_ind ? `$${Number(item.Costo_ind).toFixed(2)}` : "$0.00")
            ]))

            const totalCosto = inscripcionesData.reduce((sum, item) => sum + (Number(item.Costo_ind) || 0), 0)
            tableData.push(["", "", "", "", "", "", "", "", "", "", "", "Total General", `$${totalCosto.toFixed(2)}`])

            autoTable(doc, {
                startY: metaY + 2,
                head: [["ID Evento", "Evento", "Club", "ID Afiliado", "Afiliado", "CURP", "F. Nacimiento", "Edades", "Nivel", "Sub División", "Concepto", "Asociación", "Costo Individual"]],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 6 },
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
        if (reportType === "inscripciones") {
            setInscripcionesFilters(prev => ({ ...prev, [key]: value }))
            if (key === "nombre_event") {
                setHasSelectedEvent(false)
            }
            // Debounce handled in useEffect
        } else if (reportType === "club") {
            setClubFilters(prev => ({ ...prev, [key]: value }))
        } else {
            setAffiliateFilters(prev => ({ ...prev, [key]: value }))
        }
    }

    return (
        <Card className="mt-4">
            <CardContent className="px-0">
                <div className="flex justify-between items-center bg-muted/20 p-4 rounded-md border">
                    <div className="flex items-center gap-4">
                        {!hideFilters.includes("report_type") && (
                            <>
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
                            </>
                        )}
                        {hideFilters.includes("report_type") && (
                            <h3 className="text-lg font-semibold">
                                {reportType === "club" ? "Reporte de Membresías" : reportType === "affiliate" ? "Reporte de Pagos de Afiliados" : "Reporte de Inscripciones"}
                            </h3>
                        )}
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

                                {!hideFilters.includes("id_evento") && (
                                    <InputGroup label="ID Evento" htmlFor="id_evento" className="relative">
                                        <Input
                                            id="id_evento"
                                            value={inscripcionesFilters.id_evento}
                                            onChange={(e) => handleFilterChange("id_evento", e.target.value)}
                                            onFocus={() => handleFocus("id_evento")}
                                            onBlur={() => handleBlur("id_evento")}
                                            placeholder="ID Evento"
                                            autoComplete="off"
                                        />
                                        {showSuggestions["id_evento"] && suggestions["id_evento"]?.length > 0 && (
                                            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-auto mt-1 dark:bg-gray-800 dark:border-gray-700">
                                                {suggestions["id_evento"].map((suggestion, index) => (
                                                    <li
                                                        key={index}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
                                                        onClick={() => handleSuggestionClick("id_evento", suggestion)}
                                                    >
                                                        {suggestion}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </InputGroup>
                                )}
                                {!hideFilters.includes("nombre_event") && (
                                    <InputGroup label="Nombre Evento" htmlFor="nombre_event" className="relative">
                                        <Input
                                            id="nombre_event"
                                            value={inscripcionesFilters.nombre_event}
                                            onChange={(e) => handleFilterChange("nombre_event", e.target.value)}
                                            onFocus={() => handleFocus("nombre_event")}
                                            onBlur={() => handleBlur("nombre_event")}
                                            placeholder="Nombre del evento"
                                            autoComplete="off"
                                        />
                                        {showSuggestions["nombre_event"] && suggestions["nombre_event"]?.length > 0 && (
                                            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-auto mt-1 dark:bg-gray-800 dark:border-gray-700">
                                                {suggestions["nombre_event"].map((suggestion, index) => (
                                                    <li
                                                        key={index}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
                                                        onClick={() => handleSuggestionClick("nombre_event", suggestion)}
                                                    >
                                                        {suggestion}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </InputGroup>
                                )}
                                {!hideFilters.includes("club") && (
                                    <InputGroup label="Club" htmlFor="club_insc">
                                        <Input
                                            id="club_insc"
                                            value={inscripcionesFilters.club || ""}
                                            onChange={(e) => handleFilterChange("club", e.target.value)}
                                            placeholder="Nombre del club"
                                            disabled={!!forcedClubId}
                                            className={forcedClubId ? "bg-muted" : ""}
                                        />
                                    </InputGroup>
                                )}
                                {!hideFilters.includes("id_afiliado") && (
                                    <InputGroup label="ID Afiliado" htmlFor="id_afiliado_insc">
                                        <Input
                                            id="id_afiliado_insc"
                                            value={inscripcionesFilters.id_afiliado || ""}
                                            onChange={(e) => handleFilterChange("id_afiliado", e.target.value)}
                                            placeholder="ID Afiliado"
                                        />
                                    </InputGroup>
                                )}
                                {!hideFilters.includes("nom_afiliado") && (
                                    <InputGroup label="Nombre Afiliado" htmlFor="nom_afiliado">
                                        <Input
                                            id="nom_afiliado"
                                            value={inscripcionesFilters.nom_afiliado || ""}
                                            onChange={(e) => handleFilterChange("nom_afiliado", e.target.value)}
                                            placeholder="Nombre Afiliado"
                                        />
                                    </InputGroup>
                                )}
                                {!hideFilters.includes("status") && (
                                    <InputGroup label="Estatus">
                                        <Select value={inscripcionesFilters.status} onValueChange={(val) => handleFilterChange("status", val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                                <SelectItem value="Inscrito">Inscrito</SelectItem>
                                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                                <SelectItem value="Baja">Baja</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </InputGroup>
                                )}
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
                                            <TableHead className="whitespace-nowrap">CURP</TableHead>
                                            <TableHead className="whitespace-nowrap">F. Nacimiento</TableHead>
                                            <TableHead className="whitespace-nowrap">Edades</TableHead>
                                            <TableHead className="whitespace-nowrap">Nivel</TableHead>
                                            <TableHead className="whitespace-nowrap">Sub División</TableHead>
                                            <TableHead className="whitespace-nowrap">Concepto</TableHead>
                                            <TableHead className="whitespace-nowrap">Asociación</TableHead>
                                            <TableHead className="whitespace-nowrap text-right">Costo Individual</TableHead>
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
                                                        <TableCell className="whitespace-nowrap">{formatted["Forma Pago"]}</TableCell>
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
                                                    <TableCell className="whitespace-nowrap font-mono text-xs">{item.Curp}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.Fecha_nacimiento ? item.Fecha_nacimiento.split("T")[0] : "—"}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.Edades}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.Nivel}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.Sub_División}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.Concepto}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.Asociación}</TableCell>
                                                    <TableCell className="whitespace-nowrap text-right">{item.Costo_ind ? `$${Number(item.Costo_ind).toFixed(2)}` : "$0.00"}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="bg-muted/50 font-medium border-t-2">
                                                <TableCell colSpan={12} className="text-right pr-4">Total General:</TableCell>
                                                <TableCell className="whitespace-nowrap text-right">
                                                    ${inscripcionesReportData.reduce((sum, item) => sum + (Number(item.Costo_ind) || 0), 0).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        </>
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
