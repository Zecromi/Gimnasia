import api from "./axios";
import { CatalogoItem, Estado } from "./club-service";

export interface AfiliadosCatalogsResponse {
    Catalogo_afiliaciones: CatalogoItem[];
    Niveles_tecnicos: { id: number; Descripcion: string }[];
    Estados: Estado[];
    Escolaridad: CatalogoItem[];
}

export const getAfiliadosCatalogs = async () => {
    const response = await api.get<AfiliadosCatalogsResponse>("/GetInf_afil");
    return response.data;
};
