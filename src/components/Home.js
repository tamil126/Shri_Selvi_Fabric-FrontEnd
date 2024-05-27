import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [weavers, setWeavers] = useState([]);
    const [sareeDesigns, setSareeDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const weaversResponse = await axios.get("http://127.0.0.1:3662/api/weavers");
                setWeavers(weaversResponse.data);

                const sareeDesignsResponse = await axios.get("http://127.0.0.1:3662/api/saree-designs");
                setSareeDesigns(sareeDesignsResponse.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="">
            <div className="row">
                <div className="col-md-12">
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
                    <div className="data-container row">
                        <div className='col-md-6'>
                            <h3 className='text-center mt-3'>All Weavers</h3>
                            <table className='weavers-table weaver-tables'>
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Weaver Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weavers.map((weaver, index) => (
                                        <tr key={weaver.id}>
                                            <td>{index + 1}</td>
                                            <td>{weaver.weaverName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='col-md-6 saree-design-preview'>
                            <h3 className='text-center'>All Saree Designs</h3>
                            <div className="saree-design-grid">
                                {sareeDesigns.map((design, index) => (
                                    <div key={design.id} className="saree-design-item">
                                        <img src={`/${design.image}`} alt={`Design ${index + 1}`} width={200} height={200} />
                                        <h4>{design.weaverName}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
