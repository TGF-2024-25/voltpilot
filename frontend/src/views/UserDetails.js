import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/appStyle';
import { userAPI } from '../services/api';


export default function MiPerfil() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [originalData, setOriginalData] = useState({});

  // Load user data when component mounts
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setLoading(true);
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const parsedData = JSON.parse(userJson);
          setUserData(parsedData);
          setOriginalData(parsedData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  //      const { name, email, phoneNumber, address, password} = req.body;

const handleChange = (field, value) => {
  // 使用函数式更新，避免依赖旧状态
  setUserData(prevData => ({
    ...prevData,
    [field]: value
  }));
};
//      const { name, email, phoneNumber, address, password} = req.body;

const handleSave = async () => {
  try {
    setLoading(true);
    
    // 从用户数据中提取令牌并保存到 AsyncStorage
    const token = userData.token;
    
    // 确保令牌存在并有效 - 可以添加简单的有效性检查
    if (!token || typeof token !== 'string' || token.length < 20) {
      throw new Error('No se encontró token válido de autenticación');
    }
    
    // 显式地重新保存令牌到 AsyncStorage
    await AsyncStorage.setItem('authToken', token);
    
    // 不将令牌作为用户数据的一部分发送
    const userDataToUpdate = { ...userData };
    delete userDataToUpdate.token; // 移除令牌，不需要更新令牌
    
    // 调用后端 API 更新用户数据
    const response = await userAPI.updateProfile(userDataToUpdate);
    
    // 保存返回的更新后数据
    const updatedUserData = {
      ...userData,
      ...response.data, // 合并API返回的数据
      token // 保留原始令牌
    };
    
    // 更新本地存储
    await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
    setOriginalData(updatedUserData);
    setUserData(updatedUserData); // 同时更新当前状态
    Alert.alert('Éxito', 'Perfil actualizado correctamente');
    setEditing(false);
  } catch (error) {
    console.error('Error saving user data:', error);
    Alert.alert('Error', 'No se pudo actualizar el perfil');
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setUserData(originalData);
    setEditing(false);
  };

  const ProfileField = ({ label, field, value, editable = true }) => {
    const [inputRef] = useState(React.createRef());
    const [isFocused, setIsFocused] = useState(false);
  
    return (
      <View style={localStyles.fieldContainer}>
        <Text style={localStyles.fieldLabel}>{label}</Text>
        {editing && editable ? (
          <TextInput
            ref={inputRef}
            style={[
              localStyles.input,
              isFocused && localStyles.inputFocused // 
            ]}
            value={value}
            onChangeText={(text) => handleChange(field, text)}
            placeholder={`Ingresa tu ${label.toLowerCase()}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            // 
            blurOnSubmit={false} 
            returnKeyType="next"
          />
        ) : (
          <Text style={localStyles.fieldValue}>{value || 'No disponible'}</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Mi Perfil</Text>
        
        <View style={localStyles.card}>
          <ProfileField label="Nombre" field="name" value={userData.name} />
          <ProfileField label="Correo electrónico" field="email" value={userData.email} />
          <ProfileField label="Teléfono" field="phone" value={userData.phone} />
          <ProfileField label="Dirección" field="address" value={userData.address} />
        </View>
        
        <View style={localStyles.buttonContainer}>
          {editing ? (
            <>
              <TouchableOpacity
                style={[localStyles.button, localStyles.saveButton]}
                onPress={handleSave}
              >
                <Text style={localStyles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[localStyles.button, localStyles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={localStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[localStyles.button, localStyles.editButton]}
              onPress={() => setEditing(true)}
            >
              <Text style={localStyles.buttonText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[localStyles.button, localStyles.passwordButton]}
          onPress={() => navigation.navigate('CambiarContraseña')}
        >
          <Text style={localStyles.buttonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>.
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  inputFocused: {
    borderColor: '#4A90E2',
    borderWidth: 2,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2,
    marginHorizontal: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4A90E2',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  passwordButton: {
    backgroundColor: '#FF9800',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});