import React, { createContext, useContext, useMemo } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GoogleMapsContext = createContext();

const libraries = ["places"];
export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "",
    libraries

  });

  const value = useMemo(() => ({ isLoaded, loadError }), [isLoaded, loadError]);

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
