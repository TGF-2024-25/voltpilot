import { View, Text, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { VistaEstacionInicio, VistaRutas, VistaEstacionesFavoritas, VistaPerfil } from "./views";
import UserDetails from "./views/UserDetails";
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

// user profile stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={VistaPerfil} options={{ headerShown: false }} />
      <Stack.Screen name="UserDetails" component={UserDetails} options={{ title: "Detalles de Usuario" }} />
      <Stack.Screen name="MisVehiculos" component={PlaceholderScreen} options={{ title: "Mis Vehículos" }} />
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
      <Tab.Navigator>
        <Tab.Screen name="Estaciones" component={VistaEstacionInicio} options={{ headerShown: false }} />
        <Tab.Screen name="Enrutado" component={VistaRutas} options={{ headerShown: false }} />
        <Tab.Screen name="Favoritas" component={VistaEstacionesFavoritas} />
        <Tab.Screen name="Perfil" component={ProfileStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </CargadorProvider>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  /*await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userDetail));
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('expiresIn', expiresIn); */
  // verification if the user is logged in
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token = null;
      try {
        // sacar token desede el almacenamiento local
        token = await AsyncStorage.getItem("authToken");
      } catch (e) {
        console.error("Failed to load user token", e);
      }

      // set estado de token
      setUserToken(token);
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
  return <NavigationContainer>{userToken ? <MainAppStack /> : <AuthStackScreen />}</NavigationContainer>;
}
