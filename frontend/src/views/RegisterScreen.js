import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import styles from "../styles/registerStyle";
//import { AuthContext } from '../App'; 
import { authAPI } from '../services/api.js';
import { useNavigation } from '@react-navigation/native';


// const { email, password, name, phoneNumber } = req.body;
export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigation = useNavigation();
  //const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      

      //verifica email, password y nombre
      if (!email || !password || !name) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
      
      await authAPI.register(email, password, name);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}