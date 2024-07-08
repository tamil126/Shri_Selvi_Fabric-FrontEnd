import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config/constant';
import './Weaver.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

library.add(faDownload);

const Weaver = () => {
    const [weavers, setWeavers] = useState([]);
    const [looms, setLooms] = useState([]);
    const [designs, setDesigns] = useState([]);
    const [loomTypes, setLoomTypes] = useState([]);
    const [jacquardTypes, setJacquardTypes] = useState([]);
    const [designNames, setDesignNames] = useState([]);
    const [loomNumbers, setLoomNumbers] = useState([]);
    const [filteredWeavers, setFilteredWeavers] = useState([]);
    const [filteredLooms, setFilteredLooms] = useState([]);
    const [filteredDesigns, setFilteredDesigns] = useState([]);
    const [formType, setFormType] = useState('weaver');
    const [formData, setFormData] = useState({
        weaverName: '',
        loomName: '',
        address: '',
        area: '',
        mobileNumber1: '',
        mobileNumber2: '',
        reference: '',
        description: '',
        idProof: null,
        loomNumber: '',
        loomType: '',
        jacquardType: '',
        hooks: '',
        planSheet: null,
        designName: '',
        designBy: '',
        designUpload: null,
        newLoomType: '',
        newJacquardType: '',
        newDesignName: ''
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loomFilter, setLoomFilter] = useState('');
    const [loomNumberFilter, setLoomNumberFilter] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let timer;
        if (error) {
            timer = setTimeout(() => {
                setError('');
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [error]);

    const fetchData = async () => {
        try {
            const weaverResponse = await axios.get(`${BASE_URL}/weavers`);
            const loomResponse = await axios.get(`${BASE_URL}/looms`);
            const designResponse = await axios.get(`${BASE_URL}/designs`);
            const loomTypesResponse = await axios.get(`${BASE_URL}/loomTypes`);
            const jacquardTypesResponse = await axios.get(`${BASE_URL}/jacquardTypes`);
            const designNamesResponse = await axios.get(`${BASE_URL}/designNames`);

            setWeavers(weaverResponse.data);
            setLooms(loomResponse.data);
            setDesigns(designResponse.data);
            setLoomTypes(loomTypesResponse.data);
            setJacquardTypes(jacquardTypesResponse.data);
            setDesignNames(designNamesResponse.data);
            setFilteredWeavers(weaverResponse.data);
            setFilteredLooms(loomResponse.data);
            setFilteredDesigns(designResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'idProof') {
            setFormData(prevFormData => ({
                ...prevFormData,
                idProof: files[0]
            }));
        } else {
            setFormData({
                ...formData,
                [name]: files ? files[0] : value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            if (isUpdating) {
                if (formType === 'weaver') {
                    await handleUpdateWeaverForm();
                } else if (formType === 'loom') {
                    await handleUpdateLoomForm();
                } else if (formType === 'design') {
                    await handleUpdateDesignForm();
                }
            } else {
                if (formType === 'weaver') {
                    await handleSubmitWeaverForm();
                } else if (formType === 'loom') {
                    await handleSubmitLoomForm();
                } else if (formType === 'design') {
                    await handleSubmitDesignForm();
                }
            }
            fetchData();
            resetForm();
            setError('');
        } catch (error) {
            setError(error.response.data.error);
        } finally {
            setSubmitting(false);
            setIsUpdating(false);
            setUpdateId(null);
        }
    };

    const handleSubmitWeaverForm = async () => {
        const formDataObj = new FormData();

        Object.keys(formData).forEach(key => {
            formDataObj.append(key, formData[key]);
        });
        console.log(formDataObj);
        await axios.post(`${BASE_URL}/weavers`, formDataObj);
    };

    const handleSubmitLoomForm = async () => {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
            formDataObj.append(key, formData[key]);
        });
        await axios.post(`${BASE_URL}/looms`, formDataObj);
    };

    const handleSubmitDesignForm = async () => {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
            formDataObj.append(key, formData[key]);
        });
        await axios.post(`${BASE_URL}/designs`, formDataObj);
    };

    const handleUpdateWeaverForm = async () => {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
            formDataObj.append(key, formData[key]);
        });
        await axios.put(`${BASE_URL}/weavers/${updateId}`, formDataObj);
    };

    const handleUpdateLoomForm = async () => {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
            formDataObj.append(key, formData[key]);
        });
        await axios.put(`${BASE_URL}/looms/${updateId}`, formDataObj);
    };

    const handleUpdateDesignForm = async () => {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
            formDataObj.append(key, formData[key]);
        });
        await axios.put(`${BASE_URL}/designs/${updateId}`, formDataObj);
    };

    const handleLoomNameChange = (e) => {
        const loomName = e.target.value;
        setFormData({
            ...formData,
            loomName,
            loomNumber: looms.find((l) => l.loomName === loomName)?.loomNumber || '',
        });

        const loom = looms.find((l) => l.loomName === loomName);
        if (loom) {
            setLoomNumbers(Array.from({ length: loom.loomNumber }, (_, i) => i + 1));
        } else {
            setLoomNumbers([]);
        }
    };

    const handleUpdateClick = (item, type) => {
        setFormType(type);
        setIsUpdating(true);
        setUpdateId(item.id);
        handleLoomNameChange({ target: { value: item.loomName } });

        const planSheet = item.planSheet ? item.planSheet : null;
        const designUpload = item.designUpload ? item.designUpload : null;

        setFormData({
            ...item,
            idProof: item.idProof || null,
            planSheet,
            designUpload
        });
    };

    const applyFilters = () => {
        let filteredWeavers = weavers;
        let filteredLooms = looms;
        let filteredDesigns = designs;
        if (loomFilter) {
            filteredWeavers = filteredWeavers.filter(weaver => weaver.loomName === loomFilter);
            filteredLooms = filteredLooms.filter(loom => loom.loomName === loomFilter);
            filteredDesigns = filteredDesigns.filter(design => design.loomName === loomFilter);
        }
        if (loomNumberFilter) {
            filteredDesigns = filteredDesigns.filter(design => design.loomNumber === parseInt(loomNumberFilter));
        }
        setFilteredWeavers(filteredWeavers);
        setFilteredLooms(filteredLooms);
        setFilteredDesigns(filteredDesigns);
    };

    const resetForm = () => {
        setFormData({
            weaverName: '',
            loomName: '',
            address: '',
            area: '',
            mobileNumber1: '',
            mobileNumber2: '',
            reference: '',
            description: '',
            idProof: null,
            loomNumber: '',
            loomType: '',
            jacquardType: '',
            hooks: '',
            planSheet: null,
            designName: '',
            designBy: '',
            designUpload: null,
            newLoomType: '',
            newJacquardType: '',
            newDesignName: ''
        });
        document.getElementById('idProof').value = null;
        document.getElementById('planSheet').value = null;
        document.getElementById('designUpload').value = null;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const form = e.target.form;
            const index = Array.prototype.indexOf.call(form, e.target);
            const nextElement = form.elements[index + 1];
            if (nextElement) {
                nextElement.focus();
            }
            e.preventDefault();
        }
    };

    // const downloadFile = (url, filename) => {
    //     axios.get(url, { responseType: 'blob' })
    //         .then((response) => {
    //             const url = window.URL.createObjectURL(new Blob([response.data]));
    //             const link = document.createElement('a');
    //             link.href = url;
    //             link.setAttribute('download', filename);
    //             document.body.appendChild(link);
    //             link.click();
    //         })
    //         .catch((error) => console.error("Error downloading file:", error));
    // };

    return (
        <div className="con">
            <div className="companyName">
                <h2 className="companyHeading">Shri Selvi Fabric</h2>
                <div className="navigation-buttons">
                    <Link to="/home" className="btn btn-secondary navigation-button">Home</Link>
                    <Link to="/transaction" className="btn btn-secondary navigation-button">Transaction</Link>
                    <Link to="/weaver" className="btn btn-primary navigation-button">Weaver</Link>
                    <Link to="/sareedesign" className="btn btn-secondary navigation-button">Saree Design</Link>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-3">
                    <button className="btn btn-secondary" onClick={() => { setFormType('weaver'); resetForm(); setIsUpdating(false); setUpdateId(null); }}>Add Weaver</button>
                    <button className="btn btn-secondary" onClick={() => { setFormType('loom'); resetForm(); setIsUpdating(false); setUpdateId(null); }}>Add Loom</button>
                    <button className="btn btn-secondary" onClick={() => { setFormType('design'); resetForm(); setIsUpdating(false); setUpdateId(null); }}>Add Design</button>

                    <div className="con">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit} enctype="multipart/form-data">
                            <h2>{isUpdating ? `Update ${formType.charAt(0).toUpperCase() + formType.slice(1)}` : `Add ${formType.charAt(0).toUpperCase() + formType.slice(1)}`}</h2>
                            {formType === 'weaver' && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="weaverName">Weaver Name</label>
                                        <input type="text" className="form-control" id="weaverName" name="weaverName" value={formData.weaverName} onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="loomName">Loom Name</label>
                                        <input type="text" className="form-control" id="loomName" name="loomName" value={formData.loomName} onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address">Address</label>
                                        <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="area">Area</label>
                                        <input type="text" className="form-control" id="area" name="area" value={formData.area} onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="mobileNumber1">Mobile Number 1</label>
                                        <input type="text" className="form-control" id="mobileNumber1" name="mobileNumber1" value={formData.mobileNumber1} onChange={handleInputChange} onKeyDown={handleKeyPress} required pattern="\d{10}" title="Please enter a valid 10-digit mobile number" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="mobileNumber2">Mobile Number 2</label>
                                        <input type="text" className="form-control" id="mobileNumber2" name="mobileNumber2" value={formData.mobileNumber2} onChange={handleInputChange} onKeyDown={handleKeyPress} pattern="\d{10}" title="Please enter a valid 10-digit mobile number" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reference">Reference</label>
                                        <input type="text" className="form-control" id="reference" name="reference" value={formData.reference} onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleInputChange} onKeyDown={handleKeyPress} required></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="idProof">ID Proof</label>
                                        <input type="file" className="form-control" id="idProof" name="idProof" onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                    </div>
                                </>
                            )}
                            {formType === 'loom' && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="loomName">Loom Name</label>
                                        <select className="form-control" id="loomName" name="loomName" value={formData.loomName} onChange={handleLoomNameChange} onKeyDown={handleKeyPress} required>
                                            <option value="">Select Loom Name</option>
                                            {weavers.map((weaver) => (
                                                <option key={weaver.id} value={weaver.loomName}>{weaver.loomName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="loomNumber">Loom Number</label>
                                        <input type="number" className="form-control" id="loomNumber" name="loomNumber" placeholder="Enter new loom number" onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="loomType">Loom Type</label>
                                        <select className="form-control" id="loomType" name="loomType" value={formData.loomType} onChange={handleInputChange} onKeyDown={handleKeyPress} required>
                                            <option value="">Select Loom Type</option>
                                            {loomTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                            <option value="other">Other</option>
                                        </select>
                                        {formData.loomType === 'other' && (
                                            <input type="text" className="form-control mt-2" id="newLoomType" name="newLoomType" placeholder="Enter new loom type" onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="jacquardType">Jacquard Type</label>
                                        <select className="form-control" id="jacquardType" name="jacquardType" value={formData.jacquardType} onChange={handleInputChange} onKeyDown={handleKeyPress} required>
                                            <option value="">Select Jacquard Type</option>
                                            {jacquardTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                            <option value="other">Other</option>
                                        </select>
                                        {formData.jacquardType === 'other' && (
                                            <input type="text" className="form-control mt-2" id="newJacquardType" name="newJacquardType" placeholder="Enter new jacquard type" onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="hooks">Hooks</label>
                                        <input type="number" className="form-control" id="hooks" name="hooks" value={formData.hooks} onChange={handleInputChange} onKeyDown={handleKeyPress} required min="0" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleInputChange} onKeyDown={handleKeyPress} required></textarea>
                                    </div>
                                </>
                            )}
                            {formType === 'design' && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="loomName">Loom Name</label>
                                        <select className="form-control" id="loomName" name="loomName" value={formData.loomName} onChange={handleLoomNameChange} onKeyDown={handleKeyPress} required>
                                            <option value="">Select Loom Name</option>
                                            {looms.map((loom) => (
                                                <option key={loom.id} value={loom.loomName}>{loom.loomName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="loomNumber">Loom Number</label>
                                        <select className="form-control" id="loomNumber" name="loomNumber" value={formData.loomNumber} onChange={handleInputChange} onKeyDown={handleKeyPress} required>
                                            <option value="">Select Loom Number</option>
                                            {loomNumbers.map((number) => (
                                                <option key={number} value={number}>{number}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="designName">Design Name</label>
                                        <select className="form-control" id="designName" name="designName" value={formData.designName} onChange={handleInputChange} onKeyDown={handleKeyPress} required>
                                            <option value="">Select Design Name</option>
                                            {designNames.map((name) => (
                                                <option key={name} value={name}>{name}</option>
                                            ))}
                                            <option value="other">Other</option>
                                        </select>
                                        {formData.designName === 'other' && (
                                            <input type="text" className="form-control mt-2" id="newDesignName" name="newDesignName" placeholder="Enter new design name" onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="designBy">Design By</label>
                                        <input type="text" className="form-control" id="designBy" name="designBy" value={formData.designBy} onChange={handleInputChange} onKeyDown={handleKeyPress} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="planSheet">Plan Sheet</label>
                                        <input type="file" className="form-control" id="planSheet" name="planSheet" onChange={handleInputChange} onKeyDown={handleKeyPress} required={!formData.planSheet} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="designUpload">Design Upload</label>
                                        <input type="file" className="form-control" id="designUpload" name="designUpload" onChange={handleInputChange} onKeyDown={handleKeyPress} required={!formData.designUpload} />
                                    </div>
                                </>
                            )}
                            <button type="submit" className="btn btn-primary mt-3" disabled={submitting} onKeyDown={handleKeyPress}>{isUpdating ? 'Update' : 'Add'} {formType.charAt(0).toUpperCase() + formType.slice(1)}</button>
                        </form>
                    </div>
                </div>
                <div className="col-lg-9">
                    <div className="form-group">
                        <label htmlFor="loomFilter">Filter by Loom Name</label>
                        <select className="form-control" id="loomFilter" value={loomFilter} onChange={(e) => {
                            const loomName = e.target.value;
                            setLoomFilter(loomName);
                            const loom = looms.find((l) => l.loomName === loomName);
                            if (loom) {
                                setLoomNumbers(Array.from({ length: loom.loomNumber }, (_, i) => i + 1));
                            } else {
                                setLoomNumbers([]);
                            }
                        }}>
                            <option value="">All</option>
                            {looms.map((loom) => (
                                <option key={loom.id} value={loom.loomName}>{loom.loomName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="loomNumberFilter">Filter by Loom Number</label>
                        <select className="form-control" id="loomNumberFilter" value={loomNumberFilter} onChange={(e) => setLoomNumberFilter(e.target.value)}>
                            <option value="">All</option>
                            {loomNumbers.map((number) => (
                                <option key={number} value={number}>{number}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={applyFilters}>Apply Filters</button>
                    <h2>Recent Weavers</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Weaver Name</th>
                                <th>Loom Name</th>
                                <th>Address</th>
                                <th>Area</th>
                                <th>Mobile Number 1</th>
                                <th>Mobile Number 2</th>
                                <th>Reference</th>
                                <th>Description</th>
                                <th>ID Proof</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWeavers.map((weaver) => (
                                <tr key={weaver.id}>
                                    <td>{weaver.weaverName}</td>
                                    <td>{weaver.loomName}</td>
                                    <td>{weaver.address}</td>
                                    <td>{weaver.area}</td>
                                    <td>{weaver.mobileNumber1}</td>
                                    <td>{weaver.mobileNumber2 || "No Number"}</td>
                                    <td>{weaver.reference}</td>
                                    <td>{weaver.description}</td>
                                    <td><a href={weaver.idProof} target="_blank" rel="noopener noreferrer" className="download-link">
                                    <FontAwesomeIcon icon={faDownload} />Download</a></td>
                                    <td><button className="btn btn-secondary" onClick={() => handleUpdateClick(weaver, 'weaver')}>Update</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h2>Recent Looms</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Loom Name</th>
                                <th>Loom Number</th>
                                <th>Loom Type</th>
                                <th>Jacquard Type</th>
                                <th>Hooks</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLooms.map((loom) => (
                                <tr key={loom.id}>
                                    <td>{loom.loomName}</td>
                                    <td>{loom.loomNumber}</td>
                                    <td>{loom.loomType}</td>
                                    <td>{loom.jacquardType}</td>
                                    <td>{loom.hooks}</td>
                                    <td>{loom.description}</td>
                                    <td><button className="btn btn-secondary" onClick={() => handleUpdateClick(loom, 'loom')}>Update</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h2>Recent Designs</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Loom Name</th>
                                <th>Loom Number</th>
                                <th>Design Name</th>
                                <th>Design By</th>
                                <th>Plan Sheet</th>
                                <th>Design Upload</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDesigns.map((design) => (
                                <tr key={design.id}>
                                    <td>{design.loomName}</td>
                                    <td>{design.loomNumber}</td>
                                    <td>{design.designName}</td>
                                    <td>{design.designBy}</td>
                                    <td>{design.planSheet ? <img src={design.planSheet} alt="Plan Sheet" className="img-thumbnail" /> : "No Plan Sheet"}</td>
                                    <td>{design.designUpload ? <img src={design.designUpload} alt="Design Upload" className="img-thumbnail" /> : "No Design Upload"}</td>
                                    <td><button className="btn btn-secondary" onClick={() => handleUpdateClick(design, 'design')}>Update</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Weaver;
