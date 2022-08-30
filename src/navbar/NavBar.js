import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../store/Auth-context';

import classes from './NavBar.module.css';

const NavBar = () => {
    const authCtx = useContext(AuthContext);
    
    const logoutHandler = () =>{
        authCtx.logout();
      };

    return ( 
    <>
    <ul className={classes.nav}>
        <li><Link to="/travel-list">Home</Link></li>
        <li><Link to="/travel-list/urtravel">Your Travel</Link></li>
        {authCtx.isLoggedIn && (<li><Link to="/travel-list/profile">Profile</Link></li>)}
        {!authCtx.isLoggedIn && (<li ><Link  to="/travel-list/auth">login</Link></li>)}
        {authCtx.isLoggedIn && (<li ><button type='button' onClick={logoutHandler}>logout</button></li>)}
    </ul>
    {/* <ul className={classes.nav}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/urtravel">Your Travel</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li ><Link  to="/login">login</Link></li>
    </ul> */}
    </>  
      )
}

export default NavBar;