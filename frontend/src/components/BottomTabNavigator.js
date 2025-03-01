import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation } from "@react-navigation/native";
import {
  VistaEstaciones,
  VistaRutas,
  VistaEstacionesFavoritas,
  VistaPerfil,
} from "../views";

const Tab = createBottomTabNavigator();

export default function BarraNavegacion() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Estaciones"
        component={VistaEstaciones}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Enrutado"
        component={VistaRutas}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Favoritas" component={VistaEstacionesFavoritas} />
      <Tab.Screen name="Perfil" component={VistaPerfil} />
    </Tab.Navigator>
  );
}
