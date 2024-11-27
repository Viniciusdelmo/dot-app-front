const API_BASE_URL = "http://localhost:8080/api/auth";
import userService from 'app/services/userService';

const authService = {
  // Função de cadastro
  async signup({ login, password, role }) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ login, password, role }),
        });

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return data;
        } else {
            const textData = await response.text();
            console.warn("Resposta não estava em JSON:", textData);
            return { message: textData };
        }
    } catch (error) {
        console.error("Erro ao realizar o signup:", error.message);
        throw error;
    }
},

  async signin({ login, password }) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ login, password }),
        });

        const data = await response.json();

        if (data.token) {
            sessionStorage.setItem("authToken", data.token);

            const users = await userService.findAll();
            const matchingUser = users.find((user) => user?.login === login);
            sessionStorage.setItem('userId', matchingUser.id);
        } else {
            console.warn("Token não encontrado na resposta do servidor");
        }

        return data;
    } catch (error) {
        console.error("Erro ao realizar o signin:", error.message);
        throw error;
    }
}
};

export default authService;
