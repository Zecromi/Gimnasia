import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET() {
    try {
        // En una app real de producción, lo ideal es comprobar la sesión primero
        // Aquí agregarías la lógica de auth: Ej. if (!userLogueado) return Unauthorzed

        // Usamos process.cwd() que es la raíz de Gimnasia-1
        const pdfPath = path.join(process.cwd(), 'private', 'GUEM-MANUAL-ACTUALIZACIÓN 2026.pdf')

        // Leemos el archivo a un buffer
        const fileBuffer = await fs.readFile(pdfPath)

        // Devolvemos el file como PDF. 
        // "inline" permite que el navegador lo abra en una nueva pestaña
        // Si quisieras que lo descargue forzosamente directo, usarías "attachment" en vez de "inline"
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="GUEM-MANUAL-ACTUALIZACION.pdf"',
            },
        })
    } catch (error) {
        console.error("Error al leer el PDF seguro:", error)
        return new NextResponse("Error cargando el archivo o no existe.", { status: 500 })
    }
}
