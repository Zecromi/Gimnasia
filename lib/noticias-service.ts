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

