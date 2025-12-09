import axios from "@/lib/axios";

export const login = async (usuario: string, password: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // Call the external API directly
        const response = await axios.post(`${apiUrl}/getTokenLogin`, null, {
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
