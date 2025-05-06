import { View, Text, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { VistaEstacionInicio, VistaRutas, VistaEstacionesFavoritas, VistaPerfil } from "./views";
import UserDetails from "./views/UserDetails";
import UserVehicle from "./views/UserVehicle";
import VehicleScreen from "./views/Vehicle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MenuProvider } from "react-native-popup-menu";
import { CargadorProvider } from "./contexts/EstacionContext";

// import patalla login y registro
import LoginScreen from "./views/LoginScreen";
import RegisterScreen from "./views/RegisterScreen";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// login y registro
function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: "Registrarse" }} />
    </AuthStack.Navigator>
  );
}

function UserVehicleScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VehiclesList" component={UserVehicle} options={{ title: "Mis Vehículos" }} />
      <Stack.Screen name="Vehiculo" component={VehicleScreen} options={{ title: "Datos de vehiculo" }} />
    </Stack.Navigator>
  );
}

// user profile stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={VistaPerfil} options={{ headerShown: false }} />
      <Stack.Screen name="UserDetails" component={UserDetails} options={{ title: "Detalles de Usuario" }} />
      <Stack.Screen name="MisVehiculos" component={UserVehicleScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MisPagos" component={PlaceholderScreen} options={{ title: "Mis Pagos" }} />
      <Stack.Screen name="MiHistoriaDeRecarga" component={PlaceholderScreen} options={{ title: "Mi Historia de Recarga" }} />
      <Stack.Screen name="TerminosYPrivacidad" component={PlaceholderScreen} options={{ title: "Términos y Privacidad" }} />
    </Stack.Navigator>
  );
}

// placeholder screen for future development
function PlaceholderScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Esta pantalla está en desarrollo</Text>
    </View>
  );
}

// main stack
function MainAppStack() {
  return (
    <CargadorProvider>
      <Stack.Navigator>
        {/* Tab Navigator como pantalla principal */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }} // Oculta el encabezado del stack para las pestañas
        />
        {/* Pantalla adicional para navegar desde Favoritas */}
        <Stack.Screen
          name="Estaciones"
          component={VistaEstacionInicio} // Cambia esto al componente correcto si es otro
          options={{ title: "Detalles de la Estación" }}
        />
        {/* Pantalla Favoritas */}
        <Stack.Screen
          name="Favoritas"
          component={VistaEstacionesFavoritas} // Pantalla de favoritos
          options={{ title: "Estaciones Favoritas" }}
        />
      </Stack.Navigator>
    </CargadorProvider>
  );
}

// Tab Navigator separado
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Estaciones" component={VistaEstacionInicio} options={{ headerShown: false }} />
      <Tab.Screen name="Enrutado" component={VistaRutas} options={{ headerShown: false }} />
      <Tab.Screen name="Favoritas" component={VistaEstacionesFavoritas} />
      <Tab.Screen name="Perfil" component={ProfileStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export const AuthContext = createContext();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  /*await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userDetail));
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('expiresIn', expiresIn); */
  // verification if the user is logged in
  const checkToken = async () => {
    let token = null;
    try {
      token = await AsyncStorage.getItem("authToken");
    } catch (e) {
      console.error("Failed to load user token", e);
    }
    setUserToken(token);
    return token;
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      await checkToken();
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  // si la app esta cargando, mostrar un indicador de carga
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // <MenuProvider>
  // </MenuProvider>
  {
    /* <NavigationContainer>{userToken ? <MainAppStack /> : <AuthStackScreen />}</NavigationContainer> */
  }
  return (
    <AuthContext.Provider value={{ checkToken }}>
    <NavigationContainer>
      {userToken ? <MainAppStack /> : <AuthStackScreen />}
    </NavigationContainer>
    </AuthContext.Provider>
  );
}
