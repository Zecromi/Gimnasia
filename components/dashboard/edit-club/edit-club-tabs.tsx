"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Database, FileText, Building2, Key, MapPin } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { ViewClubGral, Estado } from "@/lib/club-service"
import { cn } from "@/lib/utils"

const GeneralInfoForm = dynamic(() => import('./general-info-form').then((mod) => mod.GeneralInfoForm), { 
    ssr: false, 
    loading: () => <div className="p-10 flex justify-center"><div className="animate-pulse flex items-center space-x-2 text-teal-600"><span className="font-semibold">Cargando...</span></div></div> 
})

const ModalidadesForm = dynamic(() => import('./modalidades-form').then((mod) => mod.ModalidadesForm), { 
    ssr: false, 
    loading: () => <div className="p-10 flex justify-center"><div className="animate-pulse flex items-center space-x-2 text-teal-600"><span className="font-semibold">Cargando...</span></div></div> 
})

const AccesoForm = dynamic(() => import('./acceso-form').then((mod) => mod.AccesoForm), { 
    ssr: false, 
    loading: () => <div className="p-10 flex justify-center"><div className="animate-pulse flex items-center space-x-2 text-teal-600"><span className="font-semibold">Cargando...</span></div></div> 
})

const LogoForm = dynamic(() => import('./logo-form').then((mod) => mod.LogoForm), { 
    ssr: false, 
    loading: () => <div className="p-10 flex justify-center"><div className="animate-pulse flex items-center space-x-2 text-teal-600"><span className="font-semibold">Cargando...</span></div></div> 
})

const UbicacionForm = dynamic(() => import('./ubicacion-form').then((mod) => mod.UbicacionForm), { 
    ssr: false, 
    loading: () => <div className="p-10 flex justify-center"><div className="animate-pulse flex items-center space-x-2 text-teal-600"><span className="font-semibold">Cargando...</span></div></div> 
})

export function EditClubTabs({ className, id, club, estados }: { className?: string, id: string, club: ViewClubGral, estados: Estado[] }) {
    return (
        <Tabs defaultValue="general" className="h-full flex flex-col">
            <div className="px-6 pt-1">
                <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/80">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="general" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">General</span>
                                    </div>
                                    <span className="sr-only">Información General</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Información General</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="modalidades" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <Database className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Modalidades</span>
                                    </div>
                                    <span className="sr-only">Modalidades</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Modalidades</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="acceso" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <Key className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Acceso</span>
                                    </div>
                                    <span className="sr-only">Acceso</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Control de Acceso</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="logo" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <Building2 className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Logo</span>
                                    </div>
                                    <span className="sr-only">Logo</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Logo del Club</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="ubicacion" className="py-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-teal-900/20 dark:data-[state=active]:text-teal-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-[10px] hidden sm:inline-block">Ubicación</span>
                                    </div>
                                    <span className="sr-only">Ubicación</span>
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ubicación del Club</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <TabsContent value="general" className="m-0 space-y-4">
                            <GeneralInfoForm id={`${id}-general`} club={club} estados={estados} />
                        </TabsContent>
                        <TabsContent value="modalidades" className="m-0">
                            <ModalidadesForm id={`${id}-modalidades`} club={club} />
                        </TabsContent>
                        <TabsContent value="acceso" className="m-0">
                            <AccesoForm id={`${id}-acceso`} club={club} />
                        </TabsContent>
                        <TabsContent value="logo" className="m-0">
                            <LogoForm id={`${id}-logo`} club={club} />
                        </TabsContent>
                        <TabsContent value="ubicacion" className="m-0">
                            <UbicacionForm club={club} />
                        </TabsContent>
                    </div>
                </ScrollArea>
            </div>

        </Tabs>
    )
}
