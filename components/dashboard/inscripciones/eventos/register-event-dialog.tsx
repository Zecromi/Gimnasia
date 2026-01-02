"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
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

// --- Mock Data ---

const MOCK_MEMBERS = [
    { id: "m1", name: "Juan Pérez" },
    { id: "m2", name: "María López" },
    { id: "m3", name: "Carlos Sánchez" },
    { id: "m4", name: "Ana Torres" },
    { id: "m5", name: "Luis Ramírez" },
    { id: "m6", name: "Sofía Herrera" },
]

const MOCK_MODALITIES = [
    { id: "mod1", name: "Gimnasia Artística Femenil", cost: 500 },
    { id: "mod2", name: "Gimnasia Artistica Varonil", cost: 800 },
    { id: "mod3", name: "Gimansia de Trampolin", cost: 1200 },
]

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
    modalityId: string
    additionalItemIds: string[]
}

interface RegisterEventDialogProps {
    children: React.ReactNode
    eventoId: string
    eventoName?: string
}

export function RegisterEventDialog({ children, eventoId, eventoName }: RegisterEventDialogProps) {
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())

    // Initialize config for all members with defaults
    const [memberConfigs, setMemberConfigs] = useState<Record<string, MemberConfig>>(() => {
        const initialConfigs: Record<string, MemberConfig> = {}
        MOCK_MEMBERS.forEach(member => {
            initialConfigs[member.id] = {
                modalityId: MOCK_MODALITIES[0].id,
                additionalItemIds: []
            }
        })
        return initialConfigs
    })

    const handleSelectMember = (memberId: string, checked: boolean) => {
        const newSelected = new Set(selectedMembers)
        if (checked) {
            newSelected.add(memberId)
        } else {
            newSelected.delete(memberId)
        }
        setSelectedMembers(newSelected)
    }

    const handleModalityChange = (memberId: string, value: string) => {
        setMemberConfigs(prev => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                modalityId: value
            }
        }))
    }

    const handleAdditionalItemToggle = (memberId: string, itemId: string) => {
        setMemberConfigs(prev => {
            const currentIds = prev[memberId].additionalItemIds
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

    const toggleAll = (checked: boolean) => {
        if (checked) {
            setSelectedMembers(new Set(MOCK_MEMBERS.map(m => m.id)))
        } else {
            setSelectedMembers(new Set())
        }
    }

    // Calculations
    const totals = useMemo(() => {
        let itemsCount = 0
        let additionalItemsCost = 0
        let totalCost = 0

        selectedMembers.forEach(memberId => {
            itemsCount++
            const config = memberConfigs[memberId]

            const modality = MOCK_MODALITIES.find(m => m.id === config.modalityId)
            const modCost = modality?.cost || 0

            let itemsCost = 0
            config.additionalItemIds.forEach(itemId => {
                const item = MOCK_ADDITIONAL_ITEMS.find(i => i.id === itemId)
                if (item) itemsCost += item.cost
            })

            additionalItemsCost += itemsCost
            totalCost += (modCost + itemsCost)
        })

        return { itemsCount, additionalItemsCost, totalCost }
    }, [selectedMembers, memberConfigs])

    const handleRegister = () => {
        toast.success("Inscripción exitosa", {
            description: `Se han inscrito ${totals.itemsCount} miembros.`,
        })
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

            <DialogContent className="max-w-[95vw] w-full lg:max-w-7xl h-[85vh] gap-0 p-0 overflow-hidden flex flex-col">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle>Inscripción al evento: <span className="text-teal-600">{eventoName}</span></DialogTitle>
                </DialogHeader>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Left Column: Member Table */}
                    <div className="flex-1 border-r flex flex-col min-w-0">
                        <div className="p-4 border-b bg-muted/30 grid grid-cols-[40px_1fr_1.5fr_1.5fr] gap-4 items-center text-sm font-medium text-muted-foreground mr-4">
                            <Checkbox
                                checked={selectedMembers.size === MOCK_MEMBERS.length && MOCK_MEMBERS.length > 0}
                                onCheckedChange={(checked) => toggleAll(!!checked)}
                            />
                            <span>Nombre</span>
                            <span>Costo (Modalidad)</span>
                            <span>Aparatos Adicionales</span>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-4 min-w-[600px]"> {/* Ensure min width for table content */}
                                <div className="space-y-4">
                                    {MOCK_MEMBERS.map((member) => (
                                        <div key={member.id} className="grid grid-cols-[40px_1fr_1.5fr_1.5fr] gap-4 items-center">
                                            <Checkbox
                                                checked={selectedMembers.has(member.id)}
                                                onCheckedChange={(checked) => handleSelectMember(member.id, !!checked)}
                                            />
                                            <span className="text-sm font-medium">{member.name}</span>

                                            <Select
                                                value={memberConfigs[member.id].modalityId}
                                                onValueChange={(val) => handleModalityChange(member.id, val)}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {MOCK_MODALITIES.map(mod => (
                                                        <SelectItem key={mod.id} value={mod.id}>
                                                            <div className="flex justify-between w-full gap-2">
                                                                <span>{mod.name}</span>
                                                                <span className="text-muted-foreground">{formatCurrency(mod.cost)}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="min-h-8 h-auto w-full justify-between"
                                                    >
                                                        {memberConfigs[member.id].additionalItemIds.length > 0 ? (
                                                            <span className="truncate">
                                                                {memberConfigs[member.id].additionalItemIds.length > 2
                                                                    ? `${memberConfigs[member.id].additionalItemIds.length} seleccionados`
                                                                    : memberConfigs[member.id].additionalItemIds
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
                                                                        onSelect={() => handleAdditionalItemToggle(member.id, item.id)}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                memberConfigs[member.id].additionalItemIds.includes(item.id)
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
                                    ))}
                                </div>
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="w-[350px] bg-muted/10 flex flex-col border-l">
                        <div className="p-2 border-b bg-muted/20">
                            <h3 className="font-semibold text-lg">Resumen</h3>
                        </div>

                        <ScrollArea className="h-[490px]">
                            <div className="p-6 space-y-6">
                                {selectedMembers.size === 0 ? (
                                    <p className="text-sm text-center text-muted-foreground py-10">
                                        Selecciona miembros para ver el resumen.
                                    </p>
                                ) : (
                                    Array.from(selectedMembers).map((memberId) => {
                                        const member = MOCK_MEMBERS.find((m) => m.id === memberId)
                                        const config = memberConfigs[memberId]
                                        const modality = MOCK_MODALITIES.find((m) => m.id === config.modalityId)
                                        const additionalItems = config.additionalItemIds
                                            .map((id) => MOCK_ADDITIONAL_ITEMS.find((i) => i.id === id))
                                            .filter((item): item is typeof MOCK_ADDITIONAL_ITEMS[0] => !!item)

                                        if (!member) return null

                                        return (
                                            <div key={memberId} className="space-y-2">
                                                <div className="font-semibold text-sm flex items-center gap-2">
                                                    <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center rounded-full shrink-0">
                                                        <Check className="h-3 w-3" />
                                                    </Badge>
                                                    {member.name}
                                                </div>
                                                <div className="pl-7 text-sm space-y-1">
                                                    <div className="flex justify-between text-muted-foreground">
                                                        <span className="truncate pr-2">{modality?.name}</span>
                                                        <span className="shrink-0">{formatCurrency(modality?.cost || 0)}</span>
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
                            <div className="space-y-2">
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
                            <div className="space-y-2">
                                <Button
                                    className="w-full bg-teal-600 hover:bg-teal-700"
                                    size="lg"
                                    onClick={handleRegister}
                                    disabled={totals.itemsCount === 0}
                                >
                                    Inscribir
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
