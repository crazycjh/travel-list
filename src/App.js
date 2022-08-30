import { Route, Switch, Redirect } from "react-router-dom";

import GMap from "./gmap/GMap";
import InputArea from "./inputArea/InputArea";
import NavBar from "./navbar/NavBar";
import TravelList from "./TravelList/TravelList";
import AuthPage from "./pages/AuthPage";

import { useState, useContext, useEffect } from "react";
import AuthContext from "./store/Auth-context";
import classes from "./App.module.css";
import NotFound from "./pages/NotFound";

const DummyData = [
  {
    location: "火車站",
    date: "2022-08-27",
    gps: { lat: 50.08322404382108, lng: 14.43530559539795 },
    img: "0",
    cityName: "3CMP+74M Prague, Czechia",
    text: "買車票，隔天一早出發",
  },
  {
    location: "火藥塔景點",
    date: "2022-08-27",
    gps: { lat: 50.08746465746262, lng: 14.431400299072266 },
    img: "5",
    cityName: "3CPH+W4M Prague, Czechia",
    text: "飛機落地後的第一個景點",
  },
  {
    location: "市集",
    date: "2022-08-27",
    gps: { lat: 50.084573370675564, lng: 14.420628547668457 },
    img: "8",
    cityName: "3CMC+R7C Prague, Czechia",
    text: "買水果補充維生素，參觀當地市集",
  },
  {
    location: "查理大橋",
    date: "2022-08-27",
    gps: { lat: 50.0865009145791, lng: 14.411401748657227 },
    img: "6",
    cityName: "3CP6+HHV Prague, Czechia",
    text: "最著名的觀光點，黃昏來去看看，光線美好拍照，夜景也很美",
  },
];

const App = () => {
  const [newMarker, setNewMarker] = useState({});
  const [MarkerInfoState, setNewMarkerInfo] = useState({});
  const [cleanMarker, setCleanMarker] = useState(false);
  const [getInfo, setGetInfo] = useState({});
  const [infoState, setInfo] = useState({});
  const AuthCtx = useContext(AuthContext);

  const fetchList = async () => {
    const url = `https://react-http-f4180-default-rtdb.firebaseio.com/Travel.json?auth=${AuthCtx.token}`;
    // const url = `https://react-http-f4180-default-rtdb.firebaseio.com/meals.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const data = await response.json();
    setNewMarkerInfo(data);
  };

  const NewMarkerHandler = (position) => {
    setNewMarker(position);
    setCleanMarker(false);
  };

  const inputNewMarkerInfoHandler = (infoDateGps) => {
    // put the data(info, date, gps) into the array/server

    const index = MarkerInfoState.findIndex((object) => {
      return (
        object.gps.lat === infoDateGps.gps.lat &&
        object.gps.lng === infoDateGps.gps.lng
      );
    });

    //update the info
    if (index > -1) {
      setNewMarkerInfo((prevState) => {
        let tempOldData = prevState;

        tempOldData[index] = infoDateGps;

        return tempOldData;
      });
      setInfo({ ...infoDateGps, del: false });
    } else {
      setNewMarkerInfo((prevState) => {
        return [...prevState, infoDateGps];
      });
    }
  };

  const deleteHandler = (infoDateGps) => {
    const index = MarkerInfoState.findIndex((object) => {
      return (
        object.gps.lat === infoDateGps.gps.lat &&
        object.gps.lng === infoDateGps.gps.lng
      );
    });

    //update the info
    setInfo({ ...MarkerInfoState[index], del: true });
    if (index > -1) {
      setNewMarkerInfo((prevState) => {
        prevState.splice(index, 1);
        //delete the specific item
        return prevState;
      });
    }
  };

  const clearInput = (type) => {
    //

    if (type === "GPS") {
      setCleanMarker(true);
    }

    if (type === "INFO") {
      setGetInfo({});
      // clear info temp state
    }
  };

  const getMarkerInfoHandler = (position) => {
    const index = MarkerInfoState.findIndex((object) => {
      return object.gps.lat === position.lat && object.gps.lng === position.lng;
    });
    setInfo({ ...MarkerInfoState[index], del: false });
    setGetInfo(MarkerInfoState[index]);

    //show again the data info on the inputArea for edit & on infowindow
    //close window & mapclick & clickmarker  都不需要清除，when click close keep it still be editable ,the rest: don't be mind that cuz clicking alway send new gps
    //submit 後若不清除在re-render時會持續顯示在input欄位上
  };
  useEffect(() => {
    if (AuthCtx.isLoggedIn) {
      fetchList();
    } else {
      setNewMarkerInfo({});
    }
  }, [AuthCtx.isLoggedIn]);

  return (
    <>
      <NavBar />
      <Switch>
        <Route path="/travel-list" exact>
          <Redirect to="/travel-list/home" />
        </Route>
        <Route path="/travel-list/home">
          <div className={classes.appflex}>
            <GMap
              onGetNewMarker={NewMarkerHandler}
              pinMarker={MarkerInfoState}
              cleanFlag={cleanMarker}
              onGetMarkerInfo={getMarkerInfoHandler}
              info={infoState}
            />
            <InputArea
              newMarker={newMarker}
              onInputData={inputNewMarkerInfoHandler}
              onClear={clearInput}
              info={getInfo}
              onDelete={deleteHandler}
            />
          </div>
        </Route>
        <Route path="/travel-list/urtravel">
          <TravelList data={MarkerInfoState} />
        </Route>

        <Route path="/travel-list/profile">
          {!AuthCtx.isLoggedIn && <Redirect to="/travel-list/auth" />}
        </Route>

        {!AuthCtx.isLoggedIn && (
          <Route path="/travel-list/auth">
            <AuthPage />
          </Route>
        )}
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </>
  );
};
export default App;
