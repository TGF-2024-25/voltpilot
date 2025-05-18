import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { AuthContext } from "../src/contexts/AuthContext";
import MiPerfil from '../src/views/UserDetails';
import { userAPI } from '../src/services/api';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
jest.mock('../src/services/api', () => ({
  userAPI: { updateProfile: jest.fn() },
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

describe('MiPerfil', () => {
  const user = {
    name: 'Test User',
    email: 'test@example.com',
    phoneNumber: '123456789',
    address: 'Test Address',
  };
  const uid = 'uid123';

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockImplementation(async (key) => {
      if (key === 'user') return JSON.stringify(user);
      if (key === 'uid') return uid;
      return null;
    });
    AsyncStorage.setItem.mockResolvedValue();
    userAPI.updateProfile.mockResolvedValue({
      data: { userDetail: { ...user, name: 'Updated User' } },
    });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  const renderWithContext = (checkToken = jest.fn()) =>
    render(
      <AuthContext.Provider value={{ checkToken }}>
        <MiPerfil />
      </AuthContext.Provider>
    );

  it('shows loading indicator initially', async () => {
    const { getByTestId } = renderWithContext();
    // ActivityIndicator should be present at first render
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('carga y mostrar datos de usuario ', async () => {
    const { findByDisplayValue } = renderWithContext();
    expect(await findByDisplayValue(user.name)).toBeTruthy();
    expect(await findByDisplayValue(user.email)).toBeTruthy();
    expect(await findByDisplayValue(user.phoneNumber)).toBeTruthy();
    expect(await findByDisplayValue(user.address)).toBeTruthy();
  });

  it('edita campo de text y cancela edita', async () => {
    const { findByDisplayValue, getByPlaceholderText, getByText } = renderWithContext();
    await findByDisplayValue(user.name);
    fireEvent.changeText(getByPlaceholderText('Ingresa tu nombre'), 'Nuevo Nombre');
    expect(getByPlaceholderText('Ingresa tu nombre').props.value).toBe('Nuevo Nombre');
    fireEvent.press(getByText('Cancelar'));
    expect(getByPlaceholderText('Ingresa tu nombre').props.value).toBe(user.name);
  });

  it('guarda cambio', async () => {
    const checkToken = jest.fn();
    const { findByDisplayValue, getByPlaceholderText, getByText } = renderWithContext(checkToken);
    await findByDisplayValue(user.name);
    fireEvent.changeText(getByPlaceholderText('Ingresa tu nombre'), 'Nuevo Nombre');
    fireEvent.changeText(getByPlaceholderText('Ingresa tu nueva contraseña'), 'abc123');
    fireEvent.changeText(getByPlaceholderText('Confirma tu nueva contraseña'), 'abc123');
    fireEvent.press(getByText('Guardar'));
    await waitFor(() => {
      expect(userAPI.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Nuevo Nombre',
          passwordupdate: 'abc123',
          uid,
        })
      );
      expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Perfil actualizado correctamente');
      expect(checkToken).toHaveBeenCalled();
    });
  });

  it('mostrar error y las contrasenia no coiniciden', async () => {
    const { findByDisplayValue, getByPlaceholderText, getByText } = renderWithContext();
    await findByDisplayValue(user.name);
    fireEvent.changeText(getByPlaceholderText('Ingresa tu nueva contraseña'), 'abc123');
    fireEvent.changeText(getByPlaceholderText('Confirma tu nueva contraseña'), 'xyz456');
    fireEvent.press(getByText('Guardar'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Las contraseñas no coinciden');
      expect(userAPI.updateProfile).not.toHaveBeenCalled();
    });
  });

  it('mostrar error cuando consigue guarda cambio no exito', async () => {
    userAPI.updateProfile.mockRejectedValueOnce(new Error('fail'));
    const { findByDisplayValue, getByPlaceholderText, getByText } = renderWithContext();
    await findByDisplayValue(user.name);
    fireEvent.changeText(getByPlaceholderText('Ingresa tu nueva contraseña'), 'abc123');
    fireEvent.changeText(getByPlaceholderText('Confirma tu nueva contraseña'), 'abc123');
    fireEvent.press(getByText('Guardar'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudo actualizar el perfil');
    });
  });
});