import { create } from "zustand";
import { getAfiliadosEventos, AfiliadosEventosResponse } from "@/lib/evento-service";

interface AfiliadosEventosStore {
    afiliados: AfiliadosEventosResponse['Afiliados_base'];
    isLoading: boolean;
    error: string | null;
    fetchAfiliadosEventos: (id_Club: string, id_Evento: string) => Promise<void>;
}

export const useAfiliadosEventosStore = create<AfiliadosEventosStore>((set) => ({
    afiliados: [],
    isLoading: false,
    error: null,

    fetchAfiliadosEventos: async (id_Club: string, id_Evento: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getAfiliadosEventos(id_Club, id_Evento);
            set({
                afiliados: data.Afiliados_base,
                isLoading: false,
            });
        } catch (error) {
            console.error("Error fetching afiliados eventos:", error);
            set({ error: "Failed to fetch afiliados eventos", isLoading: false });
        }
    },
}));