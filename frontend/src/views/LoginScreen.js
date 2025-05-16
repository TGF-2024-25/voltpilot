import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/loginStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../services/api.js";
import { AuthContext } from "../App";

export default function LoginScreen() {
  const { checkToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  /*
        success: true,
        message: 'login exito',
        data: {
          userDetail: userDetails, //devuelve datos d usuario de firestore
          token: authData.idToken, //devuelve token de usuario para operaciones futuras
          refreshToken: authData.refreshToken,
          expiresIn: authData.expiresIn
        }
*/
  const handleLogin = async () => {
    try {
      //verifica email y password
      if (!email || !password) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      // devuelve el token de la API y datos del usuario
      const response = await authAPI.login(email, password);
      if (!response.success) {
        throw new Error(response.message || "error en el login");
      }
      const userDetail = response.data.userDetail;
      const vehicles = userDetail.vehicles || []; // Asegúrate de que vehicles sea un array
      let selectedVehicles = [];
      if (vehicles.length > 0) {
        selectedVehicles = vehicles.filter((vehicle) => vehicle.seleccionado === true); // Only selected vehicles
      }
      const token = response.data.token;
      const refreshToken = response.data.refreshToken;
      const expiresIn = response.data.expiresIn;
      console.log("userDetail", userDetail);

      //cosa de user
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          email: userDetail.email,
          name: userDetail.name,
          phoneNumber: userDetail.phoneNumber || "",
          address: userDetail.address || "",
        }),
      ); // Guardar solo los datos necesarios
      await AsyncStorage.setItem("vehicles", JSON.stringify(vehicles)); // Guardar vehículos como JSON

      console.log("uid bug", userDetail.uid);
      //cosa de auth y otracosas
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("expiresIn", expiresIn);
      await AsyncStorage.setItem("uid", userDetail.uid || userDetail.id);
      await AsyncStorage.setItem("id", userDetail.email);

      //si hay coche seleccionado, guardar datos de coche
      if (selectedVehicles.length > 0) {
        await AsyncStorage.setItem("autonomia", selectedVehicles[0].autonomia); // Guardar autonomía del primer vehículo seleccionado
        await AsyncStorage.setItem("tipo", selectedVehicles[0].tipo);
      } else {
        await AsyncStorage.setItem("autonomia", ""); // Guardar autonomía del primer vehículo seleccionado
        await AsyncStorage.setItem("tipo", "");
      }

      await checkToken(); //verifica si el token es valido
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
