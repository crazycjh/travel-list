import classes from './TravelList.module.css'
import { useState,useContext } from 'react';
import TravelCard from './TravelCard';
import { Link } from 'react-router-dom';
import AuthContext from '../store/Auth-context';



const TravelList = (props) => {
 const [saveClickState, setSavedClick] = useState(true); 
 const [passClickState, setPassClick] = useState(false);
 const authCtx = useContext(AuthContext);
 let Travel="";
 const saveTravelHandler = () => {
    //日期列表 
    setSavedClick(true);
    setPassClick(false);
    
  }  
  if(Object.keys(props.data).length){
    Travel = <TravelCard data={props.data}/>
  }
  
  
  
  const setPassHandler =()=>{
  }
  console.log(Object.keys(props.data).length);
  
  return (
    <div className={`${classes.title} `}>
      <h3 >
        我的行程
      </h3>
      <ul className={classes.ul}>
        <li className={saveClickState ? classes.act : ""} onClick={saveTravelHandler}>已儲存</li>
        
        <li className={passClickState ? classes.act : ""} disable={true} onClick= {setPassHandler}>已結束</li>
      </ul>
      <hr/>
      
      {!Object.keys(props.data).length &&  <p>No travel info yet, <Link to="/home">click to add</Link></p> }
      
      {Travel}
      
        {/* <div className="row">
        <div className=" col-lg-4 col-md-6 col-sm-12">
            <div className={`card `} >
            <div className={`card ${classes.travelcard}`} >
                <img src={require("../img/1.jpg")} className={`card-img-top ${classes.travelimg}`} alt="..."/>
                
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="/#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
            <div className={`card `} >
            <div className={`card ${classes.travelcard}`} >
                <img src={require("../img/2.jpg")} className={`card-img-top ${classes.travelimg}`} alt="..."/>
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="/#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        </div>
        <div className=" col-lg-4 col-md-6 col-sm-12">
            <div className={`card `} >
            <div className={`card ${classes.travelcard}`} >
                <div className = {classes.travelimgcontainer}>
                  <img src={require("../img/3.jpg")} className={`card-img-top  ${classes.travelimg}`} alt="..."/>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="/#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        </div>




        
      </div> */}
    </div>
  );
};

export default TravelList;
