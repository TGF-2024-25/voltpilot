import AsyncStorage from '@react-native-async-storage/async-storage';

// url de ka api backend
const DEV_API_URL = 'http://192.168.1.243:5000/api';//cambia a la ip de tu backend 
const API_URL = DEV_API_URL;

// patrone de facade de api
export const apiRequest = async (endpoint, method = 'GET', data = null, requiresAuth = false) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      }; 
  
      // si la ruta requiere autenticacion, se añade el token al header
      if (requiresAuth) {
        let token = await AsyncStorage.getItem('idToken');
        
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const config = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
      };

      console.log("Congifig is: ", config);
  
      if (method === 'GET') delete config.body;

      console.log(`Going to: ${API_URL}${endpoint} `)
  
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const responseData = await response.json();

      console.log("Response Data is: ", responseData);
  
      if (!response.ok) {
        throw new Error(responseData.message || 'Request failed');
      }
  
      return responseData;
    } catch (error) {
      console.error(`API Error en api.js (${endpoint}):`, error);
      throw error;
    }
  };

// auth API
export const authAPI = {
  login: (email, password) => apiRequest('/auth/login', 'POST', { email, password }),
  register: (userData) => apiRequest('/users/register', 'POST', userData),
  logout: () => apiRequest('/auth/logout', 'POST', {}, true),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', 'POST', { email }),
  changePassword: (currentPassword, newPassword) => 
  apiRequest('/auth/change-password', 'POST', { currentPassword, newPassword }, true),
};

// user API
export const userAPI = {
  getProfile: () => apiRequest('/users/profile', 'GET', null, true),
  updateProfile: (userData) => apiRequest('/users/profile', 'PUT', userData, true),
};

// routing API
export const routingAPI = {
  getRoute: (origen, destino) => apiRequest("/routing/route", "POST", { origen, destino }, false),
  getAutonomia: (uid) => apiRequest(`/routing/autonomia/${uid}`, "GET", null, false),
  setAutonomia: (data_autonomia) => apiRequest(`/routing/autonomia`, "POST", data_autonomia, false),
  getEstacionesRuta: (ruta, autonomia, distancia) => apiRequest( "/routing/estaciones", "POST", { ruta, autonomia, distancia }, false),
};