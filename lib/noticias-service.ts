import api from "./axios";

export interface CreateNoticiaPayload {
    titulo: string;
    resumen: string;
    contenido: string;
    autorID: string;
    modalidadID: string;
    tipo: string;
}

export const postNoticia = async (payload: CreateNoticiaPayload) => {
    const response = await api.post("/PostNoticia", payload);
    return response.data;
};

export const putNoticia = async (id: string, payload: CreateNoticiaPayload) => {
    const response = await api.post("/PutNoticia", payload, {
        params: { id },
    });
    return response.data;
};

export const postPresentaNoticia = async (id: string, tipo: string) => {
    const response = await api.post("/Post_Presenta_Noticia", null, {
        params: { id, tipo },
    });
    return response.data;
};

export const cargaImagen = async (id: string, extension: string, file: File) => {
    const formData = new FormData();
    formData.append("imagen", file);

    const response = await api.post("/Carga_Imagen", formData, {
        params: { id, extension },
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const cargaImagenGal = async (id: string, extension: string, file: File) => {
    const formData = new FormData();
    formData.append("imagen", file);

    const response = await api.post("/Carga_Imagen_gal", formData, {
        params: { id, extension },
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getNoticia = async (id: string) => {
    const response = await api.get("/Obt_noticia", {
        params: { id }
    });
    return response.data;
};

export const getNoticias = async () => {
    const response = await api.get("/Obt_noticia");
    return response.data;
};

export const getImagenNoticiaUrl = (id: number | string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    return `${baseUrl}/Obt_imagen_noticia?id=${id}`;
};

export const getImagenGalUrl = (id: number | string, numero: number): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    return `${baseUrl}/Obt_img_gal?id=${id}&numero=${numero}`;
};

export const getContGal = async (id: number | string): Promise<number> => {
    const response = await api.get("/Obt_cont_cal", {
        params: { id },
    });
    // Response format: [{"Column1":"5"}]
    const data = response.data;
    if (Array.isArray(data) && data.length > 0 && data[0].Column1 !== undefined) {
        return Number(data[0].Column1) || 0;
    }
    return typeof data === "number" ? data : Number(data) || 0;
};
