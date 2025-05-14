import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { paymentAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PayPal from 'react-native-paypal-wrapper';

const PaymentScreen = () => {
  const [paypalAccounts, setPaypalAccounts] = useState([]);
  
  useEffect(() => { loadAccounts(); }, []);

  const loadAccounts = async () => {
    try {
      const uid = await AsyncStorage.getItem('userId');
      const res = await paymentAPI.getSavedPaymentMethods(uid);
      setPaypalAccounts(res.data || []);
    } catch (err) {
      Alert.alert('error', 'no se ha podido cargar cuentas de paypal');
    }
  };

  const connectPaypal = async () => {
    try {
      // configuración de PayPal
      const config = {
        clientId: 'ASh4o_dNodInUscXU1BVMlDpdwMVOCkI8u7vU3pDi3vE8fz_qN1hpn9Ab4hFXr_7aOJv--yfo2B_x44C',
        environment: PayPal.ENVIRONMENT.SANDBOX
      };

      // inicializa PayPal
      const auth = await PayPal.initialize(config);
      const { email } = await PayPal.obtainConsent();
      
      if (email) {
        const uid = await AsyncStorage.getItem('uid');
        await paymentAPI.savePaymentMethod({ 
          userId: uid, 
          type: 'paypal',
          email: email
        });
        loadAccounts();
      }
    } catch (err) {
      Alert.alert('error', 'no se ha podido conectar a PayPal');
    }
  };

  
  const removePaypal = async (id) => {
    try {
      const uid = await AsyncStorage.getItem('userId');
      await paymentAPI.deleteSavedPaymentMethod({ userId: uid, methodId: id });
      loadAccounts();
    } catch (err) {
      Alert.alert('error', 'borrar cuenta de paypal falló');
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>PayPal</Text>
      
      <FlatList
        data={paypalAccounts}
        renderItem={({item}) => (
          <View style={s.account}>
            <Text style={s.email}>{item.email || 'PayPal账户'}</Text>
            <TouchableOpacity onPress={() => removePaypal(item.id)}>
              <Text style={s.remove}>borrar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>no tiene cuenta de paypal</Text>}
      />

      {paypalAccounts.length === 0 && (
        <TouchableOpacity style={s.connectBtn} onPress={connectPaypal}>
          <Text style={s.btnText}>aniadir paypal</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  account: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 8 },
  email: { fontWeight: '500' },
  remove: { color: 'red' },
  empty: { textAlign: 'center', marginVertical: 20, color: '#666' },
  connectBtn: { backgroundColor: '#0070BA', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  btnText: { color: 'white', fontWeight: 'bold' }
});

export default PaymentScreen;