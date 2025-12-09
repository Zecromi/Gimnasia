import api from "./axios";

export const login = async (usuario: string, password: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // Call the external API directly
        const response = await api.post(`${apiUrl}/getTokenLogin`, null, {
            params: {
                usuario,
                password,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};
