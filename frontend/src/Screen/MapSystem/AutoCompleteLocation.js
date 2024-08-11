import { useRef, useEffect } from "react";
import RouteIcon from "../../assets/icons/RouteIcon";
import { useJsApiLoader } from "@react-google-maps/api";
import { useGoogleMaps } from "../../contexts/MapsContext";

const AutoCompleteLocation = ({
  onChange,
  value,
  placeholder,
  disabled,
  idx = 0,
}) => {
  const autoCompleteRef = useRef();
  const inputRef = useRef();

  // Load Google Maps JavaScript API
  const { isLoaded } = useGoogleMaps();
  const options = {
    componentRestrictions: { country: "ca" },
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["address"],
  };

  useEffect(() => {
    if (isLoaded) {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
  
      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current.getPlace();
  
        console.log("Place Result:", place);
  
        if (place && place.geometry) {
          const address = place.name || place.formatted_address || "";
          const latLong = place.geometry.location;
  
          // Update the input's value directly
          if (inputRef.current) {
            inputRef.current.value = address;
  
            const data = {
              name: address,
              location: { lat: latLong.lat(), lng: latLong.lng() },
            };
            onChange(data, idx);
          }
        } else {
          // Fallback if place is undefined or geometry is missing
          console.log("No valid place found, consider handling this case");
          // Optionally, use reverse geocoding or another fallback method here
        }
      });
    }
  }, [isLoaded, idx, options, onChange]);
  

  return (
    <div
      className={
        placeholder
          ? "border-[1px] rounded-md flex justify-center px-2 w-2/3"
          : `flex bg-white rounded-full gap-x-1 py-1 px-3 lg:p-3 w-full shadow-lg items-center`
      }
    >
      <div className={placeholder && "hidden"}>
        <RouteIcon width={25} color={"#9A9A9A"} />
      </div>

      <input
        type="text"
        placeholder={placeholder || "Location"}
        className={`placeholder-gray-200 focus:outline-none text-gray-300 ${
          placeholder || "text-lg"
        } w-full`}
        onChange={(e) => onChange(e.target.value, idx)}
       
        value={value} // This is controlled now by the parent
        disabled={disabled}
        ref={inputRef}
        autoComplete="off"
      />
    </div>
  );
};

export default AutoCompleteLocation;
