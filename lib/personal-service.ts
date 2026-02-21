
import api from '@/lib/axios'

export interface PersonalData {
    nombre: string
    paterno: string
    materno: string
    calle: string
    exterior: string
    interior: string
    colonia: string
    cp: string
    estado: string
    curp: string
    tel1: string
    tel2: string
    fecha_alta: string
    fecha_baja: string
    id_Puesto: string
}

export interface PersonalResponse {
    usuario: string
    password: string
}

export const registerPersonal = async (data: PersonalData): Promise<PersonalResponse[]> => {
    try {
        const response = await api.post<PersonalResponse[]>('/SetPersonal', data)
        return response.data
    } catch (error) {
        console.error("Error registering personal:", error)
        throw error
    }
}

export interface PersonalItem {
    id: number
    Nombre: string
    Paterno: string
    Materno: string
    Calle: string
    Exterior: string
    Interior: string
    Colonia: string
    Cp: string
    Estado: number
    Curp: string
    Tel1: string
    Tel2: string
    Fecha_alta: string
    Fecha_baja: string | null
    id_puesto: number
}

export interface GetPersonalResponse {
    Personal_base: PersonalItem[]
}

export const getPersonal = async (): Promise<GetPersonalResponse> => {
    const response = await api.get<GetPersonalResponse>('/GetPersonal_base')
    return response.data
}

