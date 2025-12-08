import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.conjurweb.com/ApiServ";

export const login = async (usuario: string, password: string) => {
    try {
        const response = await axios.get(`${API_URL}/getTokenLogin${usuario}/${password}`);
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};
