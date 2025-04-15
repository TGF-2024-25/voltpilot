/* eslint-disable import/no-unresolved */
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "@env";

export default function SearchBar({ placeholder, onSelect }) {
    return (
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder={placeholder}
        onPress={(data, details = null) => {
          if (details) {
            const { lat, lng } = details.geometry.location;
            onSelect({ latitude: lat, longitude: lng });
          }
        }}
        query={{ key: GOOGLE_MAPS_API_KEY, language: "es" }}
        styles={{ textInput: { backgroundColor: "white", borderRadius: 25, paddingHorizontal: 15, fontSize: 16 } }}
      />
    );
  }