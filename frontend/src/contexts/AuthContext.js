import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

// 创建认证上下文
const AuthContext = createContext();

// 提供认证状态和方法的提供者组件
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  // 初始化 - 检查用户是否已登录
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // 从存储中加载令牌
        const token = await AsyncStorage.getItem('authToken');
        const userJson = await AsyncStorage.getItem('user');
        
        if (token && userJson) {
          setUserToken(token);
          setUserData(JSON.parse(userJson));
        }
      } catch (e) {
        console.error('Failed to restore authentication state:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // 认证方法
  const authContext = {
    isLoading,
    userToken,
    userData,
    
    // 登录
    login: async (email, password) => {
      try {
        setIsLoading(true);
        const response = await authAPI.login(email, password);
        
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        
        setUserToken(response.data.token);
        setUserData(response.data.user);
        setIsLoading(false);
        
        return { success: true };
      } catch (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
    },
    
    // 注册
    register: async (userData) => {
      try {
        setIsLoading(true);
        const response = await authAPI.register(userData);
        
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        
        setUserToken(response.data.token);
        setUserData(response.data.user);
        setIsLoading(false);
        
        return { success: true };
      } catch (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
    },
    
    // 登出
    logout: async () => {
      try {
        setIsLoading(true);
        await authAPI.logout();
      } catch (e) {
        console.log('Logout API error:', e);
      }
      
      // 无论 API 是否成功，都清除本地存储
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      setUserToken(null);
      setUserData(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义 hook 以便在组件中使用 AuthContext
export const useAuth = () => useContext(AuthContext);