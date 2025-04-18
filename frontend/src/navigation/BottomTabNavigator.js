import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { VistaRutas, VistaEstacionesFavoritas, VistaPerfil } from "../views";
import { CargadorProvider } from "../context/CargadorContext";
import VistaEstacionInicio from "../views/EstacionInicio";

const Tab = createBottomTabNavigator();

export default function BarraNavegacion() {
  return (
    <CargadorProvider>
      <Tab.Navigator>
        <Tab.Screen name="Estaciones" component={VistaEstacionInicio} options={{ headerShown: false }} />
        <Tab.Screen name="Enrutado" component={VistaRutas} options={{ headerShown: false }} />
        <Tab.Screen name="Favoritas" component={VistaEstacionesFavoritas} />
        <Tab.Screen name="Perfil" component={VistaPerfil} />
      </Tab.Navigator>
    </CargadorProvider>
  );
}

