import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import '../stylesheets/newPost.css'
import HeadPhoto from '../photos/germany.jpg'

const NewPost = () => {

    const [postedFile, setPostedFile] = useState(null);
    const [selected, setSelected] = useState();
    const [text, setText] = useState(false);
    const [image, setImage] = useState(false);
    const [cookie, setCookie] = useCookies();
    const jwt = cookie.jwt;
    let userId = localStorage.getItem('userid');
    const [data, setData] = useState([]);

    useEffect(() => {
        if (jwt) {
            fetch(`http://localhost:5000/user/one/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            })
            .then(res => res.json())
            .then(userData => {
                // Manipulate your user data if needed
            });
        }
    })

    const imageClick = () => {
        setText(false)
        setImage(true)
    }

    const textClick = () => {
        setImage(false)
        setText(true)
    }

    const handleFileChange = (e) => {
        const selected = e.target.files[0]; // Assuming only one file is selected
        setPostedFile(selected);
        setSelected('Selected')
    };

    const handlePostSubmit = async (e) => {
      
        try {
          const formData = new FormData();
          formData.append('file', postedFile); // Assuming 'selectedFile' contains the uploaded file
          formData.append('user', userId)
      
          await axios.post(`http://localhost:5000/model/image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setSelected('')
        } catch (error) {
          console.error('Error creating file:', error);
          // Handle error, show message to user, etc.
        }
      };

      const handlePostTSubmit = async (e) => {
        const textValue = e.target.text.value;
        try {
            await axios.post(`http://localhost:5000/model/text`, { text: textValue, user: userId });
        } catch (error) {
            console.error('Error creating text file:', error);
            // Handle error, show message to user, etc.
        }
    };

    const onClick1 = () => {
        window.location.href = '/posts';
      };
    
      const onClick2 = () => {
        window.location.href = '/userhome';
      };

    return ( 
        <div className='newpostcontainer'>
            <div className="ntopphoto">
                <img src={HeadPhoto} className="ntopbasic" alt="admin" />
                <h2>Are You Ready??</h2>
                <button onClick={onClick1} className="nbbutton">
                    Posts Page
                </button>
                <button onClick={onClick2} className="nybutton">
                    User Home Page
                </button>
            </div>
            <div className='chosing'>
                <button onClick={imageClick} className='imageb'>
                    Image
                </button>
                <button onClick={textClick} className='textb'>
                    Text
                </button>
            </div>
            <div className={image ? "file-creation-form" : "hide"}>
                <h2 className='fcreateh2'>Create an Image File</h2>
                <form onSubmit={handlePostSubmit} className='fcreateform'>
                    <input type="file" onChange={handleFileChange} className='fcreatefilebut'/>
                    <button type="submit" className='fsubmitbut'>Create File</button>
                </form>
                <div className='ffile'>
                    {selected}
                </div>
            </div>
            <div className={text ? "text-creation-form" : "hide"}>
                <h2 className='fcreateh2'>Create a Text File</h2>
                <form onSubmit={handlePostTSubmit} className='fcreateform'>
                    <input type="text" name="text" className='fnamei' placeholder='Text: '/>
                    <button type="submit" className='fsubmitbut'>Create Text</button>
                </form>
            </div>
        </div>
     );
}
 
export default NewPost;