module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect", "./jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|react-native-maps" +
      "|react-native-gesture-handler" +
      "|react-native-reanimated" +
      "|expo-location" +
      "|expo-clipboard" +
      "|expo-constants" +
      "|expo-font" +
      "|expo-app-loading" +
      "|expo-file-system" +
      "|expo-asset" +
      "|expo" +
      "|@expo" +
      "|expo-modules-core" +
      "|@gorhom/bottom-sheet" +
      "|@react-native-async-storage/async-storage" +
      "|@react-navigation" +
      "|react-native-tab-view" +
      "|react-native-vector-icons" +
      "|@expo/vector-icons" +
      "|react-native-google-places-autocomplete" +
      ")/)",
  ],
};