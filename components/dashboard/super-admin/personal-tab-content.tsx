"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { registerPersonal, getPersonal, PersonalData, PersonalItem } from "@/lib/personal-service"
import { personalColumns } from "./personal-columns"
import { DataTable } from "@/components/dashboard/data-table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { useCatalogStore } from "@/lib/store/catalog-store"
import { CopyButton } from "@/components/ui/copy-button"

// Schema based on PersonalData interface
const personalSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    paterno: z.string().min(1, "El apellido paterno es requerido"),
    materno: z.string().min(1, "El apellido materno es requerido"),
    calle: z.string().min(1, "La calle es requerida"),
    exterior: z.string().min(1, "El número exterior es requerido"),
    interior: z.string().optional(),
    colonia: z.string().min(1, "La colonia es requerida"),
    cp: z.string().min(5, "El CP debe tener 5 dígitos").max(5),
    estado: z.string().min(1, "El estado es requerido"),
    curp: z.string().min(18, "La CURP debe tener 18 caracteres").max(18),
    tel1: z.string().min(10, "El teléfono debe tener 10 dígitos"),
    tel2: z.string().optional(),
    fecha_alta: z.string().min(1, "La fecha de alta es requerida"),
    fecha_baja: z.string().optional(),
    id_Puesto: z.string().min(1, "El puesto es requerido"),
})

export function PersonalTabContent() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [personal, setPersonal] = React.useState<PersonalItem[]>([])
    const [isTableLoading, setIsTableLoading] = React.useState(true)

    const [successData, setSuccessData] = React.useState<{ usuario: string; password: string } | null>(null)
    const [openSuccess, setOpenSuccess] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const { Estados, fetchCatalogs } = useCatalogStore()

    const fetchPersonal = React.useCallback(async () => {
        setIsTableLoading(true)
        try {
            const data = await getPersonal()
            if (data?.Personal_base) {
                setPersonal(data.Personal_base)
            }
        } catch (err) {
            console.error("Error fetching personal:", err)
        } finally {
            setIsTableLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchCatalogs()
        fetchPersonal()
    }, [fetchCatalogs, fetchPersonal])

    const form = useForm<z.infer<typeof personalSchema>>({
        defaultValues: {
            nombre: "",
            paterno: "",
            materno: "",
            calle: "",
            exterior: "",
            interior: "",
            colonia: "",
            cp: "",
            estado: "", // Default to state 9 as per example? Or let user choose.
            curp: "",
            tel1: "",
            tel2: "",
            fecha_alta: new Date().toISOString().split('T')[0],
            fecha_baja: "",
            id_Puesto: "",
        },
    })

    async function onSubmit(values: z.infer<typeof personalSchema>) {
        // Manual validation
        const validation = personalSchema.safeParse(values)
        if (!validation.success) {
            validation.error.issues.forEach((issue) => {
                // Map Zod errors to React Hook Form errors
                // The path in Zod is an array (e.g., ["nombre"]), so we take the first element
                form.setError(issue.path[0] as any, { message: issue.message })
            })
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            // Ensure optional fields are handled as strings to match interface
            const payload: PersonalData = {
                ...values,
                interior: values.interior || "",
                tel2: values.tel2 || "",
                fecha_baja: values.fecha_baja || "",
            }

            const response = await registerPersonal(payload)

            if (response && response.length > 0) {
                setSuccessData(response[0])
                setOpenSuccess(true)
                setIsFormOpen(false)
                fetchPersonal()
                form.reset({
                    nombre: "",
                    paterno: "",
                    materno: "",
                    calle: "",
                    exterior: "",
                    interior: "",
                    colonia: "",
                    cp: "",
                    estado: "",
                    curp: "",
                    tel1: "",
                    tel2: "",
                    fecha_alta: new Date().toISOString().split('T')[0],
                    fecha_baja: "",
                    id_Puesto: "",
                })
            } else {
                setError("La respuesta del servidor no contiene las credenciales.")
            }
        } catch (err) {
            console.error(err)
            setError("Ocurrió un error al registrar el personal. Verifique los datos e intente nuevamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Personal Table Card with trigger button */}
            <Card className="p-4">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Personal Registrado</CardTitle>
                        <CardDescription>Lista de todo el personal registrado en el sistema.</CardDescription>
                    </div>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Save className="mr-2 h-4 w-4" />
                                Registro de Personal
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Registro de Personal</DialogTitle>
                                <DialogDescription>
                                    Complete el formulario para registrar un nuevo integrante del personal.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="nombre"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nombre</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nombre" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="paterno"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Apellido Paterno</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Apellido Paterno" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="materno"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Apellido Materno</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Apellido Materno" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="curp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CURP</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ABCD123456789" maxLength={18} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="tel1"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Teléfono 1</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="1234567890" maxLength={10} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="tel2"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Teléfono 2 (Opcional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="1234567890" maxLength={10} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="calle"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Calle</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Calle" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="exterior"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>No. Exterior</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="123" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="interior"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>No. Interior</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Eq. A" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="colonia"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Colonia</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Colonia" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="cp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Código Postal</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="12345" maxLength={5} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="estado"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Estado</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccione un estado" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {Estados.map((estado) => (
                                                                <SelectItem key={estado.id} value={estado.id.toString()}>
                                                                    {estado.Nombre}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="id_Puesto"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Puesto</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccione un puesto" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">Administrador</SelectItem>
                                                            <SelectItem value="2">Club</SelectItem>
                                                            <SelectItem value="3">Super Administrador</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="fecha_alta"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Fecha de Alta</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Registrar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="px-0">
                    {isTableLoading ? (
                        <div className="flex items-center justify-center p-10 text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Cargando...
                        </div>
                    ) : (
                        <DataTable
                            columns={personalColumns}
                            data={personal}
                            noResultsMessage="No hay personal registrado"
                            headerClassName="bg-white dark:bg-zinc-900"
                        />
                    )}
                </CardContent>
            </Card>

            <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
                <DialogContent overlayClassName="backdrop-blur-none">
                    <DialogHeader>
                        <DialogTitle>Personal Registrado Exitosamente</DialogTitle>
                        <DialogDescription>
                            El personal ha sido registrado. Por favor guarde las siguientes credenciales:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold text-right col-span-1">Usuario:</span>
                            <div className="col-span-3 flex items-center gap-2">
                                <code className="bg-muted p-2 rounded block flex-1">{successData?.usuario}</code>
                                <CopyButton value={successData?.usuario || ""} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold text-right col-span-1">Contraseña:</span>
                            <div className="col-span-3 flex items-center gap-2">
                                <code className="bg-muted p-2 rounded block flex-1">{successData?.password}</code>
                                <CopyButton value={successData?.password || ""} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setOpenSuccess(false)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
