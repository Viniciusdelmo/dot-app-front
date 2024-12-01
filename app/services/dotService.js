// const API_BASE_URL = "http://localhost/api/timesheet";
const API_BASE_URL = "http://rh-server-lb-284210776.us-east-1.elb.amazonaws.com/api/timesheet";

const dotService = {

    async insert({ dot, timeflag }) {
        const token = sessionStorage.getItem("authToken");
        const userId = sessionStorage.getItem("userId");

        if (!token) {
        throw new Error("Token de autenticação não encontrado.");
    }
    try {
        const response = await fetch(`${API_BASE_URL}/insert`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        },
        body: JSON.stringify({ dot, timeflag, userId }),
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
        console.error("Erro ao marcar ponto:", error.message);
        throw error;
    }
    },

  async findByUser() {
    const token = sessionStorage.getItem("authToken");
    const userId = sessionStorage.getItem("userId");
  
    if (!token) {
      throw new Error("Token de autenticação não encontrado.");
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/findByUser/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Nenhum ponto encontrado para o usuário.");
          return [];
        }
        throw new Error(`Erro na resposta da API: ${response.statusText}`);
      }
  
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } else {
        console.warn("Resposta não estava em JSON.");
        return [];
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error.message);
      throw error;
    }
  }
};

export default dotService;
