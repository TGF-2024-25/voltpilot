import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/loginStyle";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api.js';
import { AuthContext } from '../App';

export default function LoginScreen() {
  const { checkToken } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        Alert.alert('Error', 'Please fill all fields');
        return;
      }

      // devuelve el token de la API y datos del usuario
      const response = await authAPI.login(email, password);
      if (!response.success) {
        throw new Error(response.message || '登录失败');
      }
      const userDetail = response.data.userDetail;
      const token = response.data.token;
      const refreshToken = response.data.refreshToken;
      const expiresIn = response.data.expiresIn;

      console.log("userDetail", userDetail);
      
      // guardar el token y los datos del usuario en dispositivo local
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userDetail));
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('expiresIn', expiresIn);
      await AsyncStorage.setItem('uid', userDetail.id);

      await checkToken(); //verifica si el token es valido
    } catch (error) {
      Alert.alert('Login Failed', error.message);
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
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}