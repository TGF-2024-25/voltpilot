import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  VistaEstaciones,
  VistaRutas,
  VistaEstacionesFavoritas,
  VistaPerfil,
} from "../views";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Estaciones" component={VistaEstaciones} />
      <Tab.Screen name="Enrutado" component={VistaRutas} />
      <Tab.Screen name="Favoritas" component={VistaEstacionesFavoritas} />
      <Tab.Screen name="Perfil" component={VistaPerfil} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
