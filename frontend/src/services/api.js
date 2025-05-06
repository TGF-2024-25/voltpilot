import AsyncStorage from "@react-native-async-storage/async-storage";
// import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// url de ka api backend
//const DEV_API_URL = 'http://voltpilot.naivc.top/api';//cambia a la ip de tu backend 
const DEV_API_URL = 'http://192.168.1.219:5000/api';//cambia a la ip de tu backend 

const API_URL = DEV_API_URL;

// patrone de facade de api
export const apiRequest = async (endpoint, method = "GET", data = null, requiresAuth = false) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // si la ruta requiere autenticacion, se añade el token al header
    if (requiresAuth) {
      let token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    };

    console.log("Config is: ", config);

    if (method === "GET") delete config.body;

    console.log(`Going to: ${API_URL}${endpoint} `);

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Request failed");
    }

    return responseData;
  } catch (error) {
    console.error(`API Error en api.js (${endpoint}):`, error);
    throw error;
  }
};

// auth API
export const authAPI = {
  login: (email, password) => apiRequest("/auth/login", "POST", { email, password }),
  register: (userData) => apiRequest("/users/register", "POST", userData),
  changePassword: (currentPassword, newPassword) => apiRequest("/auth/changePassword", "POST", { currentPassword, newPassword }, true),
};

// user API
export const userAPI = {
  getProfile: () => apiRequest('/users/profile', 'GET', null, true),
  updateProfile: (userData) => apiRequest('/users/profile', 'PUT', userData, true),
  updateVehicle: (vehicleData) => apiRequest('/users/vehicle', 'PUT', vehicleData, true),
  deletevehicle: ({uid,vid}) => apiRequest('/users/vehicle', 'DELETE', {uid,vid}, true),
};

// routing API
export const routingAPI = {
  getRoute: (origen, destino, preferencias) => apiRequest("/routing/route", "POST", { origen, destino, preferencias }, false),
  getAutonomia: (uid) => apiRequest(`/routing/autonomia/${uid}`, "GET", null, false),
  setAutonomia: (data_autonomia) => apiRequest(`/routing/autonomia`, "POST", data_autonomia, false),
  getEstacionesRuta: (ruta, autonomia, distancia) => apiRequest("/routing/estaciones", "POST", { ruta, autonomia, distancia }, false),
  getPreferencias: (uid) => apiRequest(`/routing/preferencias/${uid}`, "GET", null, false),
  setPreferencias: (data_preferencias) => apiRequest(`/routing/preferencias`, "POST", data_preferencias, false),
  getFavoritos: (uid) => apiRequest(`/routing/favoritos/${uid}`, "GET", null, false),
  setFavorito: (data_favorito) => apiRequest(`/routing/favoritos`, "POST", data_favorito, false),
  deleteFavorito: (data_favorito) => apiRequest(`/routing/favoritos`, "DELETE", data_favorito, false),
};

export const estacionAPI = {
  getEstaciones: (locationData) => apiRequest("/estaciones/getCargadores", "POST", locationData, false),
  getEstacionFotos: (location) => apiRequest("/estaciones/getCargadorFotos", "POST", location, false),
  getEstacionComentarios: (placeId) => apiRequest("/estaciones/getComentarios", "POST", placeId, false),
  createEstacionComentario: (commentData) => apiRequest("/estaciones/createComentario", "POST", commentData, true),
  deleteEstacionComentario: (commentData) => apiRequest("/estaciones/deleteComentario", "POST", commentData, true),
  getEstacionesFavoritas: (data) => apiRequest("/estaciones/getEstacionesFavoritas", "POST", data, true),
  addEstacionFavorita: (data) => apiRequest("/estaciones/addEstacionFavorita", "POST", data, true),
  deleteEstacionFavorita: (data) => apiRequest("/estaciones/deleteEstacionFavorita", "POST", data, true),
  getInfoCargador: (placeId) => apiRequest("/estaciones/getInfoCargador", "POST", placeId, false),
};
