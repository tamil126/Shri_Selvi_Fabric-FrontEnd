import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Weaver() {
    const [formData, setFormData] = useState({
        date: '',
        weaverName: '',
        loomName: '',
        loomNumber: '',
        address: '',
        mobileNumber1: '',
        mobileNumber2: '',
        reference: '',
        document: null
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [weavers, setWeavers] = useState([]);

    useEffect(() => {
        fetchWeavers();
    }, []);

    const fetchWeavers = async () => {
        try {
            const response = await axios.get('/api/weavers');
            setWeavers(response.data);
        } catch (error) {
            console.error('Error fetching weavers:', error);
            setErrorMessage('Error fetching weavers. Please try again later.');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData({ ...formData, document: file });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.date || !formData.weaverName || !formData.loomName || !formData.loomNumber || !formData.address || !formData.mobileNumber1) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }
        try {
            const formDataForRequest = new FormData();
            formDataForRequest.append('date', formData.date);
            formDataForRequest.append('weaverName', formData.weaverName);
            formDataForRequest.append('loomName', formData.loomName);
            formDataForRequest.append('loomNumber', formData.loomNumber);
            formDataForRequest.append('address', formData.address);
            formDataForRequest.append('mobileNumber1', formData.mobileNumber1);
            formDataForRequest.append('mobileNumber2', formData.mobileNumber2);
            formDataForRequest.append('reference', formData.reference);
            formDataForRequest.append('document', formData.document);

            const response = await axios.post('/api/weavers', formDataForRequest, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
            setFormData({
                date: '',
                weaverName: '',
                loomName: '',
                loomNumber: '',
                address: '',
                mobileNumber1: '',
                mobileNumber2: '',
                reference: '',
                document: null
            });
            setErrorMessage('');
            fetchWeavers();
        } catch (error) {
            console.error('Error submitting weaver:', error);
            setErrorMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="weaver-page">
            <div className="row">
                <div className="col-md-12">
                    <div className="navigation-buttons">
                        <div className='companyName'>
                            <h2 className='companyHeading text-center'>Shri Selvi Fabric</h2>
                            <Link to="/home" className="btn btn-secondary navigation-button">Home</Link>
                            <Link to="/transaction" className="btn btn-secondary navigation-button">Transaction</Link>
                            <Link to="/weaver" className="btn btn-primary navigation-button">Weaver</Link>
                            <Link to="/sareedesign" className="btn btn-secondary navigation-button">Saree Design</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="add-weaver">
                        <div className="weaver-form">
                            <h2>Add Weaver</h2>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Date:</label>
                                    <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Weaver Name:</label>
                                    <input type="text" className="form-control" name="weaverName" value={formData.weaverName} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Loom Name:</label>
                                    <input type="text" className="form-control" name="loomName" value={formData.loomName} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Loom Number:</label>
                                    <input type="text" className="form-control" name="loomNumber" value={formData.loomNumber} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Address:</label>
                                    <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number 1:</label>
                                    <input type="text" className="form-control" name="mobileNumber1" value={formData.mobileNumber1} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number 2:</label>
                                    <input type="text" className="form-control" name="mobileNumber2" value={formData.mobileNumber2} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Reference:</label>
                                    <input type="text" className="form-control" name="reference" value={formData.reference} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Upload Document:</label>
                                    <input type="file" className="form-control-file" name="document" onChange={handleFileChange} />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="weavers-list">
                        <h2>All Weavers</h2>
                        <table className="weavers-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Date</th>
                                    <th>Weaver Name</th>
                                    <th>Loom Name</th>
                                    <th>Loom Number</th>
                                    <th>Address</th>
                                    <th>Mobile Number</th>
                                    <th>Reference</th>
                                    {/* <th>Document</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {weavers.map((weaver, index) => (
                                    <tr key={weaver.id}>
                                        <td>{index + 1}</td>
                                        <td>{new Date(weaver.date).toLocaleDateString()}</td>
                                        <td>{weaver.weaverName}</td>
                                        <td>{weaver.loomName}</td>
                                        <td>{weaver.loomNumber}</td>
                                        <td>{weaver.address}</td>
                                        <td>{weaver.mobileNumber1}</td>
                                        <td>{weaver.reference}</td>
                                        {/* <td>{weaver.document}</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Weaver;
