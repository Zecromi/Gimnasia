import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { usuario, password } = body;

        if (!usuario || !password) {
            return NextResponse.json(
                { error: "Usuario y contraseña son requeridos" },
                { status: 400 }
            );
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // API requires POST with query parameters
        const response = await axios.post(`${apiUrl}/getTokenLogin`, null, {
            params: {
                usuario,
                password,
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Proxy login error:", error.message);
        return NextResponse.json(
            { error: "Error al conectar con el servicio de autenticación" },
            { status: error.response?.status || 500 }
        );
    }
}