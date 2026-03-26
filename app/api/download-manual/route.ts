import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET() {
    try {
        // 
        // Aquí agregaremos un auth para que solo los usuarios logueados puedan descargar el PDF



        const pdfPath = path.join(process.cwd(), 'private', 'GUEM-MANUAL-ACTUALIZACIÓN 2026.pdf')


        const fileBuffer = await fs.readFile(pdfPath)



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
