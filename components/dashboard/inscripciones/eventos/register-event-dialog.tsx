"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown, Calendar, Clock, Users, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogDescription
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    DrawerDescription,
    DrawerFooter
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useCatalogPayStore } from "@/lib/store/catalog-pay-store"
import { useCatalogStore } from "@/lib/store/catalog-store"
import { useAfiliadosEventosStore } from "@/lib/store/afiliados-eventos-store"
import { useAuthStore } from "@/lib/store/auth-store"
import { postInscripcion, getAdicionales, AdicionalEventoItem, getNiveles, NivelConfiguradoItem } from "@/lib/evento-service"

// Mock data removed for additional items as they are now dynamic

// --- Types ---

interface MemberConfig {
    additionalItemIds: string[]
    selectedNivelId?: string
    selectedCategoryId?: string
    isFullDiscount?: boolean
    discountAmount?: number
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

    const { Catalogo_formas_pago, Niveles_tecnicos, fetchCatalogs: fetchPayCatalogs } = useCatalogPayStore()
    const { View_Modalidades_detalle, fetchCatalogs: fetchGlobalCatalogs } = useCatalogStore()
    const { afiliados, fetchAfiliadosEventos } = useAfiliadosEventosStore()
    const [open, setOpen] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null)
    const [memberConfigs, setMemberConfigs] = useState<Record<string, MemberConfig>>({})
    const [adicionales, setAdicionales] = useState<AdicionalEventoItem[]>([])
    const [niveles, setNiveles] = useState<NivelConfiguradoItem[]>([])
    const [loadingAdicionales, setLoadingAdicionales] = useState(true)
    const [loadingNiveles, setLoadingNiveles] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return

        fetchPayCatalogs()
        fetchGlobalCatalogs()
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

        const fetchNiveles = async () => {
            if (!eventoId) return
            try {
                setLoadingNiveles(true)
                const data = await getNiveles(eventoId)
                // Filter out levels where id_categoria is null or "null" or 0 as requested
                const validNiveles = (data.Niveles || []).filter(n =>
                    n.id_categoria !== null &&
                    String(n.id_categoria) !== "null" &&
                    n.id_categoria !== 0
                )
                setNiveles(validNiveles)
            } catch (error) {
                console.error("Error fetching niveles:", error)
            } finally {
                setLoadingNiveles(false)
            }
        }

        fetchAdicionales()
        fetchNiveles()
    }, [open, fetchAfiliadosEventos, clubIdToUse, eventoId])

    // Initialize config for new members
    useEffect(() => {
        if (open && afiliados.length > 0) {
            setMemberConfigs(prev => {
                const newConfigs: Record<string, MemberConfig> = { ...prev }
                afiliados.forEach(member => {
                    const memberId = String(member.id_afiliado)
                    if (!newConfigs[memberId]) {
                        newConfigs[memberId] = {
                            additionalItemIds: [],
                            selectedNivelId: undefined,
                            selectedCategoryId: undefined,
                            isFullDiscount: false,
                            discountAmount: 0
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
                resetConfigs[key] = {
                    additionalItemIds: [],
                    selectedNivelId: undefined,
                    selectedCategoryId: undefined,
                    isFullDiscount: false,
                    discountAmount: 0
                }
            })
            return resetConfigs
        })
    }, [])

    const handleNivelSelect = (memberId: string, nivelId: string, categoryId: string) => {
        setMemberConfigs(prev => {
            const isCurrent = prev[memberId]?.selectedNivelId === nivelId &&
                prev[memberId]?.selectedCategoryId === categoryId

            return {
                ...prev,
                [memberId]: {
                    ...prev[memberId],
                    selectedNivelId: isCurrent ? undefined : nivelId,
                    selectedCategoryId: isCurrent ? undefined : categoryId
                }
            }
        })
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

    const handleFullDiscountToggle = (memberId: string, checked: boolean) => {
        setMemberConfigs(prev => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                isFullDiscount: checked,
                discountAmount: checked ? 0 : prev[memberId]?.discountAmount || 0
            }
        }))
    }

    const handleDiscountAmountChange = (memberId: string, value: string) => {
        const amount = parseFloat(value) || 0
        setMemberConfigs(prev => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                discountAmount: amount,
                isFullDiscount: amount > 0 ? false : prev[memberId]?.isFullDiscount
            }
        }))
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

        // Also clear all discounts when toggling Select All
        setMemberConfigs(prev => {
            const newConfigs = { ...prev }
            Object.keys(newConfigs).forEach(key => {
                newConfigs[key] = {
                    ...newConfigs[key],
                    isFullDiscount: false,
                    discountAmount: 0
                }
            })
            return newConfigs
        })
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

            // If a level and category are selected, ADD that specific cost to base
            let modCost = numericCost
            if (config?.selectedNivelId && config?.selectedCategoryId) {
                const selectedNivel = niveles.find(n =>
                    String(n.id_nivel) === config.selectedNivelId &&
                    String(n.id_categoria) === config.selectedCategoryId
                )
                if (selectedNivel) {
                    const nivelCost = typeof selectedNivel.costo === 'string' ? parseFloat(selectedNivel.costo) : (selectedNivel.costo || 0)
                    modCost += nivelCost
                }
            }

            let itemsCost = 0
            if (config) {
                config.additionalItemIds.forEach(itemId => {
                    const item = adicionales.find(i => String(i.id_aparato) === itemId)
                    if (item) itemsCost += item.Costo
                })
            }

            additionalItemsCost += itemsCost

            let finalCost = (modCost + itemsCost)
            if (config?.isFullDiscount) {
                finalCost = 0
            } else if (config?.discountAmount) {
                finalCost = Math.max(0, finalCost - config.discountAmount)
            }

            totalCost += finalCost
        })

        return { itemsCount, additionalItemsCost, totalCost }
    }, [selectedMembers, memberConfigs, costo, niveles, adicionales])

    const handleRegister = async () => {
        if (!selectedPaymentMethod) {
            toast.error("Por favor selecciona un método de pago")
            return
        }

        const paymentMethod = Catalogo_formas_pago.find(p => p.id === selectedPaymentMethod)

        try {
            setIsSubmitting(true)
            const detalle_afiliados = Array.from(selectedMembers).map(memberId => {
                const config = memberConfigs[memberId]
                const aparatos = config?.additionalItemIds.map(itemId => ({
                    id_aparato: itemId
                })) || []

                // Calculate base cost for this member (Base Cost + Level Cost)
                let modCost = parseFloat(costo) || 0
                if (config?.selectedNivelId && config?.selectedCategoryId) {
                    const selectedNivel = niveles.find(n =>
                        String(n.id_nivel) === config.selectedNivelId &&
                        String(n.id_categoria) === config.selectedCategoryId
                    )
                    if (selectedNivel) {
                        const nivelCost = typeof selectedNivel.costo === 'string' ? parseFloat(selectedNivel.costo) : (selectedNivel.costo || 0)
                        modCost += nivelCost
                    }
                }

                let itemsCost = 0
                config?.additionalItemIds.forEach(itemId => {
                    const item = adicionales.find(i => String(i.id_aparato) === itemId)
                    if (item) itemsCost += item.Costo
                })

                const memberSubtotal = modCost + itemsCost
                let memberDiscount = 0
                if (config?.isFullDiscount) {
                    memberDiscount = memberSubtotal
                } else if (config?.discountAmount) {
                    memberDiscount = Math.min(memberSubtotal, config.discountAmount)
                }

                return {
                    id_afiliado: String(memberId),
                    costo: memberSubtotal.toString(),
                    descuento: memberDiscount.toString(),
                    id_categoria: String(config?.selectedCategoryId || "0"),
                    id_nivel: String(config?.selectedNivelId || "0"),
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
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount)
    }

    const content = (
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0 h-full">
            {/* Left Column: Member Table */}
            <div className="flex-[1.8] flex flex-col min-w-0 bg-background border-b lg:border-b-0 lg:border-r min-h-0 h-full">
                <ScrollArea className="flex-1 h-full">
                    <div className="lg:min-w-[800px] flex flex-col">
                        {/* Sticky Header: Fixed at top, and moves horizontally with ScrollArea */}
                        <div className="sticky top-0 z-20 p-4 border-b bg-muted/80 backdrop-blur-md grid grid-cols-[40px_1fr_120px] md:grid-cols-[40px_minmax(120px,1.5fr)_minmax(180px,2fr)_minmax(180px,2fr)_minmax(140px,1.2fr)] gap-2 md:gap-4 items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <Checkbox
                                checked={selectedMembers.size === afiliados.length && afiliados.length > 0}
                                onCheckedChange={(checked) => toggleAll(!!checked)}
                            />
                            <span className="truncate">Miembro</span>
                            <span className="truncate hidden md:block">Costo (Nivel)</span>
                            <span className="truncate hidden md:block">Aparatos</span>
                            <span className="truncate">Descuento</span>
                        </div>
                        <div className="p-4 space-y-0 overflow-y-auto overflow-x-auto h-full">
                            {afiliados.map((member) => {
                                const memberId = String(member.id_afiliado);
                                const fullName = `${member.Nombre} ${member.Paterno} ${member.Materno || ""}`.trim();
                                const isSelected = selectedMembers.has(memberId);
                                const config = memberConfigs[memberId];

                                return (
                                    <div key={memberId} className="grid grid-cols-[40px_1fr_120px] md:grid-cols-[40px_minmax(120px,1.5fr)_minmax(180px,2fr)_minmax(180px,2fr)_minmax(140px,1.2fr)] gap-2 md:gap-4 items-center py-2 px-1 hover:bg-muted/5 rounded-lg transition-colors">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={(checked) => handleSelectMember(memberId, !!checked)}
                                        />
                                        <span className="text-sm font-medium truncate" title={fullName}>{fullName}</span>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="hidden md:flex min-h-8 h-auto w-full justify-between font-normal"
                                                    disabled={!isSelected || niveles.length === 0 || loadingNiveles}
                                                >
                                                    {niveles.length === 0 ? (
                                                        <div className="flex justify-between w-full gap-2">
                                                            <span>{modalidad}</span>
                                                            <span className="text-muted-foreground">{formatCurrency(parseFloat(costo) || 0)}</span>
                                                        </div>
                                                    ) : memberConfigs[memberId]?.selectedNivelId && memberConfigs[memberId]?.selectedCategoryId ? (
                                                        <div className="flex justify-between w-full gap-2 text-xs">
                                                            <span className="truncate max-w-[120px]">
                                                                {(() => {
                                                                    const nivelDesc = Niveles_tecnicos.find(nt => nt.id === Number(memberConfigs[memberId].selectedNivelId))?.Descripcion || "Nivel"
                                                                    const catTitle = View_Modalidades_detalle.find(d => d.id_categoria === Number(memberConfigs[memberId].selectedCategoryId))?.titulo || "Cat"
                                                                    return `${catTitle}`
                                                                })()}
                                                            </span>
                                                            <span className="text-teal-600 font-semibold shrink-0">
                                                                {(() => {
                                                                    const n = niveles.find(l =>
                                                                        String(l.id_nivel) === memberConfigs[memberId].selectedNivelId &&
                                                                        String(l.id_categoria) === memberConfigs[memberId].selectedCategoryId
                                                                    );
                                                                    const nivelCost = typeof n?.costo === 'string' ? parseFloat(n.costo) : (n?.costo || 0)
                                                                    return formatCurrency((parseFloat(costo) || 0) + nivelCost);
                                                                })()}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">Seleccionar</span>
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[350px] p-0" align="start" side="bottom">
                                                <Command>
                                                    <CommandInput placeholder="Buscar nivel/categoria..." />
                                                    <CommandList>
                                                        <CommandEmpty>No se encontraron niveles.</CommandEmpty>
                                                        <CommandGroup>
                                                            {niveles.map((item) => {
                                                                const nivelDesc = Niveles_tecnicos.find(nt => nt.id === item.id_nivel)?.Descripcion || `Nivel ${item.id_nivel}`;
                                                                const catTitle = View_Modalidades_detalle.find(d => d.id_categoria === item.id_categoria)?.titulo || `Categoria ${item.id_categoria}`;
                                                                const fullDesc = `${nivelDesc} - ${catTitle}`;
                                                                const itemKey = `${item.id_nivel}-${item.id_categoria}`;
                                                                const isSelected = memberConfigs[memberId]?.selectedNivelId === String(item.id_nivel) &&
                                                                    memberConfigs[memberId]?.selectedCategoryId === String(item.id_categoria);

                                                                return (
                                                                    <CommandItem
                                                                        key={itemKey}
                                                                        value={fullDesc}
                                                                        onSelect={() => handleNivelSelect(memberId, String(item.id_nivel), String(item.id_categoria))}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                isSelected ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        <div className="flex justify-between w-full gap-2">
                                                                            <span className="truncate">{fullDesc}</span>
                                                                            <span className="text-muted-foreground shrink-0">{formatCurrency(typeof item.costo === 'string' ? parseFloat(item.costo) : item.costo)}</span>
                                                                        </div>
                                                                    </CommandItem>
                                                                );
                                                            })}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="hidden md:flex min-h-8 h-auto w-full justify-between font-normal"
                                                    disabled={!isSelected || adicionales.length === 0 || loadingAdicionales}
                                                >
                                                    {adicionales.length === 0 ? (
                                                        <span className="text-muted-foreground italic">Sin adicionales</span>
                                                    ) : memberConfigs[memberId]?.additionalItemIds?.length > 0 ? (
                                                        <span className="truncate text-xs">
                                                            {memberConfigs[memberId].additionalItemIds.length > 1
                                                                ? `${memberConfigs[memberId].additionalItemIds.length} seleccionados`
                                                                : adicionales.find(i => String(i.id_aparato) === memberConfigs[memberId].additionalItemIds[0])?.Descripcion
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">Elegir</span>
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0" align="start" side="bottom">
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

                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <Checkbox
                                                    id={`full-discount-${memberId}`}
                                                    checked={config?.isFullDiscount || false}
                                                    onCheckedChange={(checked) => handleFullDiscountToggle(memberId, !!checked)}
                                                    disabled={!isSelected}
                                                />
                                                <label htmlFor={`full-discount-${memberId}`} className="text-[10px] leading-none font-medium text-muted-foreground cursor-pointer">
                                                    Exento
                                                </label>
                                            </div>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                className="h-8 text-xs px-2 w-full"
                                                value={config?.discountAmount || ""}
                                                onChange={(e) => handleDiscountAmountChange(memberId, e.target.value)}
                                                disabled={!isSelected || config?.isFullDiscount}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Right Column: Summary */}
            <div className="flex-1 md:flex-none md:w-[380px] md:shrink-0 lg:w-[420px] flex flex-col min-h-0 bg-muted/5 border-t md:border-t-0 md:border-l">
                <div className="p-4 border-b bg-muted/20 shrink-0">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full h-6 w-6 p-0 flex items-center justify-center bg-background">
                            {selectedMembers.size}
                        </Badge>
                        Resumen de Selección
                    </h3>
                </div>


                <ScrollArea className="max-h-[calc(100vh-220px)] md:max-h-[600px] lg:max-h-[calc(100vh-280px)]">
                    <div className="p-6 space-y-6">
                        {selectedMembers.size === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-60">
                                <Users className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground max-w-[180px]">
                                    Selecciona miembros de la lista para ver el resumen de costos.
                                </p>
                            </div>
                        ) : (
                            <Accordion type="multiple" className="w-full">
                                {Array.from(selectedMembers).map((memberId) => {
                                    const member = afiliados.find((m) => String(m.id_afiliado) === memberId)
                                    const config = memberConfigs[memberId]
                                    const additionalItems = config?.additionalItemIds
                                        .map((id) => adicionales.find((i) => String(i.id_aparato) === id))
                                        .filter((item): item is AdicionalEventoItem => !!item) || []

                                    if (!member) return null
                                    const fullName = `${member.Nombre} ${member.Paterno} ${member.Materno || ""}`.trim();

                                    return (
                                        <AccordionItem key={memberId} value={memberId} className="border-b last:border-b">
                                            <AccordionTrigger className="hover:no-underline py-3">
                                                <div className="flex items-center gap-2 text-sm font-semibold">
                                                    <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center rounded-full shrink-0 bg-background">
                                                        <Check className="h-3 w-3" />
                                                    </Badge>
                                                    <span>{fullName}</span>
                                                    <span className="ml-auto mr-4 text-teal-600 font-bold">
                                                        {formatCurrency(parseFloat(costo) || 0)}
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="pl-7 text-xs space-y-1.5 pt-2 pb-3">
                                                    <div className="flex justify-between text-muted-foreground">
                                                        <span className="truncate pr-2">{modalidad}</span>
                                                        <span className="shrink-0">{formatCurrency(parseFloat(costo) || 0)}</span>
                                                    </div>
                                                    {config?.selectedNivelId && config?.selectedCategoryId && (
                                                        <div className="flex justify-between text-muted-foreground">
                                                            <span className="truncate pr-2 italic">
                                                                {(() => {
                                                                    const nivelDesc = Niveles_tecnicos.find(nt => nt.id === Number(config.selectedNivelId))?.Descripcion || "Nivel"
                                                                    const catTitle = View_Modalidades_detalle.find(d => d.id_categoria === Number(config.selectedCategoryId))?.titulo || "Cat"
                                                                    return `+ ${nivelDesc} - ${catTitle}`
                                                                })()}
                                                            </span>
                                                            <span className="shrink-0">
                                                                {(() => {
                                                                    const n = niveles.find(l =>
                                                                        String(l.id_nivel) === config.selectedNivelId &&
                                                                        String(l.id_categoria) === config.selectedCategoryId
                                                                    );
                                                                    const nivelCost = typeof n?.costo === 'string' ? parseFloat(n.costo) : (n?.costo || 0)
                                                                    return formatCurrency(nivelCost);
                                                                })()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {additionalItems.map((item) => (
                                                        <div key={String(item.id_aparato)} className="flex justify-between text-muted-foreground">
                                                            <span className="truncate pr-2">+ {item.Descripcion}</span>
                                                            <span className="shrink-0">{formatCurrency(item.Costo)}</span>
                                                        </div>
                                                    ))}
                                                    {(config?.isFullDiscount || (config?.discountAmount || 0) > 0) && (
                                                        <div className="flex justify-between text-teal-600 font-medium pt-1 border-t border-dashed border-teal-100 mt-1">
                                                            <span className="truncate pr-2">- Descuento {config.isFullDiscount ? "Total" : ""}</span>
                                                            <span className="shrink-0">
                                                                {(() => {
                                                                    let d = 0;
                                                                    if (config.isFullDiscount) {
                                                                        const modCost = (() => {
                                                                            let mc = parseFloat(costo) || 0;
                                                                            if (config.selectedNivelId && config.selectedCategoryId) {
                                                                                const n = niveles.find(l => String(l.id_nivel) === config.selectedNivelId && String(l.id_categoria) === config.selectedCategoryId);
                                                                                if (n) {
                                                                                    const nc = typeof n?.costo === 'string' ? parseFloat(n.costo) : (n?.costo || 0);
                                                                                    mc += nc;
                                                                                }
                                                                            }
                                                                            return mc;
                                                                        })();
                                                                        const addonsCost = additionalItems.reduce((acc, it) => acc + it.Costo, 0);
                                                                        d = modCost + addonsCost;
                                                                    } else {
                                                                        d = config.discountAmount || 0;
                                                                    }
                                                                    return formatCurrency(d);
                                                                })()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        )}
                    </div>

                    <div className="p-6 bg-background border-t space-y-0">
                        <div className="space-y-4">
                            <div className="space-y-0">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Método de pago</label>
                                <Select
                                    value={selectedPaymentMethod?.toString() || ""}
                                    onValueChange={(val) => setSelectedPaymentMethod(Number(val))}
                                >
                                    <SelectTrigger className="h-10 bg-muted/20">
                                        <SelectValue placeholder="Seleccionar método..." />
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

                            <div className="pt-2 border-t border-dashed space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Miembros:</span>
                                    <span className="font-medium">{totals.itemsCount}</span>
                                </div>
                                <div className="flex justify-between items-end pt-1">
                                    <span className="font-bold text-base text-foreground">Total:</span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold text-teal-600 leading-none tabular-nums">
                                            {formatCurrency(totals.totalCost)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>



            </div>
        </div>
    )

    const isMobile = useIsMobile()

    const trigger = (
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
    )

    const header = (
        <>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-muted-foreground">
                {fechaFinInscripcion && (
                    <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded">
                        <Calendar className="h-3.5 w-3.5 text-teal-600" />
                        <span>Cierre: {format(new Date(fechaFinInscripcion), "PPP", { locale: es })}</span>
                    </div>
                )}
                {horaLimiteInscripcion && (
                    <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded">
                        <Clock className="h-3.5 w-3.5 text-teal-600" />
                        <span>{horaLimiteInscripcion}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded">
                    <Users className="h-3.5 w-3.5 text-teal-600" />
                    <span>Cupo: <span className="font-bold text-foreground">{limiteParticipantes}</span></span>
                </div>
            </div>
            {isRegistrationClosed && (
                <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5"></span>
                    <span>{closureReason}</span>
                </div>
            )}
        </>
    )

    const footer = (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
                className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20"
                size="lg"
                onClick={handleRegister}
                disabled={totals.itemsCount === 0 || isRegistrationClosed || isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    isRegistrationClosed ? "Inscripciones Cerradas" : `Confirmar Inscripción (${formatCurrency(totals.totalCost)})`
                )}
            </Button>
            {isMobile ? (
                <DrawerClose asChild>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Cerrar
                    </Button>
                </DrawerClose>
            ) : (
                <DialogClose asChild>
                    <Button variant="outline" size="lg">
                        Cancelar
                    </Button>
                </DialogClose>
            )}
        </div>
    )

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="h-[96vh] max-h-[96vh]">
                    <DrawerHeader>
                        <DrawerTitle className="text-xl">Inscripción: <span className="text-teal-600">{eventoName}</span></DrawerTitle>
                        <DrawerDescription className="sr-only">Formulario de inscripción para {eventoName}</DrawerDescription>
                        {header}
                    </DrawerHeader>
                    {/* For Mobile: Unify scroll if preferred or keep columns. 
                        Usually for complex forms on mobile, we stack them in a single scroll.
                    */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {content}
                    </div>
                    <DrawerFooter className="border-t bg-background">
                        {footer}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger}
            <DialogContent
                className="max-w-[95vw] w-full lg:max-w-7xl h-[95vh] max-h-[95vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="p-6 pb-2 shrink-0">
                    <DialogTitle className="text-2xl">Inscripción al evento: <span className="text-teal-600">{eventoName}</span></DialogTitle>
                    <DialogDescription className="sr-only">
                        Formulario para seleccionar miembros y configurar los detalles de inscripción para el evento {eventoName}.
                    </DialogDescription>
                    {header}
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {content}
                </div>

                <div className="p-6 border-t bg-muted/10 shrink-0">
                    {footer}
                </div>
            </DialogContent>
        </Dialog>
    )
}
