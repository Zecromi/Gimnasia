"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Save, Database, FileText, Image, BookOpen } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { EventosConfiguradosItem as Evento } from "@/lib/evento-service"
import { cn } from "@/lib/utils"

const GeneralInfoForm = dynamic(() => import('./general-info-form').then((mod) => mod.GeneralInfoForm), { 
    ssr: false, 
    loading: () => <div className="p-10 flex justify-center"><div className="animate-pulse flex items-center space-x-2 text-teal-600"><span className="font-semibold">Cargando...</span></div></div> 
})

const ActualizaEventoForm = dynamic(() => import('./actualiza-evento-form').then((mod) => mod.ActualizaEventoForm), { 
    ssr: false, 
    loading: () => <div className="p-10 flex justify-center"><div className="animate-pulse flex items-center space-x-2 text-teal-600"><span className="font-semibold">Cargando...</span></div></div> 
})

const ModalidadesForm = dynamic(() => import('./modalidades-form').then((mod) => mod.ModalidadesForm), { 
    ssr: false, 
    loading: () => <div className="p-10 flex justify-center"><div className="animate-pulse flex items-center space-x-2 text-teal-600"><span className="font-semibold">Cargando...</span></div></div> 
})

const InfoEventoPdfForm = dynamic(() => import('./info-evento-pdf-form').then((mod) => mod.InfoEventoPdfForm), { 
    ssr: false, 
    loading: () => <div className="p-10 flex justify-center"><div className="animate-pulse flex items-center space-x-2 text-teal-600"><span className="font-semibold">Cargando...</span></div></div> 
})

const PlaceholderForm = dynamic(() => import('./placeholder-form').then((mod) => mod.PlaceholderForm), { 
    ssr: false, 
    loading: () => <div className="p-10 flex justify-center"><div className="animate-pulse flex items-center space-x-2 text-teal-600"><span className="font-semibold">Cargando...</span></div></div> 
})

export function EditEventoTabs({ className, id, evento, onSuccess }: { className?: string, id: string, evento: Evento, onSuccess?: () => void }) {
    const tabsConfig = [
        {
            value: "general",
            icon: FileText,
            label: "Información general",
            tooltip: "Información General",
            content: <GeneralInfoForm id={`${id}-general`} evento={evento} />,
            className: "space-y-4"
        },
        {
            value: "actualizar",
            icon: Save,
            label: "Actualizar Evento",
            tooltip: "Actualizar Evento",
            content: <ActualizaEventoForm id={`${id}-actualizar`} evento={evento} onSuccess={onSuccess} />
        },
        {
            value: "modalidades",
            icon: Database,
            label: "Modalidades",
            tooltip: "Modalidades",
            content: <ModalidadesForm id={`${id}-modalidades`} evento={evento} onSuccess={onSuccess} />
        },
        {
            value: "imagen",
            icon: Image,
            label: "Imagen",
            tooltip: "Imagen del Evento",
            content: <PlaceholderForm title="Imagen" />
        },
        {
            value: "memorias",
            icon: BookOpen,
            label: "Memorias",
            tooltip: "Memorias del Evento",
            content: <PlaceholderForm title="Memorias" icon={BookOpen} />
        },
        {
            value: "info_evento",
            icon: FileText,
            label: "Info. Evento",
            tooltip: "Documento Información del Evento",
            content: <InfoEventoPdfForm id={`${id}-info-evento`} evento={evento} />
        }
    ]

    return (
        <Tabs defaultValue="general" className="flex-1 h-full flex flex-col overflow-hidden">
            <div className="px-6 pt-1 shrink-0">
                <TabsList className="flex w-full sm:w-auto h-auto p-1 bg-muted/80 gap-1">
                    {tabsConfig.map((tab) => (
                        <TooltipProvider key={tab.value}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <TabsTrigger value={tab.value} className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                        <div className="flex flex-col items-center gap-1">
                                            <tab.icon className="h-4 w-4" />
                                            <span className="text-[10px] hidden sm:inline-block">{tab.label}</span>
                                        </div>
                                        <span className="sr-only">{tab.tooltip}</span>
                                    </TabsTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{tab.tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </TabsList>
            </div>

            <div className="flex-1 w-full overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-6">
                        {tabsConfig.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value} className={cn("m-0 focus-visible:outline-none", tab.className)}>
                                {tab.content}
                            </TabsContent>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </Tabs>
    )
}
