import React, { useEffect, useState } from "react";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import PlacesAutocomplete from "react-places-autocomplete/dist/PlacesAutocomplete";
import Geocode from "react-geocode";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";

const MAPKEY = "AIzaSyCsaCdVvhHkRAcPEpRYXwjQCjZgQ41ReAU";
Geocode.setApiKey(MAPKEY);
Geocode.enableDebug();

const StoreAddresPage = (props) => {
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [addressObj, setAddressObj] = useState("");
  const [center, setCenter] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [zoom, setZoom] = useState(9);
  const [draggable, setDraggable] = useState(true);

  const [address, setAddress] = useState("");

  useEffect(() => {
    props.handleSetMapAddress(addressObj, address)
  }, [addressObj])


  const onMarkerInteraction = (mouse) => {
    setDraggable(false);
    setLat(mouse.lat);
    setLng(mouse.lng);
  };

  const onMarkerInteractionMouseUp = () => {
    setDraggable(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    setCurrentLocation();
  }, []);

  const setCurrentLocation = () => {
    let lat = "";
    let long = "";
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        setCenter([lat, long]);
        setLat(lat, long);
        setLng(lat, long);
        _onClick({
          lat: lat,
          lng: long,
        });
        setZoom(15);
      });
    }
    if (lat && long) {
      _generateAddress(lat, long);
    }
  };

  const _onClick = (value) => {
    setLat(value.lat);
    setLng(value.lng);
    _generateAddress(value.lat, value.lng);
  };

  const _onChange = ({ center, zoom }) => {
    setCenter(center);
    setZoom(zoom);
  };

  const _generateAddress = (lat, lng) => {
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        setAddress(address);
        let colony, area, city, state, country, pinCode;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "neighborhood":
                colony = response.results[0].address_components[i].long_name;
                break;
              case "sublocality":
                area = response.results[0].address_components[i].long_name;
                break;
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
              case "postal_code":
                pinCode = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }
        let addObj = {
          area: colony + " " + area,
          city: city,
          state: state,
          country: country,
          pinCode: pinCode,
          lat: lat,
          lng: lng,
        };
        setAddressObj(addObj);

        console.log("addressObj :", JSON.stringify(addObj));
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    let latLng;
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => setlatLng(latLng))
      .catch((error) => console.error("Error", error));
  };

  const setlatLng = (latLng) => {
    setLat(latLng.lat);
    setLng(latLng.lng);
    _onClick(latLng);
    setCenter([latLng.lat, latLng.lng]);
    setZoom(15);
  };

  const apiHasLoaded = () => {
    setMapApiLoaded(true);
  };

  const placesAutocomplete = () => {
    return (
      <div>
        <PlacesAutocomplete
          value={address}
          onChange={handleChange}
          onSelect={handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div className="ac-input-holder pt-30">
              <input
                {...getInputProps({
                  placeholder: "Search Places ...",
                  className: "location-search-input form-control",
                })}
                id="ac-input"
              />

              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions?.map((suggestion, index) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "var(--light-gray-color)", cursor: "pointer" }
                    : { backgroundColor: "var(--white-color)", cursor: "pointer" };
                  return (
                    <div
                      key={index}
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span id="ui-autocomplete">{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between mx-4">

      </div>
      <div className="" >

        <div className="">
          <div className="col-md-12">
            <div className="menu-3-title">
              {mapApiLoaded && placesAutocomplete()}
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="menu-3-title">
                <div style={{ height: "40vh", width: "100%" }}>
                  <GoogleMapReact
                    center={center}
                    zoom={zoom}
                    draggable={draggable}
                    onChange={_onChange}
                    onChildMouseDown={onMarkerInteraction}
                    onChildMouseUp={onMarkerInteractionMouseUp}
                    onChildMouseMove={onMarkerInteraction}
                    onChildClick={() => console.log("child click")}
                    onClick={_onClick}
                    bootstrapURLKeys={{
                      key: MAPKEY,
                      libraries: ["places", "geometry"],
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) =>
                      apiHasLoaded(map, maps)
                    }
                  >
                    <Marker text={address} lat={lat} lng={lng} />
                  </GoogleMapReact>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />

      </div>
    </div>
  );
};

export default StoreAddresPage;
