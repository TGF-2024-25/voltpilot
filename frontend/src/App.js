// eslint-disable-next-line import/no-unresolved
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";
import BottomTabNavigator from "./components/BottomTabNavigator";
import LoginScreen from './views/LoginScreen';
import RegisterScreen from './views/RegisterScreen';

const Stack = createStackNavigator();
export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
