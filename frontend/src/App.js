import { Platform } from "react-native";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./components/BottomTabNavigator";
import styles from "./styles/appStyle";

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
