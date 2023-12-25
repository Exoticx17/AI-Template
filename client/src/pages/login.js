import React, { useState } from 'react';
import '../stylesheets/login.css';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';

const Login = () => {
  const [eerror, setEerror] = useState('');
  const [perror, setPerror] = useState('');

  const fade = useSpring({
    from: {
      opacity: 0.1,
    },
    to: {
      opacity: 1,
    },
    config: {
      duration: 750,
    },
  });

  const loginHandler = (e) => {
    e.preventDefault();
  
    // Reset Errors
    setEerror('');
    setPerror('');
  
    const userEmail = e.target.lemail.value;
    const userPassword = e.target.lpassword.value;
    console.log('userEmail:', userEmail); // Debug log
    console.log('userPassword:', userPassword); // Debug log
  
    // Make the POST request to the server
    axios.post('http://localhost:5000/user/login', {
      email: userEmail,
      password: userPassword,
    },{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      withCredentials: true
    })
    .then((response) => {
      const responseData = response.data;
  
      if (responseData.user) {
        // Store user-related data in local storage
        localStorage.setItem('userid', responseData.user);
        localStorage.setItem('admin', responseData.admin);
        // Redirect the user to a new location
        window.location.assign('/');
      } else if (responseData.errors) {
        // Handle specific error cases
        if (responseData.errors.email) {
          setEerror(responseData.errors.email);
        }
        if (responseData.errors.password) {
          setPerror(responseData.errors.password);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };
  
  
  

  const inputStyle = { height: '30px' };

  return (
    <animated.div className="container" style={fade}>
      <div className="login-form">
        <form onSubmit={loginHandler} className="lform">
          <h3 className="logger">Login</h3>
          <div className="vertical-lines">
            <div className="lemailx">
              <input
                type="text"
                name="lemail"
                className="lemail"
                required
                autoComplete="off"
                placeholder="Email: "
                style={inputStyle}
              />
              <div className="email-error">{eerror}</div>
            </div>
            <div className="lpasswordx">
              <input
                type="password"
                name="lpassword"
                className="lpassword"
                required
                autoComplete="off"
                placeholder="Password: "
                style={inputStyle}
              />
              <div className="password-error">{perror}</div>
            </div>
            <input type="submit" className="lsubmit" value="Login" />
          </div>
        </form>
      </div>
    </animated.div>
  );
};

export default Login;