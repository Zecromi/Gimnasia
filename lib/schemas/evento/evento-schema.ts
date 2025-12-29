import { z } from "zod"

export const eventoSchema = z.object({
    // Información General
    tipoEvento: z.string().min(1, "El tipo de evento es obligatorio"),

    organizador: z.string().min(1, "El organizador es obligatorio"),
    asociacion: z.string().min(1, "La asociación es obligatoria"),
    nombre: z.string().min(1, "El nombre del evento es obligatorio"),
    lugar: z.string().min(1, "El lugar es obligatorio"),
    sede: z.string().min(1, "La sede es obligatoria"),
    region: z.string().min(1, "La región es obligatoria"),

    limiteParticipantes: z.string().min(1, "El límite de participantes es obligatorio (0 para ilimitado)"),

    horaLimiteInscripcion: z.string().min(1, "La hora límite es obligatoria"),

    fechaInicioEvento: z.date().optional().refine(val => val !== undefined, { message: "La fecha de inicio es obligatoria" }),
    fechaFinEvento: z.date().optional().refine(val => val !== undefined, { message: "La fecha de fin es obligatoria" }),
    fechaInicioInscripcion: z.date().optional().refine(val => val !== undefined, { message: "La fecha de inicio de inscripción es obligatoria" }),
    fechaFinInscripcion: z.date().optional().refine(val => val !== undefined, { message: "La fecha de fin de inscripción es obligatoria" }),

    // Validaciones de Modalidades
    // Se requiere seleccionar al menos una modalidad y un nivel
    // Estructura esperada para validar la selección
    detalles: z.array(z.object({
        idModalidad: z.union([z.string(), z.number()]),
        idNivel: z.union([z.string(), z.number()]),
        costo: z.string().min(1, "El costo es obligatorio").refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Debe ser un precio válido"),
        descripcion: z.string().min(1, "La descripción es obligatoria")
    })).min(1, "Debe seleccionar al menos una modalidad y un nivel, completando costo y descripción para cada uno."),

}).refine((data) => {
    if (data.fechaInicioEvento && data.fechaFinEvento) {
        return data.fechaInicioEvento <= data.fechaFinEvento;
    }
    return true;
}, {
    message: "La fecha de fin debe ser igual o posterior a la de inicio",
    path: ["fechaFinEvento"],
}).refine((data) => {
    if (data.fechaInicioInscripcion && data.fechaFinInscripcion) {
        return data.fechaInicioInscripcion <= data.fechaFinInscripcion;
    }
    return true;
}, {
    message: "La fecha de fin de inscripción debe ser igual o posterior a la de inicio",
    path: ["fechaFinInscripcion"],
}).refine((data) => {
    if (data.fechaInicioEvento && data.fechaFinInscripcion) {
        return data.fechaInicioEvento > data.fechaFinInscripcion;
    }
    return true;
}, {
    message: "La fecha de inicio del evento debe ser posterior al cierre de inscripciones",
    path: ["fechaInicioEvento"],
});

export type EventoFormValues = z.infer<typeof eventoSchema>
