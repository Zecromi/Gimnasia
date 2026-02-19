
import axios from 'axios'
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
