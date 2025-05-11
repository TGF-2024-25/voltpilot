module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect", "./jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|react-native-maps|react-native-gesture-handler|react-native-reanimated|expo-location|expo-clipboard|expo-constants|@gorhom/bottom-sheet|@react-native-async-storage/async-storage|@react-navigation|react-native-tab-view|react-native-vector-icons|react-native-google-places-autocomplete)/)",
  ],
};
