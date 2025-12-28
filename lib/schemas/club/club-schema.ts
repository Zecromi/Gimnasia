import { z } from "zod"

export const clubSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    alias: z.string().optional(),
    asociacion: z.string().default("ESTADO DE MÉXICO"),
    email: z.string().email("Email inválido"),
    web: z.string().optional().or(z.literal("")),
    fundacion: z.string().min(1, "La fecha de fundación es obligatoria"),
    sector: z.enum(["privado", "publico"]),
    telPrincipal: z.string().min(1, "El teléfono principal es obligatorio"),
    telSecundario: z.string().optional(),
    telMovil: z.string().optional(),
    tipoInstalaciones: z.enum(["propias", "rentadas"]),

    // Domicilio Social
    calle: z.string().min(1, "La calle es obligatoria"),
    numExt: z.string().min(1, "El número exterior es obligatorio"),
    numInt: z.string().optional(),
    colonia: z.string().min(1, "La colonia es obligatoria"),
    municipio: z.string().min(1, "El municipio es obligatorio"),
    estado: z.string().min(1, "El estado es obligatorio"), // ID expected now
    cp: z.string().min(5, "El CP debe tener 5 dígitos"),

    // Domicilio Fiscal
    igualDomicilio: z.boolean(),
    calleFiscal: z.string().optional(),
    numExtFiscal: z.string().optional(),
    numIntFiscal: z.string().optional(),
    coloniaFiscal: z.string().optional(),
    municipioFiscal: z.string().optional(),
    estadoFiscal: z.string().optional(),
    cpFiscal: z.string().optional(),
    rfc: z.string().optional().or(z.literal("")),

    // Aparatos
    nacionales: z.boolean(),
    importados: z.boolean(),
    homologados: z.boolean(),
    otros: z.boolean(),
}).refine((data) => {
    if (!data.igualDomicilio) {
        // If not equal, validate fiscal address fields
        return !!data.calleFiscal && !!data.numExtFiscal && !!data.coloniaFiscal && !!data.municipioFiscal && !!data.estadoFiscal && !!data.cpFiscal
    }
    return true
}, {
    message: "Todos los campos del domicilio fiscal son obligatorios si no es igual al social",
    path: ["igualDomicilio"] // Error attached to checkbox or general?
})

export type ClubFormValues = z.infer<typeof clubSchema>
