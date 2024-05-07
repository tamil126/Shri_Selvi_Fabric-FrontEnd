import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [transactions, setTransactions] = useState([]);
    const [weavers, setWeavers] = useState([]);

    useEffect(() => {
        axios.get("/api/transactions")
            .then((res) => {
                setTransactions(res.data);
            })
            .catch((error) => {
                console.error("Error fetching transactions:", error);
            });

        axios.get("/api/weavers")
            .then((res) => {
                setWeavers(res.data);
            })
            .catch((error) => {
                console.error("Error fetching weavers:", error);
            });
    }, []);

    return (
        <div>
            
            <div className="navigation-buttons">
                <div className='companyName'>
                    <h2 className='companyHeading text-center'>Shri Selvi Fabric</h2>
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
                
                <div>
                    <h3>All Transactions</h3>
                    <ul>
                        {transactions.map((transaction, index) => (
                            <li key={index}>{/* data */}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>All Weavers</h3>
                    <ul>
                        {weavers.map((weaver, index) => (
                            <li key={index}>{/* data */}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;
