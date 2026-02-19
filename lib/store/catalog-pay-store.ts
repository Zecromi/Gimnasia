import { create } from "zustand";
import api from "@/lib/axios";

export interface CatalogoItem {
    id: number;
    Nombre: string;
    Descripcion?: string | null;
}

export interface NivelTecnicoItem {
    id: number;
    Descripcion: string;
}

export interface EstadoItem {
    id: number;
    Nombre: string;
}

export interface EscolaridadItem {
    id: number;
    Nombre: string;
}

export interface AfiliadoItem {
    id: number;
    Nombre: string;
    Paterno: string;
    Materno: string;
    id_Club: number;
    Fecha_nacimiento: string;
    Curp: string;
    Genero: string;
    id_Escolaridad: number;
    Fecha_afiliacion: string;
    Fecha_baja: string | null;
    Calle: string;
    Exterior: string;
    Interior: string;
    Colonia: string;
    CP: string;
    Ciudad: string;
    Estado: string;
    Telefono_c: string;
    Telefono_cel: string;
    Afiliacion_1: number | null;
    Afiliacion_2: number | null;
    Afiliacion_3: number | null;
    Afiliacion_4: number | null;
    id_nivel_tec: number | null;
    Modalidad: number | null;
}

interface CatalogPayStoreData {
    Catalogo_afiliaciones: CatalogoItem[];
    Niveles_tecnicos: NivelTecnicoItem[];
    Estados: EstadoItem[];
    Escolaridad: EscolaridadItem[];
    Modalidades_afil: AfiliadoItem[];
    Catalogo_formas_pago: CatalogoItem[];
}

interface CatalogPayStore extends CatalogPayStoreData {
    isLoading: boolean;
    error: string | null;
    fetchCatalogs: () => Promise<void>;
}

export const useCatalogPayStore = create<CatalogPayStore>((set) => ({
    Catalogo_afiliaciones: [],
    Niveles_tecnicos: [],
    Estados: [],
    Escolaridad: [],
    Modalidades_afil: [],
    Catalogo_formas_pago: [],
    isLoading: false,
    error: null,

    fetchCatalogs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<CatalogPayStoreData>("/GetInf_afil");
            // Ensure response.data matches the structure, if it's nested or direct
            // Assuming direct mapping based on user json
            set({
                ...response.data,
                isLoading: false,
            });
        } catch (error) {
            console.error("Error fetching payment catalogs:", error);
            set({ error: "Failed to fetch payment catalogs", isLoading: false });
        }
    },
}));
