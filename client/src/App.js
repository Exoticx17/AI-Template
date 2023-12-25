import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup';
import Navbar from './components/navbar';
import React from 'react';
import Footer from './components/footer';
import UserHome from './pages/userHome';
import Posts from './pages/posts';
import SingleFile from './pages/singleFile';
import NewPost from './pages/newPost';



function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
      <div className="routes">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/userHome" element={<UserHome />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/posts" element={<Posts />} />
          <Route exact path="/single/:id" element={<SingleFile />} />
          <Route exact path="/newposts" element={<NewPost />} />
        </Routes>
      </div>
      <Footer />
      </Router>
    </div>
  );
}

export default App;