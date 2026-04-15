"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { toast } from "sonner"
import { updateClub, mapStateToClubPayload, getClubDetail, getGlobalInfo, Estado } from "@/lib/club-service"


import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
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
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ViewClubGral } from "@/lib/club-service"
import { EditClubTabs } from "./edit-club/edit-club-tabs"

interface EditClubDialogProps {
    club: ViewClubGral
    children: React.ReactNode
}

export function EditClubDialog({ club, children }: EditClubDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [estados, setEstados] = React.useState<Estado[]>([])
    const isMobile = useIsMobile()

    React.useEffect(() => {
        const fetchInfo = async () => {
            try {
                const globalInfo = await getGlobalInfo()
                if (globalInfo && globalInfo.Estados) {
                    setEstados(globalInfo.Estados)
                }
            } catch (error) {
                console.error("Error fetching global info:", error)
            }
        }
        fetchInfo()
    }, [])


    // Map ViewClubGral to form structure expected by mapStateToClubPayload or directly to inputs
    // The inputs in GeneralInfoForm etc need to be registered
    const methods = useForm({
        defaultValues: {
            nombre: club.Club,
            asociacion: club.Asociacion,
            alias: club.Alias,
            email: club.Email,
            web: club.Web,
            fundacion: club.Fundacion ? club.Fundacion.split("T")[0] : "",
            sector: club.Sector ? "privado" : "publico",
            telPrincipal: club.Telefono1,
            telSecundario: club.Telefono2,
            telMovil: "", // Not in ViewClubGral

            // Addresses - Assuming social address based on available fields or leaving empty if not mapped
            calle: "", // Not in ViewClubGral
            numExt: "",
            numInt: "",
            colonia: "",
            municipio: "",
            estado: "",
            cp: "",

            // Fiscal - Assuming same logic
            rfc: club.rfc,
            igualDomicilio: false,
            calleFiscal: "",
            numExtFiscal: "",
            numIntFiscal: "",
            coloniaFiscal: "",
            municipioFiscal: "",
            estadoFiscal: "",
            cpFiscal: "",

            // Aparatos
            nacionales: club.Tipo_aparatos_nac,
            importados: club.Tipo_aparatos_imp,
            homologados: club.Tipos_aparatos_fig,
            otros: club.Tipos_aparatos_otros,

            tipoInstalaciones: club.Tipo_instalaciones ? "rentadas" : "propias", // Check logic: 1 rentada (true), 0 propia (false)
            organismos: false, // Not in ViewClubGral

            // Access Control
            usuarioAccess: club.usuario || `admin.${club.Club?.toLowerCase().replace(/\s/g, '') || ''}`,
            passwordAccess: club.password || "",

            latitud: "0",
            longitud: "0"
        }
    })

    React.useEffect(() => {
        const fetchDetails = async () => {
            if (!club.id) return
            try {
                const details = await getClubDetail(club.id)
                if (details && details.Clubs && details.Clubs.length > 0) {
                    const c = details.Clubs[0]
                    const postal = details.DireccionPostal && details.DireccionPostal.length > 0 ? details.DireccionPostal[0] : null
                    const fiscal = details.DireccionFiscal && details.DireccionFiscal.length > 0 ? details.DireccionFiscal[0] : null

                    methods.reset({
                        nombre: c.Nombre,
                        asociacion: c.Asociacion,
                        alias: c.Alias,
                        email: c.Email,
                        web: c.Web,
                        fundacion: c.Fundacion ? c.Fundacion.split("T")[0] : "",
                        sector: c.Sector ? "privado" : "publico",
                        telPrincipal: c.Telefono1,
                        telSecundario: c.Telefono2,
                        telMovil: "", // Still missing in API

                        // Address from API
                        calle: postal?.Calle || "",
                        numExt: postal?.Exterior || "",
                        numInt: postal?.Interior || "",
                        colonia: postal?.Colonia || "",
                        municipio: "", // Missing in API response based on user prompt? User prompt example: "Calle", "Exterior", "Interior", "Colonia", "cp", "Tipo_domicilio", "id_estado". Muncipio IS MISSING.
                        estado: postal?.id_estado ? postal.id_estado.toString() : "", // Mapping ID to value
                        cp: postal?.cp || "",

                        // Fiscal from API
                        rfc: c.rfc,
                        igualDomicilio: false,
                        calleFiscal: fiscal?.Calle || "",
                        numExtFiscal: fiscal?.Exterior || "",
                        numIntFiscal: fiscal?.Interior || "",
                        coloniaFiscal: fiscal?.Colonia || "",
                        municipioFiscal: "",
                        estadoFiscal: fiscal?.id_estado ? fiscal.id_estado.toString() : "",
                        cpFiscal: fiscal?.cp || "",

                        // Aparatos
                        nacionales: c.Tipo_aparatos_nac,
                        importados: c.Tipo_aparatos_imp,
                        homologados: c.Tipos_aparatos_fig,
                        otros: c.Tipos_aparatos_otros,

                        tipoInstalaciones: c.Tipo_instalaciones ? "rentadas" : "propias",
                        organismos: false,
                        latitud: c.Latitud ? c.Latitud.toString() : "0",
                        longitud: c.longitud ? c.longitud.toString() : "0"
                    })
                }
            } catch (error) {
                console.error("Error fetching club details:", error)
                toast.error("Error al cargar detalles del club")
            }
        }

        fetchDetails()
    }, [club.id, methods])

    const onSubmit = async (data: any) => {
        try {
            const payload = mapStateToClubPayload(data)
            await updateClub(club.id, payload)
            toast.success("Club actualizado exitosamente")
            setOpen(false)
            // Optionally refresh store here if strictly needed, 
            // but for now let's assume global update or parent trigger if we had one.
            // A simple page reload or re-fetch would be ideal if we had access to fetchClubs.
            window.location.reload() // Simplest way to ensure everything stays in sync for now given the constraints
        } catch (error) {
            console.error("Error updating club:", error)
            toast.error("Error al actualizar el club")
        }
    }

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="h-[95vh]">
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="h-full flex flex-col">
                            <DrawerHeader className="text-left">
                                <DrawerTitle>Editar Club: {club.Club}</DrawerTitle>
                            </DrawerHeader>
                            <div className="flex-1 px-4 overflow-hidden">
                                <EditClubTabs id="edit-club-form-mobile" club={club} estados={estados} />
                            </div>
                        </form>
                    </FormProvider>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-[1000px] h-[90vh] flex flex-col p-0"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="h-full flex flex-col overflow-hidden">
                        <DialogHeader className="px-6 py-4 border-b">
                            <DialogTitle>Editar Club: {club.Club}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-hidden">
                            <EditClubTabs id="edit-club-form-desktop" club={club} estados={estados} />
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}


