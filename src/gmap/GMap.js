import {
  GoogleMap,
  LoadScript,
  MarkerClusterer,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";

import classes from "./GMap.module.css";

const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const divStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 15,
};

const center = { lat: 50.08732698109427, lng: 14.42779541015625 };

const locations = [{ lat: -31.56391, lng: 147.154312 }];

const options = {
  imagePath:
    "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
};

function createKey(location) {
  return location.lat + location.lng;
}

const GMap = (props) => {
  const [infoWinState, setInfoWin] = useState(false);
  const [infoLocationState, setInfoLocationWin] = useState({});
  const [tmepMarkerState, setTempMarker] = useState({});
  let position = {};

  //clean the temp marker gps so after submit and submit again would not
  if (props.cleanFlag && tmepMarkerState) {
    setTempMarker({});
    props.onGetNewMarker({});
  }

  const mapClickHandler =  (e) => {
    const newMarker = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (!infoWinState) {
      //   setNewMarker((prevLoca)=>{
      //     return ([...prevLoca, newMarker]);
      //   })
      props.onGetNewMarker(newMarker);
      setTempMarker(newMarker);
      console.log(e);
    } else {
      // if the info window is showed, click map once time to close it and not to create new one marker
      setInfoWin(false);
    }

    



    
    
    
      // .then((res)=>{
      //   console.log(res);
      //   let x = res.json();
      //   console.log(x);
      //   return(x);
      // }).then((data)=>{console.log({data})});  
    
    // await res.then((data)=>{
    //   console.log(data)
    // });
    
    // console.log(y);
    //  res.then((data)=>{
    //     console.log(data);
    //  });
    //  console.log(x.plus_code);
  };

  const markerClickHandler = (e) => {
    position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setTempMarker({});
    //set the info window gps & state
    setInfoLocationWin(position);
    setInfoWin(true);
    console.log("marker click");
    //send gps to inpuArea to get data

    props.onGetMarkerInfo(position);
  };

  const onload = (infoWindow) => {
    console.log("infoWindow: ", infoWindow);
  };
  console.log(tmepMarkerState);
  console.log("end end tmepMarkerState");
  return (
    <div className={classes.gmapconfig}>
      <LoadScript googleMapsApiKey="AIzaSyAR3-8wOXn2f7NcmF4cOF6xkTHqH5bJpqY">
        <GoogleMap
          id="marker-example"
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={center}
          onClick={mapClickHandler}
        >
          {" "}
          {console.log(tmepMarkerState)}
          {Object.keys(tmepMarkerState).length && (
            <Marker position={tmepMarkerState} />
          )}
          {Object.keys(props.pinMarker).length && (
            <MarkerClusterer options={options}>
              {(clusterer) =>
                props.pinMarker.map((info) => {
                  {
                    /* <Marker key={createKey(info.gps)} position={info.gps} clusterer={clusterer}  onClick={markerClickHandler} draggable={true} onDragStart={dragStartHandler} onDragEnd={dropRefreshHandler}/>  */
                  }
                  return (
                    <Marker
                      key={createKey(info.gps)}
                      position={info.gps}
                      clusterer={clusterer}
                      onClick={markerClickHandler}
                    />
                  );
                })
              }
            </MarkerClusterer>
          )}
          {infoWinState && !props.info.del && (
            <InfoWindow onLoad={onload} position={infoLocationState}>
              <div>
                <h6>{props.info.location}</h6>
                <p>{props.info.text}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      {/* {NewMarkerState.map((location,i)=> {
          return (<div>{i+1}. {location.lat} {location.lng}</div>)
        })} */}
    </div>
  );
};
export default GMap;
