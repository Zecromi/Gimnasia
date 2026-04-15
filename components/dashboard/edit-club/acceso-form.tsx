"use client"

import * as React from "react"
import { Key, Save, Lock, RefreshCw, Eye, EyeOff } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { ViewClubGral, setSeg, SetSegPayload } from "@/lib/club-service"
import { postBlock } from "@/lib/evento-service"
import { useAuthStore } from "@/lib/store/auth-store"
import { CopyButton } from "./copy-button"

export function AccesoForm({ id, club }: { id: string, club: ViewClubGral }) {
    const [showDisableDialog, setShowDisableDialog] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [debugPayload, setDebugPayload] = React.useState<string>("")
    const { register, getValues } = useFormContext()
    const authData = useAuthStore((state) => state.authData)

    const handleDisableAccess = async () => {
        try {
            const user = club.usuario || `admin.${club.Club?.toLowerCase().replace(/\s/g, '') || ''}`
            await postBlock(user, "2")
            toast.success("Acceso desactivado correctamente")
            setShowDisableDialog(false)
        } catch (error) {
            console.error("Error disabling access:", error)
            toast.error("Error al desactivar el acceso")
        }
    }

    const handleUpdateAccess = async () => {
        const values = getValues()

        // Calculate the default username again as fallback if form state is somehow empty but it should be handled by defaultValues now
        const defaultUser = club.usuario || `admin.${club.Club?.toLowerCase().replace(/\s/g, '') || ''}`

        const payload: SetSegPayload = {
            id: String(club.id),
            tipo_registro: "2",
            usuario: values.usuarioAccess || defaultUser,
            password: values.passwordAccess || club.password || "",
            intentos: "0",
            bloqueo: "0"
        }

        try {
            const jsonString = JSON.stringify(payload, null, 2);
            setDebugPayload(jsonString);
            console.log("JSON ENVIADO A /SetSeg (String Strict):", jsonString);
            await setSeg(payload)
            toast.success("Credenciales actualizadas correctamente")
        } catch (error: any) {
            console.error("Error updating credentials:", error)
            if (error.response?.data) {
                console.error("SERVER ERROR DETAIL:", JSON.stringify(error.response.data, null, 2));
                toast.error(`Error servidor: ${JSON.stringify(error.response.data).substring(0, 50)}...`);
            } else {
                toast.error("Error al actualizar credenciales")
            }
        }
    }

    return (
        <div className="space-y-6">
            <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro de desactivar el acceso?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción bloqueará el acceso al sistema para este club. Podrá reactivarlo posteriormente si es necesario.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDisableAccess} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Desactivar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <Key className="mr-2 h-5 w-5" />
                Control de Acceso
            </h3>
            <div className="grid gap-6 p-4 max-w-2xl">
                <div className="space-y-4">
                    <InputGroup label="Nombre de usuario" htmlFor="user-name">
                        <div className="flex gap-2">
                            <Input
                                id="user-name"
                                defaultValue={club.usuario || `admin.${club.Club?.toLowerCase().replace(/\s/g, '') || ''}`}
                                {...register("usuarioAccess")}
                                className="bg-background"
                            />
                            <CopyButton value={club.usuario || `admin.${club.Club?.toLowerCase().replace(/\s/g, '') || ''}`} />
                        </div>
                    </InputGroup>

                    <InputGroup label="Contraseña" htmlFor="user-password">
                        <div className="flex gap-2 relative">
                            <div className="relative flex-1">
                                <Input
                                    id="user-password"
                                    defaultValue={club.password || ""}
                                    type={showPassword ? "text" : "password"}
                                    {...register("passwordAccess")}
                                    className="bg-background pr-10"
                                    placeholder="Ingrese contraseña"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            <CopyButton value={club.password || ""} />
                        </div>
                    </InputGroup>
                </div>
                {debugPayload && (
                    <div className="mt-4 p-4 bg-muted rounded-md overflow-auto">
                        <h4 className="text-sm font-semibold mb-2">Debug Payload Output:</h4>
                        <pre className="text-xs">{debugPayload}</pre>
                    </div>
                )}
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Acciones de cuenta</h4>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <Button
                            type="button"
                            onClick={handleUpdateAccess}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Actualizar Credenciales
                        </Button>

                        <div className="flex-1"></div>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        className="w-full sm:w-auto"
                                        onClick={() => setShowDisableDialog(true)}
                                    >
                                        <Lock className="mr-2 h-4 w-4" />
                                        Desactivar Acceso
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Bloquear el acceso al sistema para este club</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" type="button" className="w-full sm:w-auto">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Restablecer Contraseña
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Generar una nueva contraseña aleatoria</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    )
}
