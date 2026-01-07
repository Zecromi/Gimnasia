import { create } from 'zustand'

export interface ViewClubGral {
    Club: string
    Alias: string
    Email: string
    Asociacion: string
    membresia: boolean
    Estatus: boolean
    Web: string
    id: number
    rfc: string
    Tipo_aparatos_nac: boolean
    Tipo_aparatos_imp: boolean
    Tipos_aparatos_fig: boolean
    Tipos_aparatos_otros: boolean
    id_club_principal: number
    Fundacion: string
    Sector: boolean
    Tipo_instalaciones: boolean
    Telefono1: string
    Telefono2: string
    usuario?: string
    password?: string
}

interface ClubStore {
    clubs: ViewClubGral[]
    setClubs: (clubs: ViewClubGral[]) => void
    updateClub: (club: ViewClubGral) => void
}

export const useClubStore = create<ClubStore>((set) => ({
    clubs: [],
    setClubs: (clubs) => set({ clubs }),
    updateClub: (updatedClub) =>
        set((state) => ({
            clubs: state.clubs.map((club) =>
                club.id === updatedClub.id ? updatedClub : club
            ),
        })),
}))
