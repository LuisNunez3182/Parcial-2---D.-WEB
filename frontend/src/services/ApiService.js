const API_BASE = "http://localhost:8000/api/index.php";

const buildUrl = (endpoint) => {
  const cleanBase = API_BASE.replace(/\/+$/, "");
  const cleanEndpoint = String(endpoint || "").replace(/^\/+/, "");
  return cleanEndpoint ? `${cleanBase}/${cleanEndpoint}` : cleanBase;
};

class ApiService {
  static async request(method, endpoint, data = null) {
    try {
      const url = buildUrl(endpoint);
      const options = {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      console.log(`Solicitando: ${method} ${url}`, data);
      
      const response = await fetch(url, options);
      const responseData = await response.json();
      
      console.log(`Respuesta: ${response.status}`, responseData);
      
      return responseData;
    } catch (error) {
      console.error(`Error en API: ${endpoint}`, error);
      throw error;
    }
  }

  // Endpoints de autenticación
  static async login(usuario, contrasena) {
    return this.request("POST", "auth/login", { usuario, contrasena });
  }

  static async logout() {
    return this.request("POST", "auth/logout");
  }

  static async getCurrentUser() {
    return this.request("GET", "auth/current-user");
  }

  // Endpoints de vehículos
  static async getVehicles() {
    return this.request("GET", "vehicles");
  }

  static async getVehicleById(id) {
    return this.request("GET", `vehicles/${id}`);
  }

  static async createVehicle(vehicleData) {
    return this.request("POST", "vehicles", vehicleData);
  }

  static async updateVehicle(id, vehicleData) {
    return this.request("PUT", `vehicles/${id}`, vehicleData);
  }

  static async deleteVehicle(id) {
    return this.request("DELETE", `vehicles/${id}`);
  }
}

export default ApiService;
