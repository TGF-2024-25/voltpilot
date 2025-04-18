import { Platform } from "react-native";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import styles from "./styles/appStyle";
import MapView from "react-native-maps";

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}

