import classes from "./AuthForm.module.css";
import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from '../store/Auth-context';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  

  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();

  const submitHandler = (event) => {

    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    let tempToken="";
    setIsLoading(true);
    
    const fetchMeals = async (tempToken) => {
      console.log({tempToken});
      // url = `https://react-http-f4180-default-rtdb.firebaseio.com/meals.json?auth=${tempToken}`;
      // const response = await fetch(url);
      const response = await fetch(`https://react-http-f4180-default-rtdb.firebaseio.com/meals.json`);
      if (!response.ok) {
        throw new Error('something went wrong'); 
      }
      
      const data = await response.json();
      console.log("meals");
      console.log(data);
    };


    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCP6zPlKx8fPvth7gNwLKhZuRvFTPdwG-0';
    } else {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCP6zPlKx8fPvth7gNwLKhZuRvFTPdwG-0";
    }  
    fetch(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers:{
          'Content-Type':'application/json'
        }
      }
    ).then((res) =>{
      setIsLoading(false);
      if (res.ok){ 
        console.log('res.ok');
        return res.json();
      }else{
        return res.json().then(data=>{
          let errorMessage = 'Authetication failed!';
          // if (data && data.error && data.error.message) {
          //   errorMessage = data.error.message;
          // }
          // alert(errorMessage)
          // console.log(data);
          console.log('errro and Throw');
          throw new Error(errorMessage);
        })
      }
    }).then(data=>{
      // console.log('data '+data);
      const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
      
      
      // fetchMeals(data.idToken).then().catch((error)=>{
      //   console.log("error");
      // });  
      authCtx.idToken = data.idToken
      authCtx.login(data.idToken,expirationTime.toISOString());
      history.replace('/travel-list');
    }).catch((err)=>{
      // console.log(err);
      console.log('catch err');
      alert(err.message);

    });
   console.log({tempToken});



  

    







  }
  const switchAuthModeHandler = ()=> {
    setIsLogin((prevState)=>{return (!prevState)})
  }



  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request....</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
