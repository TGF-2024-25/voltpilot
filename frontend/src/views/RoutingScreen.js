import React, { useState, useRef } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import MapView, {PROVIDER_DEFAULT} from "react-native-maps";

export default function VistaRutas() {

  const [region, setRegion] = useState({
    latitude: 40.416775,
    longitude: -3.70379,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const mapRef = useRef(null);


  return (
    <View style={styles.container}>

        <MapView 
          style={styles.map}
          ref={mapRef}
          region={region}
          provider={PROVIDER_DEFAULT}
          >

        </MapView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchBar: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
})
