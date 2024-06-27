import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import your custom CSS file

function Home() {
    return (
        <div className='home_m'>
             <div className="companyName">
                <h2 className="companyHeading">Shri Selvi Fabric</h2>
                <div className="navigation-buttons">
                    <Link to="/home" className="btn btn-primary navigation-button">Home</Link>
                    <Link to="/transaction" className="btn btn-secondary navigation-button">Transaction</Link>
                    <Link to="/weaver" className="btn btn-secondary navigation-button">Weaver</Link>
                    <Link to="/sareedesign" className="btn btn-secondary navigation-button">Saree Design</Link>
                </div>
            </div>
            <div className='introduction'>
                <h2 className='text-center'>Welcome to Shri Selvi Fabric</h2>
            </div>
            <div className="data-container">
                <div className='text-center saree-design-preview'>
                    <img src="https://okcredit-blog-images-prod.storage.googleapis.com/2021/02/online-saree.jpg" alt="Featured Saree Design" className="featured-image" />
                </div>
            </div>
        </div>
    );
}

export default Home;
