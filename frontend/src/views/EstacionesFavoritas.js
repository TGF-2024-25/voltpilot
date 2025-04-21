import { View, StyleSheet, Text } from "react-native";
const VistaEstacionesFavoritas = () => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    paddingTop: 10,
    backgroundColor: "#65558F",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
});

export default VistaEstacionesFavoritas;
