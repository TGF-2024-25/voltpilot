import React, { useRef, useState } from "react";
import { View, Button, Text, Dimensions, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

// Definir las pantallas de cada pestaña
const FirstRoute = () => (
  <View style={[styles.routeContainer, { flex: 1 }]}>
    <Text>Conectores</Text>
  </View>
);

const SecondRoute = () => (
  <View style={[styles.routeContainer, { flex: 1 }]}>
    <Text>Información</Text>
  </View>
);

const ThirdRoute = () => (
  <View style={[styles.routeContainer, { flex: 1 }]}>
    <Text style={{ color: "red" }}>Reseñas</Text>
  </View>
);

const FourthRoute = () => (
  <View style={[styles.routeContainer, { flex: 1 }]}>
    <Text>Fotos</Text>
  </View>
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
  fourth: FourthRoute,
});

const renderTabBar = (props) => (
  <TabBar
    {...props}
    style={styles.tabBar}
    indicatorStyle={styles.tabIndicator} // Personaliza el indicador (la línea azul)
    labelStyle={styles.tabLabel} // Personaliza el estilo de los textos
  />
);

const MyTabView = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Conectores" },
    { key: "second", title: "Información" },
    { key: "third", title: "Reseñas" },
    { key: "fourth", title: "Fotos" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      renderTabBar={renderTabBar} // Usar la barra de pestañas personalizada
      style={{ flex: 1 }} // Asegura que TabView ocupe todo el espacio disponible
      lazy // Carga las pestañas solo cuando son necesarias
    />
  );
};

const styles = StyleSheet.create({
  routeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabView: {
    flex: 1, // Asegura que el TabView ocupe todo el espacio disponible
  },
  bottomSheetView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "black",
    elevation: 0, // Evita la sombra en la parte superior de la barra
    // Puedes ajustar el alto de la barra de pestañas si es necesario
    height: 50, // Aquí puedes definir la altura de la barra de pestañas (botones)
  },
  tabIndicator: {
    backgroundColor: "blue", // Personaliza el color del indicador (la línea azul)
  },
  tabLabel: {
    fontWeight: "bold",
    fontSize: 16, // Ajusta el tamaño de la fuente de las etiquetas
  },
});

export default MyTabView;
