import { create } from "zustand";
import { getGlobalInfo, CatalogsResponse } from "@/lib/club-service";

interface CatalogStore extends CatalogsResponse {
    isLoading: boolean;
    error: string | null;
    fetchCatalogs: () => Promise<void>;
}

export const useCatalogStore = create<CatalogStore>((set) => ({
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
