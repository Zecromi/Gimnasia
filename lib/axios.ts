import axios from "axios";


const api = axios.create({
    baseURL: "https://www.conjurweb.com/ApiServ",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
