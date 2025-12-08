const axios = require('axios');

const url = "https://www.conjurweb.com/ApiServ/getTokenLogin";
const params = {
    usuario: "estado_de_mex",
    password: "Guem2024ok"
};

async function test() {
    console.log("Testing GET...");
    try {
        const res = await axios.get(url, { params });
        console.log("GET Success:", res.status, res.data);
    } catch (e) {
        console.log("GET Failed:", e.response ? e.response.status : e.message);
    }

    console.log("\nTesting POST...");
    try {
        const res = await axios.post(url, null, { params });
        console.log("POST Success:", res.status, res.data);
    } catch (e) {
        console.log("POST Failed:", e.response ? e.response.status : e.message);
    }

    console.log("\nTesting POST with body...");
    try {
        const res = await axios.post(url, params);
        console.log("POST Body Success:", res.status, res.data);
    } catch (e) {
        console.log("POST Body Failed:", e.response ? e.response.status : e.message);
    }
}

test();
