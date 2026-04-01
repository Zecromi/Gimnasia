import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({

    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    let token = Cookies.get("token");
    if (token) {
        // Aggressively remove all quotes (start, end, or middle)
        token = token.replace(/"/g, '');
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
