import api from "./axios";

export const login = async (usuario: string, password: string) => {
    try {
        const response = await api.get(`/getTokenLogin?usuario=${usuario}&password=${password}`);
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};
