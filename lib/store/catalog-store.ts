import { create } from "zustand";
import { getGlobalInfo, CatalogsResponse } from "@/lib/club-service";

interface CatalogStore extends CatalogsResponse {
    isLoading: boolean;
    error: string | null;
    fetchCatalogs: () => Promise<void>;
}

export const useCatalogStore = create<CatalogStore>((set, get) => ({
    Catalogo_afiliaciones: [],
    Niveles_tecnicos: [],
    Estados: [],
    Puestos: [],
    Escolaridad: [],
    Modalidades: [],
    View_Modalidades_detalle: [],
    Catalogo_eventos: [],
    isLoading: false,
    error: null,

    fetchCatalogs: async () => {
        // Prevent refetching if data is already loaded
        const state = get();
        if (state.Catalogo_afiliaciones.length > 0 && !state.error) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const data = await getGlobalInfo();
            set({
                ...data,
                isLoading: false,
            });
        } catch (error) {
            console.error("Error fetching catalogs:", error);
            set({ error: "Failed to fetch catalogs", isLoading: false });
        }
    },
}));



