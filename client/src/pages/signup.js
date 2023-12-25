import React, { useState } from 'react';
import '../stylesheets/signup.css';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
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

  const signupHandler = async (e) => {
    e.preventDefault();

    // Reset Errors
    setEerror('');
    setPerror('');
    console.log(nickname)

    try {
      const response = await axios.post('http://localhost:5000/user/signup', {
        email,
        nickname,
        password,
      },{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        withCredentials: true
      });

      const responseData = response.data;

      if (responseData.errors) {
        setEerror(responseData.errors.email);
        setPerror(responseData.errors.password);
      }
      if (responseData.user) {
        localStorage.setItem('userid', responseData.user);
        localStorage.setItem('admin', responseData.admin);
        window.location.assign('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyle = { height: '30px' };

  return (
    <animated.div className="container" style={fade}>
      <div className="signup-form">
        <form onSubmit={signupHandler} className="sform">
          <h3 className="logger">Sign Up</h3>
          <div className="vertical-lines">
            <div className='inline'>
              <div className="emailx">
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email"
                  required
                  autoComplete="off"
                  placeholder="Email: "
                  style={inputStyle}
                />
                <div className="email-error">{eerror}</div>
              </div>
              <div className="passwordx">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="password"
                  required
                  autoComplete="off"
                  placeholder="Password: "
                  style={inputStyle}
                />
                <div className="password-error">{perror}</div>
              </div>
            </div>
            <div className='sline'>
              <div className="nicknamex">
                  <input
                    type="text"
                    name="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="nickname"
                    required
                    autoComplete="off"
                    placeholder="Nickname: "
                    style={inputStyle}
                  />
                </div>
            </div>
            <input type="submit" className="ssubmit" value="Sign Up" />
          </div>
        </form>
      </div>
    </animated.div>
  );
};

export default Signup;