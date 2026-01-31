import { z } from "zod"

export const afiliadoPaymentSchema = z.object({
    formaPago: z.string().min(1, "La forma de pago es obligatoria"),
    noTicket: z.string().min(1, "El número de ticket es obligatorio"),
    lugarPago: z.string().min(1, "El lugar de pago es obligatorio"),
    total: z.string().min(1, "El monto total es obligatorio").refine((val) => !isNaN(Number(val)), { message: "El monto debe ser numérico" }),
    fechaPago: z.date({ message: "La fecha de pago es obligatoria" }),
})

export type AfiliadoPaymentFormValues = z.infer<typeof afiliadoPaymentSchema>
