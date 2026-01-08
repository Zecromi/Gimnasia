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

export const getPass = async (usuario: string, contra: string) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log(`Calling GetPass with: Usuario=${usuario}, Contra=${contra}`);
        const response = await axios.get(`${apiUrl}/GetPass`, {
            params: {
                Usuario: usuario,
                Contra: contra
            }
        });
        return response.data; // Expecting array like [{id: 1, tipo_registro: 1}]
    } catch (error) {
        console.error("GetPass error:", error);
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
