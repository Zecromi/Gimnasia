"use client"

import * as React from "react"
import { CircleFadingArrowUp, Plus, Trash2, Hash, Medal, FileText, Users, ChevronsUpDown, AlertCircle, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

import { getGlobalInfo, ModalidadItem, ModalidadDetalleItem } from "@/lib/club-service"
import {
    putEventos,
    putEventosNiveles,
    getNiveles,
    getAdicionales,
    delAdicional,
    AdicionalEventoItem,
    EventosConfiguradosItem as Evento
} from "@/lib/evento-service"
import { adicionalItemSchema } from "@/lib/schemas/evento/edit-evento-schema"

const DetailRow = React.memo(({
    detail,
    detailKey,
    isSelected,
    values,
    grandTotal,
    onToggle,
    onUpdate
}: {
    detail: ModalidadDetalleItem
    detailKey: string
    isSelected: boolean
    values: { costo: string; descripcion: string }
    grandTotal: number
    onToggle: (key: string) => void
    onUpdate: (key: string, field: 'costo' | 'descripcion', value: string) => void
}) => {
    return (
        <TableRow className="hover:bg-muted/30 transition-colors">
            <TableCell className="text-center">
                <Checkbox
                    id={detailKey}
                    checked={isSelected}
                    onCheckedChange={() => onToggle(detailKey)}
                />
            </TableCell>
            <TableCell className="font-medium">
                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900 dark:text-teal-200 dark:border-teal-800 font-normal">
                    {detail.Nivel}
                </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">{detail.titulo}</TableCell>
            <TableCell className="text-center text-muted-foreground text-sm">
                {detail.edad_ini === detail.edad_fin
                    ? `${detail.edad_ini} años`
                    : `${detail.edad_ini} - ${detail.edad_fin} años`
                }
            </TableCell>
            <TableCell>
                <div className="relative">
                    <span className={cn(
                        "absolute left-2 top-2 text-xs",
                        !isSelected ? "text-muted-foreground/50" : "text-muted-foreground"
                    )}>$</span>
                    <Input
                        className="h-8 pl-5 w-full"
                        placeholder="0.00"
                        type="number"
                        disabled={!isSelected}
                        value={values.costo}
                        onChange={(e) => onUpdate(detailKey, 'costo', e.target.value)}
                    />
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center h-8 px-2 text-sm font-medium text-muted-foreground bg-muted/20 rounded-md border border-transparent">
                    ${isSelected ? (parseFloat(values.costo) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                </div>
            </TableCell>
        </TableRow>
    )
})
DetailRow.displayName = "DetailRow"

function DeleteAdicionalDialog({
    item,
    idEvento,
    onSuccess,
    onOpenChange
}: {
    item: AdicionalEventoItem | null,
    idEvento: string,
    onSuccess: () => void,
    onOpenChange: (open: boolean) => void
}) {
    const handleConfirm = async () => {
        if (!item) return
        try {
            await delAdicional(idEvento, String(item.id_aparato))
            toast.success("Adicional eliminado exitosamente")
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
            toast.error("Error al eliminar el adicional")
        }
    }

    return (
        <AlertDialog open={!!item} onOpenChange={onOpenChange}>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Está seguro de eliminar este adicional?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará el adicional <strong>{item?.Descripcion}</strong> con un costo de <strong>${item?.Costo?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong> del evento. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        type="button"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleConfirm()
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

function AdicionalesExistentes({
    adicionales,
    setItemParaEliminar
}: {
    adicionales: AdicionalEventoItem[],
    setItemParaEliminar: (item: AdicionalEventoItem) => void
}) {
    return (
        <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-teal-600" />
                    Adicionales Existentes del Evento
                </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {adicionales.map((adj) => (
                    <div key={adj.id_aparato} className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-muted/5 transition-colors group shadow-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold">{adj.Descripcion}</span>
                            <span className="text-sm text-teal-600 font-medium">$ {adj.Costo?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setItemParaEliminar(adj);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {adicionales.length === 0 && (
                    <div className="col-span-full py-10 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/5">
                        <p className="text-sm">No hay adicionales configurados actualmente para este evento.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export function ModalidadesForm({ id, evento, onSuccess }: { id: string, evento: Evento, onSuccess?: () => void }) {
    const [modalidades, setModalidades] = React.useState<ModalidadItem[]>([])
    const [modalidadesDetalle, setModalidadesDetalle] = React.useState<ModalidadDetalleItem[]>([])
    const [isTableCollapsed, setIsTableCollapsed] = React.useState<Record<string, boolean>>({})
    const [adicionales, setAdicionales] = React.useState<AdicionalEventoItem[]>([])
    const [nuevosAdicionales, setNuevosAdicionales] = React.useState<Record<string, Array<{ id: string, costo: string, descripcion: string }>>>({})
    const [itemParaEliminar, setItemParaEliminar] = React.useState<AdicionalEventoItem | null>(null)

    const refreshAdicionales = async () => {
        const eventAdicionales = await getAdicionales(String(evento.id))
        if (eventAdicionales?.Adicionales) {
            setAdicionales(eventAdicionales.Adicionales)
        }
    }

    const addNivelAdicional = (modalityId: string) => {
        const newId = Math.random().toString(36).substr(2, 9)
        setNuevosAdicionales(prev => ({
            ...prev,
            [modalityId]: [...(prev[modalityId] || []), { id: newId, costo: "", descripcion: "" }]
        }))
    }

    const removeNivelAdicional = (modalityId: string, id: string) => {
        setNuevosAdicionales(prev => ({
            ...prev,
            [modalityId]: (prev[modalityId] || []).filter(item => item.id !== id)
        }))
    }

    const updateNivelAdicional = (modalityId: string, id: string, field: 'costo' | 'descripcion', value: string) => {
        setNuevosAdicionales(prev => ({
            ...prev,
            [modalityId]: (prev[modalityId] || []).map(item => item.id === id ? { ...item, [field]: value } : item)
        }))
    }

    const [selectedDetails, setSelectedDetails] = React.useState<Record<string, boolean>>({})
    const [detailValues, setDetailValues] = React.useState<Record<string, { costo: string, descripcion: string }>>({})
    const [selectedModalities, setSelectedModalities] = React.useState<Record<string, boolean>>({})
    const [errors, setErrors] = React.useState<Record<string, string[] | undefined>>({})
    const [isValid, setIsValid] = React.useState(false)

    React.useEffect(() => {
        const hasSelection = Object.values(selectedModalities).some(v => v) || Object.values(nuevosAdicionales).some(arr => arr.length > 0)
        setIsValid(hasSelection)
    }, [selectedModalities, nuevosAdicionales])

    const toggleModality = React.useCallback((id: string) => {
        setSelectedModalities(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }, [])

    const toggleTableCollapse = React.useCallback((id: string) => {
        setIsTableCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
    }, [])

    const toggleDetail = React.useCallback((key: string) => {
        setSelectedDetails(prev => {
            const newState = !prev[key]
            if (!newState) {
                setDetailValues(prevValues => ({
                    ...prevValues,
                    [key]: { costo: "", descripcion: "" }
                }))
            }
            return {
                ...prev,
                [key]: newState
            }
        })
    }, [])

    const updateDetailValue = React.useCallback((key: string, field: 'costo' | 'descripcion', value: string) => {
        setDetailValues(prev => ({
            ...prev,
            [key]: {
                ...prev[key] || { costo: "", descripcion: "" },
                [field]: value
            }
        }))
    }, [])


    const groupedDetails = React.useMemo(() => {
        const grouped: Record<number, ModalidadDetalleItem[]> = {}
        modalidadesDetalle.forEach(det => {
            if (!grouped[det.id]) grouped[det.id] = []
            grouped[det.id].push(det)
        })
        return grouped
    }, [modalidadesDetalle])

    const grandTotal = React.useMemo(() => {
        let total = 0
        Object.keys(selectedDetails).forEach((key) => {
            if (selectedDetails[key]) {
                const cost = parseFloat(detailValues[key]?.costo || "0")
                if (!isNaN(cost)) total += cost
            }
        })
        return total
    }, [selectedDetails, detailValues])

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [data, eventNiveles, eventAdicionales] = await Promise.all([
                    getGlobalInfo(),
                    getNiveles(String(evento.id)),
                    getAdicionales(String(evento.id))
                ]);

                if (eventAdicionales?.Adicionales) {
                    setAdicionales(eventAdicionales.Adicionales);
                }

                if (data.Modalidades) {
                    const filteredModalities = data.Modalidades.filter(m => m.Nombre === evento.Modalidad);
                    setModalidades(filteredModalities);
                    if (filteredModalities.length === 1) {
                        setSelectedModalities({ [String(filteredModalities[0].id)]: true });
                    }
                }

                const details = data.View_Modalidades_detalle || [];
                setModalidadesDetalle(details);

                if (eventNiveles?.Niveles && eventNiveles.Niveles.length > 0) {
                    const newSelectedDetails: Record<string, boolean> = {};
                    const newDetailValues: Record<string, { costo: string, descripcion: string }> = {};

                    eventNiveles.Niveles.forEach(nivel => {
                        const key = `det-${nivel.id_modalidad}-${nivel.id_nivel}-${nivel.id_categoria}`;
                        newSelectedDetails[key] = true;
                        newDetailValues[key] = {
                            costo: String(nivel.costo),
                            descripcion: ""
                        };
                    });

                    setSelectedDetails(newSelectedDetails);
                    setDetailValues(newDetailValues);
                }
            } catch (error) {
                console.error("Error fetching modalities and levels:", error);
            }
        };
        fetchData();
    }, [evento.id, evento.Modalidad]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const nivelesData: { id_modalidad: string, id_nivel: string, id_categoria: string, costo: string }[] = []
        let hasInvalidCost = false

        Object.keys(selectedDetails).forEach(key => {
            if (selectedDetails[key]) {
                const parts = key.split('-')
                if (parts.length === 4) {
                    const modId = parts[1]
                    const nivId = parts[2]
                    const catId = parts[3]
                    const costo = detailValues[key]?.costo

                    if (!costo || parseFloat(costo) < 0 || costo.trim() === "") {
                        hasInvalidCost = true
                    }

                    nivelesData.push({
                        id_modalidad: modId,
                        id_nivel: nivId,
                        id_categoria: catId,
                        costo: costo || "0"
                    })
                }
            }
        })

        if (hasInvalidCost) {
            toast.error("Por favor ingrese un costo válido para todos los niveles seleccionados")
            return
        }

        const lista_act_niv = nivelesData
            .filter(nivel => nivel.id_categoria && nivel.id_categoria !== "null")
            .map(nivel => ({
                id_evnt: String(evento.id),
                id_modalidad: String(nivel.id_modalidad),
                id_categoria: String(nivel.id_categoria),
                id_nivel: String(nivel.id_nivel),
                costo: String(nivel.costo)
            }))

        const nuevosAdicionalesFlat: { descripcion: string, costo_base: string }[] = []
        let hasInvalidAdicionales = false

        Object.keys(nuevosAdicionales).forEach(modId => {
            nuevosAdicionales[modId].forEach(adj => {
                if (adj.descripcion || adj.costo) {
                    const result = adicionalItemSchema.safeParse(adj)
                    if (!result.success) {
                        hasInvalidAdicionales = true
                    } else {
                        nuevosAdicionalesFlat.push({
                            descripcion: adj.descripcion,
                            costo_base: adj.costo
                        })
                    }
                }
            })
        })

        if (hasInvalidAdicionales) {
            toast.error("Por favor verifique que todos los adicionales nuevos tengan descripción y un costo mayor a 0")
            return
        }

        if (lista_act_niv.length === 0 && nuevosAdicionalesFlat.length === 0) {
            toast.info("No hay niveles o adicionales nuevos para actualizar")
            return
        }

        try {
            const promises = []

            if (lista_act_niv.length > 0) {
                promises.push(putEventosNiveles({ lista_act_niv }))
            }

            if (nuevosAdicionalesFlat.length > 0) {
                const payload = {
                    uno: [],
                    dos: [],
                    tres: [],
                    adicionales: nuevosAdicionalesFlat
                }
                promises.push(putEventos(String(evento.id), payload))
            }

            await Promise.all(promises)
            toast.success("Evento actualizado exitosamente")
            setNuevosAdicionales({}) // Clear new ones after success
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error(error)
            toast.error("Error al actualizar niveles o adicionales")
        }
    }

    return (
        <form id={id} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Label className="text-base font-semibold">Seleccione las modalidades</Label>
                <div className="rounded-md border p-4 bg-muted/10">
                    <p className="text-sm text-muted-foreground mb-4">
                        Seleccione las modalidades y configure los costos para este evento.
                    </p>
                    <Accordion type="single" collapsible className="w-full space-y-2 pb-6">

                        {modalidades.map((modalidad) => (
                            <AccordionItem value={`item-${modalidad.id}`} key={modalidad.id} className="border rounded-lg px-4 data-[state=open]:bg-muted/30">
                                <AccordionPrimitive.Header className="flex items-center py-3">
                                    <div className="flex items-center mr-3">
                                        <Checkbox
                                            id={`${id}-mod-${modalidad.id}`}
                                            name="modalidades"
                                            value={String(modalidad.id)}
                                            checked={selectedModalities[String(modalidad.id)] || false}
                                            onCheckedChange={() => toggleModality(String(modalidad.id))}
                                        />
                                    </div>
                                    <AccordionPrimitive.Trigger
                                        className={cn(
                                            "flex flex-1 items-center justify-between py-0 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 cursor-pointer"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Label
                                                htmlFor={`${id}-mod-${modalidad.id}`}
                                                className="cursor-pointer pointer-events-none"
                                            >
                                                {modalidad.Nombre}
                                            </Label>
                                            {modalidad.Alias && (
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                                                    {modalidad.Alias}
                                                </Badge>
                                            )}
                                        </div>
                                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                    </AccordionPrimitive.Trigger>
                                </AccordionPrimitive.Header>
                                <AccordionContent className="pt-2 pb-4 px-2">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-1">
                                            {modalidad.Descripcion && (
                                                <h4 className="text-sm font-medium text-muted-foreground">{modalidad.Descripcion}</h4>
                                            )}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-xs text-muted-foreground hover:text-foreground"
                                                onClick={() => toggleTableCollapse(String(modalidad.id))}
                                            >
                                                {isTableCollapsed[String(modalidad.id)] ? "Ver Niveles" : "Ocultar Niveles"}
                                                <ChevronsUpDown className="ml-2 h-3 w-3" />
                                            </Button>
                                        </div>

                                        {!isTableCollapsed[String(modalidad.id)] && (
                                            <div className="border rounded-md overflow-hidden">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-muted/50 hover:bg-muted/60 transition-colors">
                                                            <TableHead className="w-[50px] text-center">
                                                                <Hash className="h-3.5 w-3.5 mx-auto text-muted-foreground" />
                                                            </TableHead>
                                                            <TableHead>
                                                                <div className="flex items-center gap-2">
                                                                    <Medal className="h-3.5 w-3.5 text-teal-600" />
                                                                    <span>Nivel</span>
                                                                </div>
                                                            </TableHead>
                                                            <TableHead>
                                                                <div className="flex items-center gap-2">
                                                                    <FileText className="h-3.5 w-3.5 text-teal-600" />
                                                                    <span>Título</span>
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <Users className="h-3.5 w-3.5 text-teal-600" />
                                                                    <span>Rango de Edad</span>
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="w-[120px]">
                                                                <span>Costo</span>
                                                            </TableHead>
                                                            <TableHead className="w-[120px]">
                                                                <span>Total</span>
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {(groupedDetails[modalidad.id] || []).map((detail, idx) => {
                                                            const stateKey = `det-${modalidad.id}-${detail.id_nivel}-${detail.id_categoria}`
                                                            const reactKey = `${stateKey}-${idx}`
                                                            const isSelected = selectedDetails[stateKey] || false;
                                                            const currentValues = detailValues[stateKey] || { costo: "", descripcion: "" };

                                                            return (
                                                                <DetailRow 
                                                                    key={reactKey}
                                                                    detail={detail}
                                                                    detailKey={stateKey}
                                                                    isSelected={isSelected}
                                                                    values={currentValues}
                                                                    grandTotal={grandTotal}
                                                                    onToggle={toggleDetail}
                                                                    onUpdate={updateDetailValue}
                                                                />
                                                            )
                                                        })}
                                                        {(!groupedDetails[modalidad.id] || groupedDetails[modalidad.id].length === 0) && (
                                                            <TableRow>
                                                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                                    No hay detalles disponibles
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}

                                        {/* Nuevos Adicionales Section */}
                                        <div className="space-y-4 pt-4 mt-6 border-t border-dashed">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                                    <Plus className="h-4 w-4 text-teal-600" />
                                                    Agregar Adicional para {modalidad.Nombre}
                                                </h4>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                                                    onClick={() => addNivelAdicional(String(modalidad.id))}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Añadir
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {(nuevosAdicionales[String(modalidad.id)] || []).map((adj, idx) => (
                                                    <div key={adj.id} className="relative grid grid-cols-1 sm:grid-cols-[1fr_1fr_40px] gap-3 items-end p-3 rounded-lg border bg-muted/20 border-teal-100 dark:border-teal-900/30">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Descripción ({idx + 1})</Label>
                                                            <Input
                                                                placeholder="Ej. Seguro"
                                                                value={adj.descripcion}
                                                                onChange={(e) => updateNivelAdicional(String(modalidad.id), adj.id, 'descripcion', e.target.value)}
                                                                className="h-8 text-sm bg-background border-teal-100"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Costo Base</Label>
                                                            <div className="relative">
                                                                <span className="absolute left-2.5 top-2 text-xs text-muted-foreground">$</span>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0.00"
                                                                    value={adj.costo}
                                                                    onChange={(e) => updateNivelAdicional(String(modalidad.id), adj.id, 'costo', e.target.value)}
                                                                    className="h-8 pl-6 text-sm bg-background border-teal-100"
                                                                />
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 mb-[1px]"
                                                            onClick={() => removeNivelAdicional(String(modalidad.id), adj.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                {(!nuevosAdicionales[String(modalidad.id)] || nuevosAdicionales[String(modalidad.id)].length === 0) && (
                                                    <div className="col-span-full py-4 text-center text-xs text-muted-foreground border border-dashed rounded-md bg-muted/5">
                                                        No hay nuevos adicionales para esta modalidad
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Adicionales del Evento (Global/Existentes) */}
                    <AdicionalesExistentes
                        adicionales={adicionales}
                        setItemParaEliminar={setItemParaEliminar}
                    />
                </div>
            </div>
            <div className="p-4 border-t bg-background mt-auto">
                <div className="flex justify-end gap-2">
                    {(!isValid && Object.keys(errors).length > 0) && (
                        <div className="flex-1 mr-4">
                            <Alert variant="destructive" className="py-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Información</AlertTitle>
                                <AlertDescription>
                                    Verifique los datos seleccionados.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                    <Button type="submit" className="w-[100px] bg-teal-600 hover:bg-teal-700 text-white">
                        <CircleFadingArrowUp className="mr-2 h-4 w-4" />
                        Actualizar
                    </Button>
                </div>
            </div>

            <DeleteAdicionalDialog
                item={itemParaEliminar}
                idEvento={String(evento.id)}
                onOpenChange={(open) => !open && setItemParaEliminar(null)}
                onSuccess={refreshAdicionales}
            />
        </form>
    )
}
