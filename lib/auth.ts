import api from "./axios";

export const login = async (usuario: string, password: string) => {
    try {
        // Call the internal Next.js API route
        const response = await api.post("/api/login", { usuario, password });
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};
