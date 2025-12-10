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

export const logout = async (token: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const formData = new FormData();
        formData.append('token', token);

        const response = await axios.post(`${apiUrl}/logout`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};
