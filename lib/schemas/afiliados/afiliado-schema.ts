import { z } from "zod"

export const afiliadoSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    paterno: z.string().min(1, "El apellido paterno es obligatorio"),
    materno: z.string().min(1, "El apellido materno es obligatorio"),
    id_Club: z.string().min(1, "El club es obligatorio"),
    fecha_nacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
    curp: z.string().min(18, "La CURP debe tener 18 caracteres").max(18, "La CURP debe tener 18 caracteres"),
    genero: z.string().min(1, "El género es obligatorio"),
    escolaridad: z.string().min(1, "La escolaridad es obligatoria"),
    calle: z.string().min(1, "La calle es obligatoria"),
    exterior: z.string().min(1, "El número exterior es obligatorio"),
    interior: z.string().optional().or(z.literal("")),
    colonia: z.string().min(1, "La colonia es obligatoria"),
    cp: z.string().min(5, "El CP debe tener 5 dígitos"),
    ciudad: z.string().min(1, "La ciudad es obligatoria"),
    estado: z.string().min(1, "El estado es obligatorio"),
    telefono_c: z.string().optional().or(z.literal("")),
    telefono_cel: z.string().optional().or(z.literal("")),

    // Afiliaciones mappings (IDs as strings or numbers?) 
    // Payload expects strings based on CreateAfiliadoPayload interface ("afiliacion_p: string")
    afiliacion_p: z.string().optional(),
    afiliacion_s: z.string().optional(),
    afiliacion_3: z.string().optional(),
    afiliacion_4: z.string().optional(),

    id_nivel_tec: z.string().min(1, "El nivel técnico es obligatorio"),
    modalidad: z.string().min(1, "La modalidad es obligatoria"),
})

export type AfiliadoFormValues = z.infer<typeof afiliadoSchema>
