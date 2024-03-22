import { Outlet } from "react-router-dom";
import Header from './Header';
import Footer from "./Footer";
import PropTypes from 'prop-types';

Layout.propTypes = {
  authenticated: PropTypes.bool,
  setAuthenticated: PropTypes.func,
  setCurrentUser: PropTypes.func,
}


export default function Layout({authenticated, setAuthenticated, setCurrentUser}){
  return(
    <>
      <Header authenticated={authenticated} setAuthenticated={setAuthenticated} setCurrentUser={setCurrentUser}/>
      <Outlet />
      <Footer />
    </>
  )
}