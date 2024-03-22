import { Link } from 'react-router-dom';
import {useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { UserModel } from "../models/UserModel";
import '../style/LogIn.css';

LogIn.propTypes = {
  authenticated: PropTypes.bool,
  setAuthenticated: PropTypes.func,
  setCurrentUser: PropTypes.func
}

export default function LogIn({setAuthenticated, setCurrentUser}){
  const navigate = useNavigate();

  const [logInError, setLogInError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(1, 'Username must be at least have a character'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
  });

  const formOptions = {resolver: yupResolver(validationSchema)};

  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const submitForm = async (data, e) => {
   const formData = JSON.stringify(data);
   try {
     const req = await fetch(
       'http://localhost:8080/api/login',
       {
         method: 'post',
         body: formData,
         headers: {
           'Content-Type': 'application/json'
         },
       }
     );
     const jsonResponse = await req.json();

     if (req.status !== 200){
       setErrorMessage(jsonResponse.errorMessage);
       setLogInError(true);
       return;
     }
     
     localStorage.setItem('token', jsonResponse.token);
     localStorage.setItem('userId', jsonResponse.user._id);
     localStorage.setItem('userAuthorized', true);
     localStorage.setItem('tokenDate', new Date())
     
     var newUser = new UserModel();
     newUser.id = jsonResponse.user._id;
     newUser.username = jsonResponse.user.username;
     newUser.admin = jsonResponse.user.admin;
     newUser.token = jsonResponse.token;

     setAuthenticated(true);
     setCurrentUser(newUser);

     navigate('/');
    }catch(err){
     console.log(e);
     console.log(err);
   }
  };

  return(
    <div className='content'>
      <div className='logInItem'>
        <h2>Log in</h2>
        <form className='logInFormContainer' onSubmit={handleSubmit(submitForm)}>
          <label htmlFor="username">Username:</label>
          <input className="logInInput" placeholder="User" {...register("username")}  />
          <div className="logInError">{errors.username?.message}</div>

          <label  htmlFor="password">Password:</label>
          <input className="logInInput"  type="password" {...register("password")} />
          <div className={`${errors.password ? 'errorContainer' : 'hideDiv'}`}>{errors.password?.message}</div>

          <button className='logInButton' type="submit" >Log In</button>
          {logInError && <p>{errorMessage}</p>}
        </form>
        <p className='registerText'>Do not have an account? 
          <Link to="/signUp" className='registerLink'>
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}