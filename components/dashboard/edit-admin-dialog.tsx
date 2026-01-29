"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react"
import { toast } from "sonner"

// Define the type here to match the one in page.tsx
export interface AdminUser {
    id: string
    nombre: string
    rol: string
    estado: string
    club?: string
    usuario?: string
    password?: string
}

const formSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
    rol: z.string().min(1, "Por favor seleccione un rol."),
    estado: z.string().min(1, "Por favor seleccione un estado."),
    club: z.string().optional(),
    usuario: z.string().min(3, "El usuario debe tener al menos 3 caracteres."),
    password: z.string().optional(), // Optional for edit, maybe required for new? Assuming optional for edit if not changing
})

interface EditAdminDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: AdminUser | null
    onSubmit: (values: z.infer<typeof formSchema>) => void
}

export function EditAdminDialog({
    open,
    onOpenChange,
    user,
    onSubmit,
}: EditAdminDialogProps) {
    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            nombre: "",
            rol: "",
            estado: "",
            club: "",
            usuario: "",
            password: "",
        },
    })

    useEffect(() => {
        if (user) {
            reset({
                nombre: user.nombre,
                rol: user.rol,
                estado: user.estado,
                club: user.club || "",
                usuario: user.usuario || "",
                password: "", // Don't pre-fill password
            })
        }
    }, [user, reset, open])

    const onFormSubmit = (data: z.infer<typeof formSchema>) => {
        const result = formSchema.safeParse(data)
        if (!result.success) {
            const errorMessages = result.error.issues.map(i => i.message).join(", ")
            toast.error(errorMessages)
            return
        }
        onSubmit(data)
        onOpenChange(false)
    }

    const selectedRol = watch("rol")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Controller
                            name="nombre"
                            control={control}
                            render={({ field }) => (
                                <Input id="nombre" placeholder="Nombre del usuario" {...field} />
                            )}
                        />
                        {errors.nombre && <span className="text-sm text-red-500">{errors.nombre.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="usuario">Usuario</Label>
                        <Controller
                            name="usuario"
                            control={control}
                            render={({ field }) => (
                                <Input id="usuario" placeholder="Nombre de usuario" {...field} />
                            )}
                        />
                        {errors.usuario && <span className="text-sm text-red-500">{errors.usuario.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input id="password" type="password" placeholder="Nueva contraseña (opcional)" {...field} />
                            )}
                        />
                        {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rol">Rol</Label>
                        <Controller
                            name="rol"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                                        <SelectItem value="Admin Club">Admin Club</SelectItem>
                                        <SelectItem value="Staff">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.rol && <span className="text-sm text-red-500">{errors.rol.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Controller
                            name="estado"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Activo">Activo</SelectItem>
                                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.estado && <span className="text-sm text-red-500">{errors.estado.message}</span>}
                    </div>

                    {selectedRol === "Admin Club" && (
                        <div className="space-y-2">
                            <Label htmlFor="club">Club Asignado</Label>
                            <Controller
                                name="club"
                                control={control}
                                render={({ field }) => (
                                    <Input id="club" placeholder="Nombre del club" {...field} />
                                )}
                            />
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="submit">Guardar cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
