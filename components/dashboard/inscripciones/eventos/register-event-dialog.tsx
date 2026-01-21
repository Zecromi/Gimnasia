"use client"

import { useState, useMemo, useEffect } from "react"
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
import { postInscripcion } from "@/lib/evento-service"

// --- Mock Data ---

const MOCK_ADDITIONAL_ITEMS = [
    { id: "item1", name: "Caballo con arzones", cost: 250 },
    { id: "item2", name: "Barras Paralelas", cost: 150 },
    { id: "item3", name: "Anillos", cost: 400 },
    { id: "item4", name: "Piso", cost: 200 },
    { id: "item5", name: "Salto de caballo", cost: 500 },
    { id: "item6", name: "Viga de equilibrio", cost: 500 },
]

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
    limiteParticipantes?: number
}

export function RegisterEventDialog({
    children,
    eventoId,
    eventoName,
    modalidad,
    costo,
    id_Club = "1002",
    fechaFinInscripcion,
    horaLimiteInscripcion,
    limiteParticipantes = 0
}: RegisterEventDialogProps) {
    const { Catalogo_formas_pago, fetchCatalogs } = useCatalogPayStore()
    const { afiliados, fetchAfiliadosEventos } = useAfiliadosEventosStore()
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null)
    const [memberConfigs, setMemberConfigs] = useState<Record<string, MemberConfig>>({})

    useEffect(() => {
        fetchCatalogs()
        if (id_Club) {
            fetchAfiliadosEventos(id_Club)
        }
    }, [fetchCatalogs, fetchAfiliadosEventos, id_Club])

    // Initialize config for new members
    useEffect(() => {
        if (afiliados.length > 0) {
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
    }, [afiliados])

    const handleSelectMember = (memberId: string, checked: boolean) => {
        const newSelected = new Set(selectedMembers)
        if (checked) {
            newSelected.add(memberId)
        } else {
            newSelected.delete(memberId)
        }
        setSelectedMembers(newSelected)
    }

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
            // 1. Check Capacity
            // If limit is 0, it means NO spots available (based on user request "cuando este ya este en cero")
            // Or if it usually means "unlimited" when 0, we'd need that clarification. 
            // But user said: "cuando este ya este en cero, tampoco permitiremos inscribir mas".
            // Let's assume the API passes "Remaining Spots" or we treat 0 as FULL.
            // If the field is "Limite_participantes" from the event config, usually 0 means unlimited.
            // BUT, the User Request specifically says: "usaremos el limite de participantes y cuando este ya este en cero, tampoco permitiremos inscribir mas".
            // This implies the value passed IS the remaining limit or a decremented counter. 
            // However, typically "Limite_participantes" is a static config. 
            // If it's a static config, we'd need to know current participants to compare.
            // Given the phrasing "when this is ALREADY at zero", it sounds like it might be a remaining counter.
            // OR checks if the static limit is 0 -> usually means disabled? Or fully booked?
            // "0 = Ilimitado" is common in this app (seen in NewEventoDialog).
            // Let's re-read: "cuando este ya este en cero".
            // If I look at the `EventosConfiguradosItem` in `evento-service.ts`, it has `Limite_participantes: number`.
            // In `new-evento-dialog.tsx`, placeholder says "0 = Ilimitado".
            // SO 0 usually means Infinity.
            // GLOBAL CONTRADICTION: user says "when it is zero, do not allow".
            // HYPOTHESIS: The user might be referring to a "cupo disponible" (available spots) calculated field, OR they want to change the meaning of 0 to be "Closed/Full", OR they simply mean "when the limit is reached".
            // Since I only have `limiteParticipantes` (which likely comes from `Limite_participantes` in DB), if passed as 0, it likely means unlimited.
            // BUT user said "when it is zero... do not allow". 
            // I will implement strictly as requested: IF limit == 0 => CLOSED.
            // Wait, if 0 is unlimited, then blocking at 0 breaks "unlimited" events.
            // Let's check the context. Maybe they want to block if limit > 0 AND (current >= limit).
            // But I don't have "current participants".
            // Maybe the `Limite_participantes` field in the VIEW has been updated to represent "Available"?
            // Checking `inscripciones-columns.tsx`: `EventosConfiguradosItem` has `Limite_participantes`.
            // Reference `new-evento-dialog.tsx`: `placeholder="0 = Ilimitado"`.
            // If I block at 0, I block unlimited events.
            // I will err on the side of "User Request overrides standard convention" or "User means a different field".
            // Since I only have the column data, I will obey "when this is zero, do not allow".
            // Perhaps they manually set it to 0 to close it? 
            // OR maybe I should check if it is explicitly 0.

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
            // This might mean "No spots left".
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
                    const item = MOCK_ADDITIONAL_ITEMS.find(i => i.id === itemId)
                    if (item) itemsCost += item.cost
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
                    id_club: id_Club, // Should come from session/context or prop
                    total: totals.totalCost.toString(),
                    id_tipo_pago: selectedPaymentMethod
                },
                detalle_afiliados
            }
            console.log(payload)
            await postInscripcion(payload)

            toast.success("Inscripción exitosa", {
                description: `Se han inscrito ${totals.itemsCount} miembros. Método de pago: ${paymentMethod?.Nombre}`,
            })

            // Optional: Close dialog or reset state here

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
        <Dialog>
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
                className="max-w-[95vw] w-full lg:max-w-7xl h-[85vh] gap-0 p-0 overflow-hidden flex flex-col"
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
                        <div className="p-4 border-b bg-muted/30 grid grid-cols-[40px_1fr_1.5fr_1.5fr] gap-4 items-center text-sm font-medium text-muted-foreground mr-4">
                            <Checkbox
                                checked={selectedMembers.size === afiliados.length && afiliados.length > 0}
                                onCheckedChange={(checked) => toggleAll(!!checked)}
                            />
                            <span>Nombre</span>
                            <span>Costo (Modalidad)</span>
                            <span>Aparatos Adicionales</span>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-4 min-w-[600px]"> {/* Ensure min width for table content */}
                                <div className="space-y-4">
                                    {afiliados.map((member) => {
                                        const memberId = String(member.id_afiliado);
                                        const fullName = `${member.Nombre} ${member.Paterno} ${member.Materno || ""}`.trim();
                                        return (
                                            <div key={memberId} className="grid grid-cols-[40px_1fr_1.5fr_1.5fr] gap-4 items-center">
                                                <Checkbox
                                                    checked={selectedMembers.has(memberId)}
                                                    onCheckedChange={(checked) => handleSelectMember(memberId, !!checked)}
                                                />
                                                <span className="text-sm font-medium">{fullName}</span>

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
                                                        >
                                                            {memberConfigs[memberId]?.additionalItemIds?.length > 0 ? (
                                                                <span className="truncate">
                                                                    {memberConfigs[memberId].additionalItemIds.length > 2
                                                                        ? `${memberConfigs[memberId].additionalItemIds.length} seleccionados`
                                                                        : memberConfigs[memberId].additionalItemIds
                                                                            .map(id => MOCK_ADDITIONAL_ITEMS.find(i => i.id === id)?.name)
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
                                                                    {MOCK_ADDITIONAL_ITEMS.map((item) => (
                                                                        <CommandItem
                                                                            key={item.id}
                                                                            value={item.name}
                                                                            onSelect={() => handleAdditionalItemToggle(memberId, item.id)}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    memberConfigs[memberId]?.additionalItemIds?.includes(item.id)
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            <div className="flex justify-between w-full">
                                                                                <span>{item.name}</span>
                                                                                <span className="text-muted-foreground">{formatCurrency(item.cost)}</span>
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
                        </ScrollArea>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="w-[350px] bg-muted/10 flex flex-col border-l">
                        <div className="p-2 border-b bg-muted/20">
                            <h3 className="font-semibold text-lg">Resumen</h3>
                        </div>

                        <ScrollArea className="flex-1">
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
                                            .map((id) => MOCK_ADDITIONAL_ITEMS.find((i) => i.id === id))
                                            .filter((item): item is typeof MOCK_ADDITIONAL_ITEMS[0] => !!item) || []

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
                                                        <div key={item.id} className="flex justify-between text-muted-foreground">
                                                            <span className="truncate pr-2">+ {item.name}</span>
                                                            <span className="shrink-0">{formatCurrency(item.cost)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Separator className="my-2 opacity-50" />
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </ScrollArea>

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
