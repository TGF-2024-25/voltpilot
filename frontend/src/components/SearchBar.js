/* eslint-disable import/no-unresolved */
import React, { useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
export default function SearchBar({ placeholder, onSelect, showClearButton = false, clearButtonColor = "white", testID = "search-bar" }) {
  const searchBarRef = useRef(null); // Crea una referencia para el componente

  return (
    <GooglePlacesAutocomplete
      ref={searchBarRef} // Asigna la referencia al componente
      fetchDetails={true}
      placeholder={placeholder}
      testID={testID}
      onPress={(data, details = null) => {
        if (details) {
          const { lat, lng } = details.geometry.location;
          const name = details.name;

          onSelect({ latitude: lat, longitude: lng, name });
        }
      }}
      query={{ key: GOOGLE_MAPS_API_KEY, components: "country:es", language: "es" }}
      styles={{
        textInput: {
          backgroundColor: "white",
          borderRadius: 25,
          paddingHorizontal: 15,
          fontSize: 16,
          height: 50, // Altura del campo de texto
          paddingRight: showClearButton ? 40 : 15, // Espacio para el botón si está habilitado
        },
        container: {
          flex: 1,
        },
        textInputContainer: {
          flexDirection: "row",
          alignItems: "center",
        },
      }}
      renderRightButton={() =>
        showClearButton ? (
          <TouchableOpacity
            onPress={() => searchBarRef.current?.clear()}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 5,
              height: 40,
              width: 40,
              borderRadius: 20,
              backgroundColor: "#65558F", // Fondo gris claro
            }}
          >
            <Icon name="close" size={20} color={clearButtonColor} />
          </TouchableOpacity>
        ) : null
      }
    />
  );
}
