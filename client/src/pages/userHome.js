import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesheets/userHome.css'
import HeadPhoto from '../photos/france.jpg'
import { useCookies } from 'react-cookie';
let userId = localStorage.getItem('userid')


const UserHome = () => {
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldUsername, setOldUsername] = useState('');

  const [cookie,setCookie] = useCookies()
  const jwt = cookie.jwt
  useEffect(() => {
    if (!jwt) {
      window.location.assign('/login');
    }
  })

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      // Replace 'USER_ID' with the actual user ID or fetch it from somewhere
      const response = await axios.get(`http://localhost:5000/user/one/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Function to update password
  const handlePasswordChange = async () => {
    try {
      await axios.patch(`http://localhost:5000/user/password?userId=${userId}`, {
        currentPassword,
        newPassword
      });
      // Clear password fields after update
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on component mount
  }, []);
 
  const onClick1 = () => {
    window.location.href = '/posts';
  };

  const onClick2 = () => {
    window.location.href = '/newposts';
  };

  return (
    <div className='ucontainer'>
    <div className="topphoto">
        <img src={HeadPhoto} className="topuser" alt="admin" />
        <h2>Just One Of Us</h2>
          <button onClick={onClick1} className="bbutton">
            Posts Page
          </button>
          <button onClick={onClick2} className="ybutton">
            New Posts Page
          </button>
      </div>
    <div className='useful'>
        {userData && (
            <div className='userdiv'>
            <p className='usernick'>Hello {userData.nickname}</p>
            <div className='together'>
                <div className='times'>
                    <p className='usertimep'>Favorite Category: {userData.favoriteCategory}</p>
                </div>
                <div className='current'>
                    <p className='useremail'>Email: {userData.email}</p>
                    <p className='userpass'>Password: *********</p>
                </div>
            </div>
            <div>
                {/* Form to update password */}
                <div className='change'>
                    <input
                        type="password"
                        placeholder="Current Password"
                        className='cpass'
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        className='new'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={handlePasswordChange} className='changebut'>Change Password</button>
                </div>
            </div>
            </div>
        )}
    </div>
    </div>
  );
};

export default UserHome;