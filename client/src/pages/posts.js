import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import '../stylesheets/posts.css'
import HeadPhoto from '../photos/como.jpg'

const Posts = () => {
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

        fetch(`http://localhost:5000/model/regression?id=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            redirect: 'follow'
        })
        .then(res => res.json())
        .then(rData => {
            // Manipulate your regression data if needed

            fetch('http://localhost:5000/model/samples', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify({ percentages: rData })
            })
            .then(res => res.json())
            .then(data => {
                const mergedData = Object.values(data.images).reduce((acc, val) => acc.concat(val), [])
                                .concat(Object.values(data.texts).reduce((acc, val) => acc.concat(val), []));
                // Shuffle the merged data array
                const shuffledData = mergedData.sort(() => Math.random() - 0.5);
                setData(shuffledData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching regression data:', error);
        });
    }, [jwt, userId]);

    const handleLike = (id, type, list, category) => {
        if (list.includes(userId)) {
            console.log('Already liked');
        } else {
            if (type === 'text') {
                fetch(`http://localhost:5000/user/category?category=${category}&userId=${userId}`,{
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow'
                })
                fetch(`http://localhost:5000/model/addtext?id=${id}&userId=${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow',
                })
                .then(() => {
                    const updatedData = data.map(item => {
                        if (item._id === id) {
                            return {
                                ...item,
                                likedList: [...item.likedList, userId],
                                likes: item.likes + 1,
                            };
                        }
                        return item;
                    });
                    setData(updatedData);
                })
                .catch(error => {
                    console.error('Error liking the post:', error);
                });
            } else if (type === 'image') {
                fetch(`http://localhost:5000/user/category?category=${category}&userId=${userId}`,{
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow'
                })
                fetch(`http://localhost:5000/model/addimage?id=${id}&userId=${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow',
                })
                .then(() => {
                    const updatedData = data.map(item => {
                        if (item._id === id) {
                            return {
                                ...item,
                                likedList: [...item.likedList, userId],
                                likes: item.likes + 1,
                            };
                        }
                        return item;
                    });
                    setData(updatedData);
                })
                .catch(error => {
                    console.error('Error liking the image:', error);
                });
            }
        }
    };
    
    const handleDislike = (id, type, list, category) => {
        if (type === 'text' && list.includes(userId)) {
            fetch(`http://localhost:5000/user/downcategory?category=${category}&userId=${userId}`,{
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow'
                })
            fetch(`http://localhost:5000/model/ridtext?id=${id}&userId=${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
            })
            .then(() => {
                const updatedData = data.map(item => {
                    if (item._id === id) {
                        return {
                            ...item,
                            likedList: item.likedList.filter(likedUserId => likedUserId !== userId),
                            likes: item.likes - 1,
                        };
                    }
                    return item;
                });
                setData(updatedData);
            })
            .catch(error => {
                console.error('Error disliking the post:', error);
            });
        } else if (type === 'image' && list.includes(userId)) {
            fetch(`http://localhost:5000/user/downcategory?category=${category}&userId=${userId}`,{
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow'
                })
            fetch(`http://localhost:5000/model/ridimage?id=${id}&userId=${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
            })
            .then(() => {
                const updatedData = data.map(item => {
                    if (item._id === id) {
                        return {
                            ...item,
                            likedList: item.likedList.filter(likedUserId => likedUserId !== userId),
                            likes: item.likes - 1,
                        };
                    }
                    return item;
                });
                setData(updatedData);
            })
            .catch(error => {
                console.error('Error disliking the image:', error);
            });
        }
    };
    
    const removeCaps = (str) => {
        console.log(str.toLowerCase())
        return str.toLowerCase();
    };

    const onClick1 = () => {
        window.location.href = '/newposts';
      };
    
      const onClick2 = () => {
        window.location.href = '/userhome';
      };
    

    return (
        <div className='postcontainer'>
            <div className="ptopphoto">
                <img src={HeadPhoto} className="ptopbasic" alt="admin" />
                <h2>Another Day Another Win</h2>
                <button onClick={onClick1} className="pbbutton">
                    New Posts Page
                </button>
                <button onClick={onClick2} className="pybutton">
                    User Info Page
                </button>
            </div>
            <div className='posts'>
                {data && data.length > 0 ? (
                    data.map(item => (
                        <div key={item._id} className='random-item'>
                            {item.text && (
                                <p>{item.text}</p>
                            )}
                            {item.fileId && (
                                <img src={`http://localhost:5000/model/getimagepic?id=${item.fileId}`} alt={item.category} />
                            )}
                            <p>Likes: {item.likes}</p>
                            <button
                                onClick={() => handleLike(item._id, item.type, item.likedList, removeCaps(item.category))}
                                className={item.likedList && item.likedList.includes(userId) ? 'likepost liked' : 'likepost'}
                            >
                                Like
                            </button>
                            <button
                                onClick={() => handleDislike(item._id, item.type, item.likedList, removeCaps(item.category))}
                                className={item.likedList && item.likedList.includes(userId) ? 'dispost liked' : 'dispost'}
                            >
                                Dislike
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No data to display</p>
                )}
            </div>
        </div>
    );
};

export default Posts;
