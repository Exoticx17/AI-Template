import React from 'react'
import '../stylesheets/home.css'
import Cornith from '../photos/cornith.jpg'
import Milan from '../photos/milan.jpg'
import HeadPhoto from '../photos/athens.jpg'
import Mancester from '../photos/mancester.jpg'

const Home = () => {

    const onClick1 = () => {
        window.location.href = '/files';
      };
    
      const onClick2 = () => {
        window.location.href = '/voting';
      };

    return ( 
        <div>
            <div className="topphoto">
                <img src={HeadPhoto} className="topuser" alt="admin" />
                <h2>Just One Of Us</h2>
                <button onClick={onClick1} className="bbutton">
                    File Info Page
                </button>
                <button onClick={onClick2} className="ybutton">
                    Voting Info Page
                </button>
            </div>
            <div className='below'>
                <div className='left'>
                    <h2>Template</h2>
                    <p>Creating a robust MERN (MongoDB, Express.js, React.js, Node.js) template can significantly expedite the development process for websites and apps. Here’s an extended version of a template that could serve as a solid foundation:</p>
                </div>
                <img src={Cornith} className='limage' />
                <div className='right'>
                    <h2>Ideas</h2>
                    <p>In our world today, there's a host of critical issues begging for solutions, from environmental crises to social inequalities and online privacy concerns. The exciting part? We've actually got viable answers to tackle these challenges, and they're ready to be put into action. </p>
                </div>
            </div>
            <div className='under'>
                <img src={Mancester} className='versailes'/>
                <div className='down'>
                    <h2 className='uh2'>Tech</h2>
                    <p>Technology stands as a formidable ally, uniquely equipped to unravel multifaceted challenges. Whether through streamlined applications monitoring health metrics or sophisticated innovations harnessing renewable energies, its transformative prowess actively combats pressing global issues.</p>
                </div>
                <img src={Milan} className='ben'/>
            </div>
        </div>
     );
}
 
export default Home;