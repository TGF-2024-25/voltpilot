jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    GestureHandlerRootView: View,
    createNativeWrapper: jest.fn(),
    Directions: {},
  };
}),
  jest.mock("react-native-reanimated", () => {
    const Reanimated = require("react-native-reanimated/mock");

    // Mock de `call` para evitar errores en animaciones
    Reanimated.default.call = () => {};

    return Reanimated;
  }),
  jest.mock("@react-native-async-storage/async-storage", () => {
    return {
      __esModule: true,
      default: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
    };
  }),
  jest.mock("expo-clipboard", () => ({
    getStringAsync: jest.fn(),
    setStringAsync: jest.fn(),
  })),
  jest.mock("expo-location", () => ({
    getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 0, longitude: 0 } })),
    requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  })),
  jest.mock("react-native-google-places-autocomplete", () => {
    return {
      GooglePlacesAutocomplete: jest.fn(() => null),
    };
  }),
  jest.mock("expo-constants", () => ({
    manifest: {
      extra: {
        apiUrl: "https://example.com",
      },
    },
  }));
