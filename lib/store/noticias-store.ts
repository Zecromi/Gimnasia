import { create } from "zustand";
import { getNoticias, getImagenNoticiaUrl } from "@/lib/noticias-service";
import { useCatalogStore } from "@/lib/store/catalog-store";

export interface NoticiaItem {
    id: number;
    title: string;
    date: string;
    description: string;
    content: string;
    category: string;
    image: string;
}

// Raw shape as returned by the API — used by the admin table
export interface NoticiaRaw {
    id: number;
    Titulo: string;
    Resumen: string;
    Contenido: string;
    AutorID: number;
    ModalidadID: number;
    Tipo: number;
    extension: string | null;
    Estado: string;
}

interface NoticiasStore {
    noticias: NoticiaItem[];
    rawNoticias: NoticiaRaw[];
    isLoading: boolean;
    error: string | null;
    fetchNoticias: () => Promise<void>;
}

export const useNoticiasStore = create<NoticiasStore>((set, get) => ({
    noticias: [],
    rawNoticias: [],
    isLoading: false,
    error: null,

    fetchNoticias: async () => {
        // Prevent refetching if data is already loaded
        const state = get();
        if (state.noticias.length > 0 && !state.error) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            // Fetch catalogs and noticias in parallel to eliminate waterfall
            const [, data] = await Promise.all([
                useCatalogStore.getState().fetchCatalogs(),
                getNoticias(),
            ]);
            const modalities = useCatalogStore.getState().Modalidades || [];
            const resultados: any[] = data?.resultados ?? [];

            const noticias: NoticiaItem[] = resultados
                // Filter out inactive news so they don't show on the public cards
                .filter((item) => item.Estado === "Activo")
                .map((item) => ({
                id: item.id,
                title: item.Titulo,
                date: new Date().toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }),
                description: item.Resumen,
                content: item.Contenido,
                category: modalities.find((m: any) => m.id.toString() === item.ModalidadID?.toString())?.Nombre || "General",
                image: getImagenNoticiaUrl(item.id),
            }));

            const rawNoticias: NoticiaRaw[] = resultados.map((item) => ({
                id: item.id,
                Titulo: item.Titulo,
                Resumen: item.Resumen,
                Contenido: item.Contenido,
                AutorID: item.AutorID,
                ModalidadID: item.ModalidadID,
                Tipo: item.Tipo,
                extension: item.extension,
                Estado: item.Estado || "Inactivo",
            }));

            set({ noticias, rawNoticias, isLoading: false });
        } catch (error) {
            console.error("Error fetching noticias:", error);
            set({ error: "Failed to fetch noticias", isLoading: false });
        }
    },
}));
