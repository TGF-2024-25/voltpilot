import React, { useState } from "react";
import { Animated, View, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

const FirstRoute = () => <View style={[styles.container, { backgroundColor: "white" }]} />;
const SecondRoute = () => <View style={[styles.container, { backgroundColor: "white" }]} />;
const ThridRoute = () => <View style={[styles.container, { backgroundColor: "white" }]} />;
const FourthRoute = () => <View style={[styles.container, { backgroundColor: "white" }]} />;

const TabViewExample = () => {
  const [index, setIndex] = useState(0);
  const routes = [
    { key: "first", title: "Conectores" },
    { key: "second", title: "Información" },
    { key: "third", title: "Reseñas" },
    { key: "fourth", title: "Fotos" },
  ];

  const _handleIndexChange = (index) => setIndex(index);

  const _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) => (inputIndex === i ? 1 : 0.5)),
          });

          return (
            <TouchableOpacity key={route.key} style={styles.tabItem} onPress={() => setIndex(i)}>
              <Animated.Text style={{ opacity, color: "white", fontSize: 11.5, fontWeight: "bold" }}>
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThridRoute,
    fourth: FourthRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={_renderScene}
      renderTabBar={_renderTabBar}
      onIndexChange={_handleIndexChange}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    paddingTop: 10,
    backgroundColor: "#65558F",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
});

export default TabViewExample;
