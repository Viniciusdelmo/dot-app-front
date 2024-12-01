// const API_BASE_URL = "http://localhost/api/user";
const API_BASE_URL = "http://rh-server-lb-284210776.us-east-1.elb.amazonaws.com/api/timesheet";

const userService = {
    async findAll() {
    try {
        const token = sessionStorage.getItem("authToken");

        if (!token) {
        throw new Error("Token de autenticação não encontrado.");
    }

        const response = await fetch(`${API_BASE_URL}/findAll`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        },
        });

        if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar dados:", error.message);
        throw error;
    }
    },

    async findById() {
        try {
            const token = sessionStorage.getItem("authToken");
            const userId = sessionStorage.getItem("userId");

            if (!token) {
            throw new Error("Token de autenticação não encontrado.");
        }

            const response = await fetch(`${API_BASE_URL}/findById/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            });

            if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro ao buscar dados:", error.message);
            throw error;
        }
        },

};

export default userService;
