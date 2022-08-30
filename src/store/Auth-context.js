import React, {useState,useEffect,useCallback} from 'react';

let logoutTimer;

const AuthContext = React.createContext({
    token:'',
    isLoggedIn: false,
    idToken:null,
    login:(token)=>{},
    logout:()=>{},
});
//init data

const calculateRemainingTime = (expirationTime) =>{
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    
    const remainingDuration = adjExpirationTime - currentTime;
    return remainingDuration;
}

const retrieveStoredToken = ()=> {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime')   ;

    const remainingTime = calculateRemainingTime(storedExpirationDate);
    
    if(remainingTime <= 0){
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }
    return {
        token:storedToken,
        duration:remainingTime,
    }
}



export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();
    console.log('tokenData '+tokenData);
    let initialToken;
    if (tokenData){
        initialToken = tokenData.token;
        
        // setTimeout(logoutHandler, tokenData.duration); can not work，cuz logoutHandler be defined after here
    }
    const [token, setToken] = useState(initialToken);
    
    const userIsLoggedIn = !!token;
    
    const logoutHandler =useCallback((props) => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        if(logoutTimer) {
            clearTimeout(logoutTimer);
        }
    },[]);
    const loginHandler = (token,expirationTime) =>{
        setToken(token);
        localStorage.setItem('token',token);
        localStorage.setItem('expirationTime',expirationTime); //should be a string

        const remainingTime = calculateRemainingTime(expirationTime);
        
        logoutTimer = setTimeout(logoutHandler,remainingTime);       
    };
    console.log('before useEffect');
    useEffect(()=>{
        if(tokenData){
            console.log('useEffect setTimeout '+tokenData.duration);
            logoutTimer = setTimeout(logoutHandler,tokenData.duration);
        }
    },[tokenData, logoutHandler]);
    console.log('after useEffect');
    
    const contextValue = {
        token : token,
        isLoggedIn:userIsLoggedIn,
        login:loginHandler,
        logout:logoutHandler,
    };

    return <AuthContext.Provider value={contextValue}> {props.children}</AuthContext.Provider>
};

export default AuthContext;