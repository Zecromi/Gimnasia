"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown, Calendar, Clock, Users } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { useCatalogPayStore } from "@/lib/store/catalog-pay-store"
import { useAfiliadosEventosStore } from "@/lib/store/afiliados-eventos-store"
import { useAuthStore } from "@/lib/store/auth-store"
import { postInscripcion, getAdicionales, AdicionalEventoItem } from "@/lib/evento-service"

// Mock data removed for additional items as they are now dynamic

// --- Types ---

interface MemberConfig {
    additionalItemIds: string[]
}

interface RegisterEventDialogProps {
    children: React.ReactNode
    eventoId: string
    eventoName?: string
    modalidad: string
    costo: string
    id_Club?: string
    fechaFinInscripcion?: string
    horaLimiteInscripcion?: string
    limiteParticipantes?: number | string
    onSuccess?: () => void
}

export function RegisterEventDialog({
    children,
    eventoId,
    eventoName,
    modalidad,
    costo,
    id_Club,
    fechaFinInscripcion,
    horaLimiteInscripcion,
    limiteParticipantes = 0,
    onSuccess
}: RegisterEventDialogProps) {
    const { authData } = useAuthStore()
    const clubIdToUse = id_Club || authData?.id?.toString()

    const { Catalogo_formas_pago, fetchCatalogs } = useCatalogPayStore()
    const { afiliados, fetchAfiliadosEventos } = useAfiliadosEventosStore()
    const [open, setOpen] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null)
    const [memberConfigs, setMemberConfigs] = useState<Record<string, MemberConfig>>({})
    const [adicionales, setAdicionales] = useState<AdicionalEventoItem[]>([])
    const [loadingAdicionales, setLoadingAdicionales] = useState(true)

    useEffect(() => {
        if (!open) return

        fetchCatalogs()
        if (clubIdToUse) {
            fetchAfiliadosEventos(clubIdToUse)
        }

        const fetchAdicionales = async () => {
            if (!eventoId) return
            try {
                setLoadingAdicionales(true)
                const data = await getAdicionales(eventoId)
                setAdicionales(data.Adicionales || [])
            } catch (error) {
                console.error("Error fetching adicionales:", error)
            } finally {
                setLoadingAdicionales(false)
            }
        }

        fetchAdicionales()
    }, [open, fetchCatalogs, fetchAfiliadosEventos, clubIdToUse, eventoId])

    // Initialize config for new members
    useEffect(() => {
        if (open && afiliados.length > 0) {
            setMemberConfigs(prev => {
                const newConfigs: Record<string, MemberConfig> = { ...prev }
                afiliados.forEach(member => {
                    const memberId = String(member.id_afiliado)
                    if (!newConfigs[memberId]) {
                        newConfigs[memberId] = {
                            additionalItemIds: []
                        }
                    }
                })
                return newConfigs
            })
        }
    }, [open, afiliados])

    const handleSelectMember = (memberId: string, checked: boolean) => {
        const newSelected = new Set(selectedMembers)
        if (checked) {
            newSelected.add(memberId)
        } else {
            newSelected.delete(memberId)
        }
        setSelectedMembers(newSelected)
    }

    const resetForm = useCallback(() => {
        setSelectedMembers(new Set())
        setSelectedPaymentMethod(null)
        setMemberConfigs(prev => {
            const resetConfigs: Record<string, MemberConfig> = {}
            Object.keys(prev).forEach(key => {
                resetConfigs[key] = { additionalItemIds: [] }
            })
            return resetConfigs
        })
    }, [])

    const handleAdditionalItemToggle = (memberId: string, itemId: string) => {
        setMemberConfigs(prev => {
            const currentIds = prev[memberId]?.additionalItemIds || []
            const newIds = currentIds.includes(itemId)
                ? currentIds.filter(id => id !== itemId)
                : [...currentIds, itemId]

            return {
                ...prev,
                [memberId]: {
                    ...prev[memberId],
                    additionalItemIds: newIds
                }
            }
        })
    }

    // Validation State
    const [isRegistrationClosed, setRegistrationClosed] = useState(false)
    const [closureReason, setClosureReason] = useState<string | null>(null)

    // Check registration status
    useEffect(() => {
        const checkStatus = () => {

            // Let's look at date validation first.
            let closed = false
            let reason = null

            const now = new Date()

            if (fechaFinInscripcion) {
                // Parse format usually YYYY-MM-DD
                const deadlineDate = new Date(`${fechaFinInscripcion}T${horaLimiteInscripcion || "23:59:59"}`)

                if (now > deadlineDate) {
                    closed = true
                    reason = "Las inscripciones han cerrado (fecha límite)."
                }
            }

            // Check capacity
            // Strict interpretation: if limit is 0, block. 
            // If it is "Ilimitado", it does NOT block.
            if (!closed && limiteParticipantes === 0) {
                closed = true
                reason = "Cupo lleno (0 lugares disponibles)."
            }

            setRegistrationClosed(closed)
            setClosureReason(reason)
        }

        checkStatus()
    }, [fechaFinInscripcion, horaLimiteInscripcion, limiteParticipantes])


    const toggleAll = (checked: boolean) => {
        if (checked) {
            setSelectedMembers(new Set(afiliados.map(m => String(m.id_afiliado))))
        } else {
            setSelectedMembers(new Set())
        }
    }

    // Calculations
    const totals = useMemo(() => {
        let itemsCount = 0
        let additionalItemsCost = 0
        let totalCost = 0
        const numericCost = parseFloat(costo) || 0

        selectedMembers.forEach(memberId => {
            itemsCount++
            const config = memberConfigs[memberId]

            // Cost is now fixed from prop
            const modCost = numericCost

            let itemsCost = 0
            if (config) {
                config.additionalItemIds.forEach(itemId => {
                    const item = adicionales.find(i => String(i.id_aparato) === itemId)
                    if (item) itemsCost += item.Costo
                })
            }

            additionalItemsCost += itemsCost
            totalCost += (modCost + itemsCost)
        })

        return { itemsCount, additionalItemsCost, totalCost }
    }, [selectedMembers, memberConfigs, costo])

    const handleRegister = async () => {
        if (!selectedPaymentMethod) {
            toast.error("Por favor selecciona un método de pago")
            return
        }

        const paymentMethod = Catalogo_formas_pago.find(p => p.id === selectedPaymentMethod)

        try {
            const detalle_afiliados = Array.from(selectedMembers).map(memberId => {
                const config = memberConfigs[memberId]
                const aparatos = config?.additionalItemIds.map(itemId => ({
                    id_aparato: itemId
                })) || []

                return {
                    id_afiliado: memberId,
                    aparatos
                }
            })

            const payload = {
                inscripcion: {
                    id: eventoId,
                    id_club: clubIdToUse || "",
                    total: totals.totalCost.toString(),
                    id_tipo_pago: String(selectedPaymentMethod)
                },
                detalle_afiliados
            }
            console.log(payload)
            await postInscripcion(payload)

            toast.success("Inscripción exitosa", {
                description: `Se han inscrito ${totals.itemsCount} miembros. Método de pago: ${paymentMethod?.Nombre}`,
            })

            // Reset form, trigger refresh, and close dialog
            resetForm()
            if (onSuccess) onSuccess()
            setOpen(false)

        } catch (error) {
            console.error("Error registering:", error)
            toast.error("Error al realizar la inscripción")
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            {children}
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Inscribirse</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent
                className="max-w-[95vw] w-full lg:max-w-7xl max-h-[95vh] h-fit gap-0 p-0 flex flex-col overflow-hidden"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle>Inscripción al evento: <span className="text-teal-600">{eventoName}</span></DialogTitle>
                    <div className="flex flex-wrap gap-4 pt-1 text-sm text-muted-foreground">
                        {fechaFinInscripcion && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-teal-600" />
                                <span>Cierre: {format(new Date(fechaFinInscripcion), "PPP", { locale: es })}</span>
                            </div>
                        )}
                        {horaLimiteInscripcion && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-teal-600" />
                                <span>{horaLimiteInscripcion}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-teal-600" />
                            <span>Lugares disponibles: <span className="font-medium text-foreground">{limiteParticipantes}</span></span>
                        </div>
                    </div>
                    {isRegistrationClosed && (
                        <div className="mt-2 p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium border border-red-200">
                            No es posible realizar inscripciones: {closureReason}
                        </div>
                    )}
                </DialogHeader>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Left Column: Member Table */}
                    <div className="flex-1 border-r flex flex-col min-w-0">
                        <div className="p-4 border-b bg-muted/30 grid grid-cols-[40px_minmax(100px,1.2fr)_minmax(150px,1.5fr)_minmax(150px,1.5fr)] gap-4 items-center text-sm font-medium text-muted-foreground">
                            <Checkbox
                                checked={selectedMembers.size === afiliados.length && afiliados.length > 0}
                                onCheckedChange={(checked) => toggleAll(!!checked)}
                            />
                            <span className="truncate">Nombre</span>
                            <span className="truncate">Costo (Modalidad)</span>
                            <span className="truncate">Aparatos Adicionales</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-4 min-w-[600px]"> {/* Ensure min width for table content */}
                                <div className="space-y-4">
                                    {afiliados.map((member) => {
                                        const memberId = String(member.id_afiliado);
                                        const fullName = `${member.Nombre} ${member.Paterno} ${member.Materno || ""}`.trim();
                                        return (
                                            <div key={memberId} className="grid grid-cols-[40px_minmax(100px,1.2fr)_minmax(150px,1.5fr)_minmax(150px,1.5fr)] gap-4 items-center py-1">
                                                <Checkbox
                                                    checked={selectedMembers.has(memberId)}
                                                    onCheckedChange={(checked) => handleSelectMember(memberId, !!checked)}
                                                />
                                                <span className="text-sm font-medium truncate" title={fullName}>{fullName}</span>

                                                <div className="flex flex-col justify-center h-8 px-3 border rounded-md bg-muted/50 text-sm">
                                                    <div className="flex justify-between w-full gap-2">
                                                        <span>{modalidad}</span>
                                                        <span className="text-muted-foreground">{formatCurrency(parseFloat(costo) || 0)}</span>
                                                    </div>
                                                </div>

                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className="min-h-8 h-auto w-full justify-between"
                                                            disabled={adicionales.length === 0 || loadingAdicionales}
                                                        >
                                                            {adicionales.length === 0 ? (
                                                                <span className="text-muted-foreground font-normal">Sin adicionales</span>
                                                            ) : memberConfigs[memberId]?.additionalItemIds?.length > 0 ? (
                                                                <span className="truncate">
                                                                    {memberConfigs[memberId].additionalItemIds.length > 2
                                                                        ? `${memberConfigs[memberId].additionalItemIds.length} seleccionados`
                                                                        : memberConfigs[memberId].additionalItemIds
                                                                            .map(id => adicionales.find(i => String(i.id_aparato) === id)?.Descripcion)
                                                                            .join(", ")
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted-foreground font-normal">Seleccionar aparatos</span>
                                                            )}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[300px] p-0" align="start">
                                                        <Command>
                                                            <CommandInput placeholder="Buscar aparato..." />
                                                            <CommandList>
                                                                <CommandEmpty>No se encontraron aparatos.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {adicionales.map((item) => (
                                                                        <CommandItem
                                                                            key={String(item.id_aparato)}
                                                                            value={item.Descripcion}
                                                                            onSelect={() => handleAdditionalItemToggle(memberId, String(item.id_aparato))}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    memberConfigs[memberId]?.additionalItemIds?.includes(String(item.id_aparato))
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            <div className="flex justify-between w-full">
                                                                                <span>{item.Descripcion}</span>
                                                                                <span className="text-muted-foreground">{formatCurrency(item.Costo)}</span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="w-full lg:w-[400px] bg-muted/10 flex flex-col border-t lg:border-t-0 lg:border-l">
                        <div className="p-4 border-b bg-muted/20">
                            <h3 className="font-semibold text-lg">Resumen</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-6 space-y-6">
                                {selectedMembers.size === 0 ? (
                                    <p className="text-sm text-center text-muted-foreground py-10">
                                        Selecciona miembros para ver el resumen.
                                    </p>
                                ) : (
                                    Array.from(selectedMembers).map((memberId) => {
                                        const member = afiliados.find((m) => String(m.id_afiliado) === memberId)
                                        const config = memberConfigs[memberId]
                                        // const modality = MOCK_MODALITIES.find((m) => m.id === config.modalityId)
                                        const additionalItems = config?.additionalItemIds
                                            .map((id) => adicionales.find((i) => String(i.id_aparato) === id))
                                            .filter((item): item is AdicionalEventoItem => !!item) || []

                                        if (!member) return null
                                        const fullName = `${member.Nombre} ${member.Paterno} ${member.Materno || ""}`.trim();

                                        return (
                                            <div key={memberId} className="space-y-2">
                                                <div className="font-semibold text-sm flex items-center gap-2">
                                                    <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center rounded-full shrink-0">
                                                        <Check className="h-3 w-3" />
                                                    </Badge>
                                                    {fullName}
                                                </div>
                                                <div className="pl-7 text-sm space-y-1">
                                                    <div className="flex justify-between text-muted-foreground">
                                                        <span className="truncate pr-2">{modalidad}</span>
                                                        <span className="shrink-0">{formatCurrency(parseFloat(costo) || 0)}</span>
                                                    </div>
                                                    {additionalItems.map((item) => (
                                                        <div key={String(item.id_aparato)} className="flex justify-between text-muted-foreground">
                                                            <span className="truncate pr-2">+ {item.Descripcion}</span>
                                                            <span className="shrink-0">{formatCurrency(item.Costo)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Separator className="my-2 opacity-50" />
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-background border-t space-y-4 shadow-sm">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Método de pago</label>
                                    <Select
                                        value={selectedPaymentMethod?.toString() || ""}
                                        onValueChange={(val) => setSelectedPaymentMethod(Number(val))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Catalogo_formas_pago.map((method) => (
                                                <SelectItem key={method.id} value={method.id.toString()}>
                                                    {method.Nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 pt-2 border-t">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Miembros:</span>
                                        <Badge variant="secondary" className="px-2">
                                            {totals.itemsCount}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg">Total:</span>
                                        <span className="font-bold text-xl text-teal-600">
                                            {formatCurrency(totals.totalCost)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Button
                                    className="w-full bg-teal-600 hover:bg-teal-700"
                                    size="lg"
                                    onClick={handleRegister}
                                    disabled={totals.itemsCount === 0 || isRegistrationClosed}
                                >
                                    {isRegistrationClosed ? "Inscripciones Cerradas" : "Inscribir"}
                                </Button>
                                <DialogClose asChild>
                                    <Button variant="outline" className="w-full">
                                        Cancelar
                                    </Button>
                                </DialogClose>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
