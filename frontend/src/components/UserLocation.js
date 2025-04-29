import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function UserLocation() {
  const [origen, setOrigen] = useState(null);

    useEffect(() => {
      getLocationPermission();
    }, []);
  
    async function getLocationPermission() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission Denied");
        setOrigen({
          latitude: 40.4168,   // Por ejemplo: Madrid
          longitude: -3.7038,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
          name: "Madrid (origen predeterminado)",
        });
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setOrigen({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }

  return [origen, setOrigen];
}