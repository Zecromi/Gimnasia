"use client"

import * as React from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { EventosConfiguradosItem as Evento } from "@/lib/evento-service"
import { EditEventoTabs } from "./edit-evento-tabs"

interface EditEventoDialogProps {
    evento: Evento
    children: React.ReactNode
    onSuccess?: () => void
}

export function EditEventoDialog({ evento, children, onSuccess }: EditEventoDialogProps) {
    const [open, setOpen] = React.useState(false)

    const handleSuccess = React.useCallback(() => {
        setOpen(false)
        if (onSuccess) onSuccess()
    }, [onSuccess])

    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="h-[95vh]">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Editar Evento: {evento.Nombre}</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-1 px-4 overflow-hidden">
                        <EditEventoTabs id="edit-evento-form-mobile" evento={evento} onSuccess={handleSuccess} />
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] h-[95vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b shrink-0">
                    <DialogTitle>Editar Evento: {evento.Nombre}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <EditEventoTabs id="edit-evento-form-desktop" evento={evento} onSuccess={handleSuccess} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
