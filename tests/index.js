const axios = require("axios");

const BACKEND_URL = "http://localhost:3000"

const fetchData = async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username: "teste@gmail.com",
        password: "<PASSWORD>",
        type: "admin"
    });

    // console.log(response.data);
};
fetchData();


