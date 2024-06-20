import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Weaver() {
    const [weavers, setWeavers] = useState([]);
    const [looms, setLooms] = useState([]);
    const [designs, setDesigns] = useState([]);
    const [filteredWeavers, setFilteredWeavers] = useState([]);
    const [filteredLooms, setFilteredLooms] = useState([]);
    const [filteredDesigns, setFilteredDesigns] = useState([]);
    const [loomFilter, setLoomFilter] = useState('');
    const [loomNumberFilter, setLoomNumberFilter] = useState('');
    const [formType, setFormType] = useState('weaver');
    const [selectedWeaver, setSelectedWeaver] = useState(null);
    const [selectedLoom, setSelectedLoom] = useState(null);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [loomTypes, setLoomTypes] = useState([]);
    const [jacquardTypes, setJacquardTypes] = useState([]);
    const [designNames, setDesignNames] = useState([]);

    const fetchData = async () => {
        try {
            const [weaverResponse, loomResponse, designResponse, loomTypeResponse, jacquardTypeResponse, designNameResponse] = await Promise.all([
                axios.get('http://localhost:3662/api/weavers'),
                axios.get('http://localhost:3662/api/looms'),
                axios.get('http://localhost:3662/api/designs'),
                axios.get('http://localhost:3662/api/loomTypes'),
                axios.get('http://localhost:3662/api/jacquardTypes'),
                axios.get('http://localhost:3662/api/designNames')
            ]);

            setWeavers(weaverResponse.data);
            setFilteredWeavers(weaverResponse.data);
            setLooms(loomResponse.data);
            setFilteredLooms(loomResponse.data);
            setDesigns(designResponse.data);
            setFilteredDesigns(designResponse.data);
            setLoomTypes(loomTypeResponse.data);
            setJacquardTypes(jacquardTypeResponse.data);
            setDesignNames(designNameResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilterSubmit = () => {
        const filteredLooms = looms.filter(loom =>
            (loomFilter ? loom.loomName === loomFilter : true) &&
            (loomNumberFilter ? loom.loomNumber === parseInt(loomNumberFilter) : true)
        );
        setFilteredLooms(filteredLooms);

        const filteredWeavers = weavers.filter(weaver =>
            (loomFilter ? weaver.loomName === loomFilter : true)
        );
        setFilteredWeavers(filteredWeavers);

        const filteredDesigns = designs.filter(design =>
            (loomFilter ? design.loomName === loomFilter : true) &&
            (loomNumberFilter ? design.loomNumber === parseInt(loomNumberFilter) : true)
        );
        setFilteredDesigns(filteredDesigns);
    };

    const weaverFormik = useFormik({
        initialValues: {
            date: '',
            weaverName: '',
            loomName: '',
            address: '',
            area: '',
            mobileNumber1: '',
            mobileNumber2: '',
            reference: '',
            description: '',
            idProof: null
        },
        validationSchema: Yup.object({
            date: Yup.date().required('Date is required'),
            weaverName: Yup.string().required('Weaver name is required'),
            loomName: Yup.string().required('Loom name is required'),
            address: Yup.string().required('Address is required'),
            area: Yup.string().required('Area is required'),
            mobileNumber1: Yup.string().matches(/^\d{10}$/, 'Must be exactly 10 digits').required('Mobile number 1 is required'),
            mobileNumber2: Yup.string().matches(/^\d{10}$/, 'Must be exactly 10 digits'),
            reference: Yup.string(),
            description: Yup.string(),
            idProof: Yup.mixed().required('ID Proof is required')
        }),
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                for (const [key, value] of Object.entries(values)) {
                    formData.append(key, value);
                }

                if (selectedWeaver) {
                    await axios.put(`http://localhost:3662/api/weavers/${selectedWeaver.id}`, formData);
                } else {
                    await axios.post('http://localhost:3662/api/weavers', formData);
                }

                setFormType('weaver');
                setSelectedWeaver(null);
                fetchData();
            } catch (error) {
                console.error('Error submitting weaver form:', error);
            }
        }
    });

    const loomFormik = useFormik({
        initialValues: {
            loomName: '',
            loomNumber: '',
            loomType: '',
            jacquardType: '',
            hooks: '',
            description: ''
        },
        validationSchema: Yup.object({
            loomName: Yup.string().required('Loom name is required'),
            loomNumber: Yup.number().required('Loom number is required'),
            loomType: Yup.string().required('Loom type is required'),
            jacquardType: Yup.string().required('Jacquard type is required'),
            hooks: Yup.number().required('Hooks is required'),
            description: Yup.string()
        }),
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                for (const [key, value] of Object.entries(values)) {
                    formData.append(key, value);
                }

                if (selectedLoom) {
                    await axios.put(`http://localhost:3662/api/looms/${selectedLoom.id}`, formData);
                } else {
                    await axios.post('http://localhost:3662/api/looms', formData);
                }

                setFormType('loom');
                setSelectedLoom(null);
                fetchData();
            } catch (error) {
                console.error('Error submitting loom form:', error);
            }
        }
    });

    const designFormik = useFormik({
        initialValues: {
            loomName: '',
            loomNumber: '',
            designName: '',
            designBy: '',
            planSheet: null,
            designUpload: null
        },
        validationSchema: Yup.object({
            loomName: Yup.string().required('Loom name is required'),
            loomNumber: Yup.number().required('Loom number is required'),
            designName: Yup.string().required('Design name is required'),
            designBy: Yup.string().required('Design by is required'),
            planSheet: Yup.mixed().required('Plan sheet is required'),
            designUpload: Yup.mixed().required('Design upload is required')
        }),
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                for (const [key, value] of Object.entries(values)) {
                    formData.append(key, value);
                }

                if (selectedDesign) {
                    await axios.put(`http://localhost:3662/api/designs/${selectedDesign.id}`, formData);
                } else {
                    await axios.post('http://localhost:3662/api/designs', formData);
                }

                setFormType('design');
                setSelectedDesign(null);
                fetchData();
            } catch (error) {
                console.error('Error submitting design form:', error);
            }
        }
    });

    const handleCancelUpdate = () => {
        setSelectedWeaver(null);
        setSelectedLoom(null);
        setSelectedDesign(null);
        weaverFormik.resetForm();
        loomFormik.resetForm();
        designFormik.resetForm();
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Shri Selvi Fabric</h1>
                <nav>
                    <button className="btn btn-secondary" onClick={() => setFormType('weaver')}>Add Weaver</button>
                    <button className="btn btn-secondary" onClick={() => setFormType('loom')}>Add Loom</button>
                    <button className="btn btn-secondary" onClick={() => setFormType('design')}>Add Design</button>
                </nav>
            </header>
            <div className="row">
                <div className="col-md-3">
                    {formType === 'weaver' && (
                        <div className="add-weaver">
                            <div className="weaver-form">
                                <h2>{selectedWeaver ? 'Update Weaver' : 'Add Weaver'}</h2>
                                <form onSubmit={weaverFormik.handleSubmit}>
                                    <div className="form-group">
                                        <label>Date:</label>
                                        <input type="date" className="form-control" name="date" value={weaverFormik.values.date} onChange={weaverFormik.handleChange} onBlur={weaverFormik.handleBlur} />
                                        {weaverFormik.touched.date && weaverFormik.errors.date ? <div className="error-message">{weaverFormik.errors.date}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Weaver Name:</label>
                                        <input type="text" className="form-control" name="weaverName" value={weaverFormik.values.weaverName} onChange={weaverFormik.handleChange} onBlur={weaverFormik.handleBlur} />
                                        {weaverFormik.touched.weaverName && weaverFormik.errors.weaverName ? <div className="error-message">{weaverFormik.errors.weaverName}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Loom Name:</label>
                                        <input type="text" className="form-control" name="loomName" value={weaverFormik.values.loomName} onChange={weaverFormik.handleChange} onBlur={weaverFormik.handleBlur} />
                                        {weaverFormik.touched.loomName && weaverFormik.errors.loomName ? <div className="error-message">{weaverFormik.errors.loomName}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Address:</label>
                                        <input type="text" className="form-control" name="address" value={weaverFormik.values.address} onChange={weaverFormik.handleChange} onBlur={weaverFormik.handleBlur} />
                                        {weaverFormik.touched.address && weaverFormik.errors.address ? <div className="error-message">{weaverFormik.errors.address}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Area:</label>
                                        <input type="text" className="form-control" name="area" value={weaverFormik.values.area} onChange={weaverFormik.handleChange} onBlur={weaverFormik.handleBlur} />
                                        {weaverFormik.touched.area && weaverFormik.errors.area ? <div className="error-message">{weaverFormik.errors.area}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number 1:</label>
                                        <input type="text" className="form-control" name="mobileNumber1" value={weaverFormik.values.mobileNumber1} onChange={weaverFormik.handleChange} onBlur={weaverFormik.handleBlur} />
                                        {weaverFormik.touched.mobileNumber1 && weaverFormik.errors.mobileNumber1 ? <div className="error-message">{weaverFormik.errors.mobileNumber1}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number 2:</label>
                                        <input type="text" className="form-control" name="mobileNumber2" value={weaverFormik.values.mobileNumber2} onChange={weaverFormik.handleChange} onBlur={weaverFormik.handleBlur} />
                                        {weaverFormik.touched.mobileNumber2 && weaverFormik.errors.mobileNumber2 ? <div className="error-message">{weaverFormik.errors.mobileNumber2}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Reference:</label>
                                        <input type="text" className="form-control" name="reference" value={weaverFormik.values.reference} onChange={weaverFormik.handleChange} onBlur={weaverFormik.handleBlur} />
                                        {weaverFormik.touched.reference && weaverFormik.errors.reference ? <div className="error-message">{weaverFormik.errors.reference}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Description:</label>
                                        <textarea className="form-control" name="description" value={weaverFormik.values.description} onChange={weaverFormik.handleChange} onBlur={weaverFormik.handleBlur} />
                                        {weaverFormik.touched.description && weaverFormik.errors.description ? <div className="error-message">{weaverFormik.errors.description}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>ID Proof:</label>
                                        <input type="file" className="form-control-file" name="idProof" onChange={(event) => weaverFormik.setFieldValue('idProof', event.target.files[0])} />
                                        {weaverFormik.touched.idProof && weaverFormik.errors.idProof ? <div className="error-message">{weaverFormik.errors.idProof}</div> : null}
                                    </div>
                                    <button type="submit" className="btn btn-secondary">{selectedWeaver ? 'Update' : 'Submit'}</button>
                                    {selectedWeaver && <button type="button" className="btn btn-secondary bg-danger btn-size mt-1" onClick={handleCancelUpdate}>Cancel</button>}
                                </form>
                            </div>
                        </div>
                    )}

                    {formType === 'loom' && (
                        <div className="add-loom">
                            <div className="loom-form">
                                <h2>{selectedLoom ? 'Update Loom' : 'Add Loom'}</h2>
                                <form onSubmit={loomFormik.handleSubmit}>
                                    <div className="form-group">
                                        <label>Loom Name:</label>
                                        <input type="text" className="form-control" name="loomName" value={loomFormik.values.loomName} onChange={loomFormik.handleChange} onBlur={loomFormik.handleBlur} />
                                        {loomFormik.touched.loomName && loomFormik.errors.loomName ? <div className="error-message">{loomFormik.errors.loomName}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Loom Number:</label>
                                        <input type="number" className="form-control" name="loomNumber" value={loomFormik.values.loomNumber} onChange={loomFormik.handleChange} onBlur={loomFormik.handleBlur} />
                                        {loomFormik.touched.loomNumber && loomFormik.errors.loomNumber ? <div className="error-message">{loomFormik.errors.loomNumber}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Loom Type:</label>
                                        <select className="form-control" name="loomType" value={loomFormik.values.loomType} onChange={loomFormik.handleChange} onBlur={loomFormik.handleBlur}>
                                            <option value="">Select Loom Type</option>
                                            {loomTypes.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                            <option value="other">Other</option>
                                        </select>
                                        {loomFormik.values.loomType === 'other' && (
                                            <input type="text" className="form-control mt-2" name="loomTypeOther" placeholder="Enter Loom Type" onChange={e => setLoomTypes([...loomTypes, e.target.value])} />
                                        )}
                                        {loomFormik.touched.loomType && loomFormik.errors.loomType ? <div className="error-message">{loomFormik.errors.loomType}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Jacquard Type:</label>
                                        <select className="form-control" name="jacquardType" value={loomFormik.values.jacquardType} onChange={loomFormik.handleChange} onBlur={loomFormik.handleBlur}>
                                            <option value="">Select Jacquard Type</option>
                                            {jacquardTypes.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                            <option value="other">Other</option>
                                        </select>
                                        {loomFormik.values.jacquardType === 'other' && (
                                            <input type="text" className="form-control mt-2" name="jacquardTypeOther" placeholder="Enter Jacquard Type" onChange={e => setJacquardTypes([...jacquardTypes, e.target.value])} />
                                        )}
                                        {loomFormik.touched.jacquardType && loomFormik.errors.jacquardType ? <div className="error-message">{loomFormik.errors.jacquardType}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Hooks:</label>
                                        <input type="number" className="form-control" name="hooks" value={loomFormik.values.hooks} onChange={loomFormik.handleChange} onBlur={loomFormik.handleBlur} />
                                        {loomFormik.touched.hooks && loomFormik.errors.hooks ? <div className="error-message">{loomFormik.errors.hooks}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Description:</label>
                                        <textarea className="form-control" name="description" value={loomFormik.values.description} onChange={loomFormik.handleChange} onBlur={loomFormik.handleBlur} />
                                        {loomFormik.touched.description && loomFormik.errors.description ? <div className="error-message">{loomFormik.errors.description}</div> : null}
                                    </div>
                                    <button type="submit" className="btn btn-secondary">{selectedLoom ? 'Update' : 'Submit'}</button>
                                    {selectedLoom && <button type="button" className="btn btn-secondary bg-danger btn-size mt-1" onClick={handleCancelUpdate}>Cancel</button>}
                                </form>
                            </div>
                        </div>
                    )}

                    {formType === 'design' && (
                        <div className="add-design">
                            <div className="design-form">
                                <h2>{selectedDesign ? 'Update Design' : 'Add Design'}</h2>
                                <form onSubmit={designFormik.handleSubmit}>
                                    <div className="form-group">
                                        <label>Loom Name:</label>
                                        <select className="form-control" name="loomName" value={designFormik.values.loomName} onChange={designFormik.handleChange} onBlur={designFormik.handleBlur}>
                                            <option value="">Select Loom Name</option>
                                            {looms.map((loom, index) => (
                                                <option key={index} value={loom.loomName}>{loom.loomName}</option>
                                            ))}
                                        </select>
                                        {designFormik.touched.loomName && designFormik.errors.loomName ? <div className="error-message">{designFormik.errors.loomName}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Loom Number:</label>
                                        <select className="form-control" name="loomNumber" value={designFormik.values.loomNumber} onChange={designFormik.handleChange} onBlur={designFormik.handleBlur}>
                                            <option value="">Select Loom Number</option>
                                            {looms.filter(loom => loom.loomName === designFormik.values.loomName).map((loom, index) => (
                                                <option key={index} value={loom.loomNumber}>{loom.loomNumber}</option>
                                            ))}
                                        </select>
                                        {designFormik.touched.loomNumber && designFormik.errors.loomNumber ? <div className="error-message">{designFormik.errors.loomNumber}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Design Name:</label>
                                        <select className="form-control" name="designName" value={designFormik.values.designName} onChange={designFormik.handleChange} onBlur={designFormik.handleBlur}>
                                            <option value="">Select Design Name</option>
                                            {designNames.map((name, index) => (
                                                <option key={index} value={name}>{name}</option>
                                            ))}
                                            <option value="other">Other</option>
                                        </select>
                                        {designFormik.values.designName === 'other' && (
                                            <input type="text" className="form-control mt-2" name="designNameOther" placeholder="Enter Design Name" onChange={e => setDesignNames([...designNames, e.target.value])} />
                                        )}
                                        {designFormik.touched.designName && designFormik.errors.designName ? <div className="error-message">{designFormik.errors.designName}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Design By:</label>
                                        <input type="text" className="form-control" name="designBy" value={designFormik.values.designBy} onChange={designFormik.handleChange} onBlur={designFormik.handleBlur} />
                                        {designFormik.touched.designBy && designFormik.errors.designBy ? <div className="error-message">{designFormik.errors.designBy}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Plan Sheet:</label>
                                        <input type="file" className="form-control-file" name="planSheet" onChange={(event) => designFormik.setFieldValue('planSheet', event.target.files[0])} />
                                        {designFormik.touched.planSheet && designFormik.errors.planSheet ? <div className="error-message">{designFormik.errors.planSheet}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Design Upload:</label>
                                        <input type="file" className="form-control-file" name="designUpload" onChange={(event) => designFormik.setFieldValue('designUpload', event.target.files[0])} />
                                        {designFormik.touched.designUpload && designFormik.errors.designUpload ? <div className="error-message">{designFormik.errors.designUpload}</div> : null}
                                    </div>
                                    <button type="submit" className="btn btn-secondary">{selectedDesign ? 'Update' : 'Submit'}</button>
                                    {selectedDesign && <button type="button" className="btn btn-secondary bg-danger btn-size mt-1" onClick={handleCancelUpdate}>Cancel</button>}
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-md-9">
                    <div className="filter-section">
                        <h3>Filter Data</h3>
                        <form onSubmit={e => { e.preventDefault(); handleFilterSubmit(); }}>
                            <div className="form-group">
                                <label>Loom Name:</label>
                                <select className="form-control" value={loomFilter} onChange={e => setLoomFilter(e.target.value)}>
                                    <option value="">All Loom Names</option>
                                    {looms.map((loom, index) => (
                                        <option key={index} value={loom.loomName}>{loom.loomName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Loom Number:</label>
                                <select className="form-control" value={loomNumberFilter} onChange={e => setLoomNumberFilter(e.target.value)}>
                                    <option value="">All Loom Numbers</option>
                                    {looms.length > 0 && [...Array(Math.max(...looms.map(loom => loom.loomNumber)) + 1).keys()].slice(1).map((num) => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-secondary">Filter</button>
                        </form>
                    </div>

                    <div className="table-section">
                        <h3>Recent Weavers</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Weaver Name</th>
                                    <th>Loom Name</th>
                                    <th>Address</th>
                                    <th>Area</th>
                                    <th>Mobile Number 1</th>
                                    <th>Mobile Number 2</th>
                                    <th>Reference</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWeavers.map((weaver) => (
                                    <tr key={weaver.id}>
                                        <td>{weaver.date}</td>
                                        <td>{weaver.weaverName}</td>
                                        <td>{weaver.loomName}</td>
                                        <td>{weaver.address}</td>
                                        <td>{weaver.area}</td>
                                        <td>{weaver.mobileNumber1}</td>
                                        <td>{weaver.mobileNumber2}</td>
                                        <td>{weaver.reference}</td>
                                        <td>{weaver.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-section">
                        <h3>Recent Designs</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Loom Name</th>
                                    <th>Loom Number</th>
                                    <th>Design Name</th>
                                    <th>Design By</th>
                                    <th>Plan Sheet</th>
                                    <th>Design Upload</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDesigns.map((design) => (
                                    <tr key={design.id}>
                                        <td>{design.loomName}</td>
                                        <td>{design.loomNumber}</td>
                                        <td>{design.designName}</td>
                                        <td>{design.designBy}</td>
                                        <td><a href={design.planSheet} target="_blank" rel="noopener noreferrer">View Plan Sheet</a></td>
                                        <td><a href={design.designUpload} target="_blank" rel="noopener noreferrer">View Design Upload</a></td>
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
