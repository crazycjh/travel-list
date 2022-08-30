import { useState, useRef,useReducer,useEffect,useContext } from "react";
import { initializeApp } from 'firebase/app';
import AuthContext from "../store/Auth-context";

import classes from "./InputArea.module.css";

const inputReducer = (state, action)=> {
  if(action.type === 'travelName'){
    return {travelNameValue:action.value}
  }
  if(action.type === 'location'){
    return {locationValue:action.value}
  }
  if(action.type === 'date'){
    return {dateValue: action.value}
  }
  if(action.type === 'text'){
    return {textValue: action.value}
  }
  if(action.type === 'clean'){
    return{locationValue:"", textValue:""}
  }
  if(action.type === 'all'){
    return{locationValue:action.valueLocation, textValue:action.valueText, dateValue:action.valueDate};
  }
}
let gps={};


const InputArea = (props) => {
  const [travelInfo, setTravelInfo] = useState(null);
  const [errorPop, setErrorPop] = useState(false);
  const [oldDataState, setOldData] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false)
  const [newMarkerState, setNewMarker]  = useState(false);
  // const [enteredLoca, setEnteredLoca] = useState('');
  // const [enteredText,setEnteredText] = useState('');
  // const [enteredDate,setEnteredDate] = useState('');
  const authCtx = useContext(AuthContext);
  const travelNameInputRef = useRef();
  const locationInputRef = useRef();
  const dateInputRef = useRef();
  const textInputRef = useRef();
  const [inputState, dispatchInput] = useReducer(inputReducer,{
    travelNameValue:"",
    locationValue:"",
    dateValue:"",
    textValue:"",
  });
  
  const submitHandler = async(e) => {
    e.preventDefault();
    console.log("submit");
    console.log(Object.keys(gps).length);
    console.log(Object.keys(gps));
    
    if (
      !locationInputRef.current.value ||
      !dateInputRef.current.value ||
      !textInputRef.current.value ||
      !Object.keys(gps).length ||
      !authCtx.isLoggedIn
    ) {
      if(!authCtx.isLoggedIn){
        setErrorLogin(true);
        //not login
      }else{
        setErrorPop(true);
        console.log("error");
      }
      
    } else {
      console.log('else else');
      setTravelInfo({
        location: locationInputRef.current.value,
        date: dateInputRef.current.value,
        text: textInputRef.current.value,
      });
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${gps.lat},${gps.lng}&language=en-US&key=AIzaSyAR3-8wOXn2f7NcmF4cOF6xkTHqH5bJpqY`
        // "https://maps.googleapis.com/maps/api/geocode/json?latlng=50.08906167443343,14.422259330749512&language=zh-TW&key=AIzaSyAR3-8wOXn2f7NcmF4cOF6xkTHqH5bJpqY"
      )
      
      let data = await res.json();
      //data = data.plus_code.compound_code.split(" ");
      const img = Math.floor(Math.random() * 10)
        //send the input data to App.js for saving 
      console.log("all data ------");
      console.log(locationInputRef.current.value+" "+dateInputRef.current.value+' '+ gps.lat+" "+gps.lng+' '  + ' ' + img + ' '+data.plus_code.compound_code+ ' '+ textInputRef.current.value)   
      props.onInputData({ 
      location: locationInputRef.current.value,
      date: dateInputRef.current.value,
      gps: gps,
      img:img,
      cityName:data.plus_code.compound_code,
      // gps: props.info ? props.info.gps : props.newMarker,
      text: textInputRef.current.value,
      });
      
      
      
      dispatchInput({type:'clean'})
      setErrorPop(false);
      setNewMarker(false);
      setOldData(false);
      props.onClear('GPS');
      // gps={};
      console.log("submit else");
    }
    console.log('end edn');
  };
  const enterTravelNameHandler = (e)=>{
    // setEnteredLoca(e.target.value);
    dispatchInput({type:"travelName",value:e.target.value});
    
  }

  const enterLocationHandler = (e)=>{
    // setEnteredLoca(e.target.value);
    dispatchInput({type:"location",value:e.target.value});
    
  }
  const enterTextHandler = (e)=> {
    // setEnteredText(e.target.value);
    dispatchInput({type:"text",value:e.target.value});
    console.log('enterTextHandler');
  }
  
  const enterDateHandler = (e) => {
    // setEnteredDate(e.target.value);
    dispatchInput({type:"date",value:e.target.value});
  }

  const deleteHandler = () => {
    props.onDelete({ 
      location: locationInputRef.current.value,
      date: dateInputRef.current.value,
      gps: gps,
      // gps: props.info ? props.info.gps : props.newMarker,
      text: textInputRef.current.value,
    }) 
    dispatchInput({type:'clean'})
    setErrorPop(false);
    setNewMarker(false);
    setOldData(false);
      
  }
  
  const handleChange = (event)=>{
    // setFile(event.target.files[0]);
  }

  useEffect(() => {
    if (Object.keys(props.info).length > 0) {
      //for edit the old data, set the info into the input field
      dispatchInput({type:"all",valueLocation:props.info.location, valueText:props.info.text, valueDate:props.info.date});
      gps = props.info.gps;
      
      props.onClear('INFO');
      console.log(props.info);
      console.log('info');
      setOldData(true);
      setNewMarker(false);
    }
  },[props.info]);

  useEffect(()=> {
    console.log("useEffect");
    console.log(props.newMarker);
    gps = props.newMarker;
    console.log('newMarker');
    setOldData(false);
    setNewMarker(true);
    
  },[props.newMarker])
  // if(Object.keys(props.info).length > 0 && oldDataState){
  //   dispatchInput({type:"all",valueLocation:props.info.location, valueText:props.info.text, valueDate:props.info.date});
  //   props.onClear('INFO');
  //   setOldData(false);
  // }
  
  return (
    <>
    
    <div className={classes.block}>
    <h3>新增地點</h3>
      <form onSubmit={submitHandler}>
      <div className="input-group mb-3">
          {/* <span className="input-group-text" id="inputGroup-sizing-default">
            行程名稱
          </span>
          <input
            type="text"
            className="form-control"
            id='travelName'
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            placeholder="為你的旅程取名"
            ref={travelNameInputRef}
            onChange={enterTravelNameHandler}
            value={inputState.travelNameValue}
          /> */}
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            地點Locaiton
          </span>
          <input
            type="text"
            className="form-control"
            id='location'
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            ref={locationInputRef}
            onChange={enterLocationHandler}
            value={inputState.locationValue}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Date日期
          </span>
          <input
            type="date"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            ref={dateInputRef}
            onChange={enterDateHandler}
            value={inputState.dateValue}
          />
        </div>
        <div className="mb-3">
          
          <label for="text" className="form-label">
            Note註記
          </label>
          <textarea
            className="form-control"
            id="text"
            rows="3"
            ref={textInputRef}
            onChange={enterTextHandler}
            value={inputState.textValue}
          ></textarea>
        </div>
        {/* {console.log("return gps ="+gps)} */}
        {!oldDataState && <button className="btn btn-dark">新增</button>}
        {oldDataState && <button className="btn btn-dark">修改</button>}
        
        { oldDataState &&
          <div className={classes.deletediv}>
           <button className="btn btn-dark" type="button" onClick={deleteHandler} >刪除</button>
          </div>
          }
        {errorPop && <p>請輸入地點/日期/標記</p>}
        {/* <div>
            <input type="file" accept="image/*" onChange={handleChange}/>
            <button>Upload to Firebase</button>
        </div> */}
      </form>
      {travelInfo && (
        <div>
          
          <br />
          {travelInfo.location} <br />
          {travelInfo.date} <br />
          {travelInfo.text}
        </div>
      )}
    </div>
    </>
  );
};

export default InputArea;
