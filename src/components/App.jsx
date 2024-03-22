import { BrowserRouter,  Route,  Routes } from "react-router-dom";

import '../style/App.css';
import Layout from "./Layout";
import Home from './Home';
import LogIn from './LogIn';
import SignUp from './SignUp';
import AllPostView from "./AllPostView";
import BlogPostView from './BlogPostView';
import { useEffect, useState } from "react";
import NewBlogPost from "./NewBlogPost";
import ErrorPage from "./ErrorPage";
import { UserModel } from "../models/UserModel";

export default function App(){
  const [authenticated, setAuthenticated] = useState(() =>{
    const isAuthorized = localStorage.getItem('userAuthorized');
    
    if (!isAuthorized) {
      return false;
    }

    const tokenDate = new Date(localStorage.getItem('tokenDate'));
    tokenDate.setDate(tokenDate.getDate() + 1);
    const dateNow = new Date();
    
    if (dateNow > tokenDate){
      return false;
    }

    return true;
  });

  const [currentUser, setCurrentUser] = useState(new UserModel());

  useEffect(() => {
    if (!authenticated){
      return;
    }

    const userId = localStorage.getItem('userId');
    fetchUser(userId);
  },[]);
    
  const fetchUser = async(id) => {
    if (id == "" || id == undefined){
      return new UserModel();
    }

    const req = await fetch(`http://localhost:8080/api/get_user/${id}`);
    
    if(!req){
      return new UserModel();
    }
    const data = await req.json();

    if (req.status !== 200){
      console.log("post error");
      return new UserModel();
    }

    var newUser = new UserModel();
    newUser.id = data.user._id;
    newUser.username = data.user.username;
    newUser.admin = data.user.admin;
    newUser.token = localStorage.getItem("token");

    setCurrentUser(newUser);
  }

  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout authenticated={authenticated} setAuthenticated={setAuthenticated} setCurrentUser={setCurrentUser}/>}>
            <Route path="/" element={<Home/>} />
            <Route path="/logIn" element={<LogIn setAuthenticated={setAuthenticated} setCurrentUser={setCurrentUser}/>} />
            <Route path="/signUp" element={<SignUp/>} />
            <Route path="/post" element={<AllPostView/>} />
            <Route path="/post/:id" element={<BlogPostView authenticated={authenticated} currentUser={currentUser}/>} />
            <Route path="*" element={<ErrorPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}