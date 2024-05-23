import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Weaver() {
    const [weavers, setWeavers] = useState([]);
    const [selectedWeaver, setSelectedWeaver] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchWeavers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3662/api/weavers');
            setWeavers(response.data);
        } catch (error) {
            console.error('Error fetching weavers:', error);
            setErrorMessage('Error fetching weavers. Please try again later.');
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            date: '',
            weaverName: '',
            loomName: '',
            loomNumber: '',
            address: '',
            mobileNumber1: '',
            mobileNumber2: '',
            reference: '',
            document: null
        },
        validationSchema: Yup.object({
            date: Yup.string().required('Date is required'),
            weaverName: Yup.string().required('Weaver Name is required'),
            loomName: Yup.string().required('Loom Name is required'),
            loomNumber: Yup.number().required('Loom Number is required').positive('Loom Number must be positive'),
            address: Yup.string().required('Address is required'),
            mobileNumber1: Yup.string().required('Mobile Number 1 is required'),
            document: Yup.mixed().nullable().test('fileSize', 'File is too large', value => !value || value.size <= 5242880)
        }),
        onSubmit: async (values) => {
            try {
                const formDataForRequest = new FormData();
                formDataForRequest.append('date', values.date);
                formDataForRequest.append('weaverName', values.weaverName);
                formDataForRequest.append('loomName', values.loomName);
                formDataForRequest.append('loomNumber', values.loomNumber);
                formDataForRequest.append('address', values.address);
                formDataForRequest.append('mobileNumber1', values.mobileNumber1);
                formDataForRequest.append('mobileNumber2', values.mobileNumber2);
                formDataForRequest.append('reference', values.reference);
                formDataForRequest.append('document', values.document);

                if (selectedWeaver) {
                    const response = await axios.put(`http://localhost:3662/api/weavers/${selectedWeaver.id}`, formDataForRequest, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log(response.data);
                    setSelectedWeaver(null);
                } else {
                    const response = await axios.post('http://localhost:3662/api/weavers', formDataForRequest, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log(response.data);
                }

                formik.resetForm();
                fetchWeavers();
            } catch (error) {
                console.error('Error submitting weaver:', error);
                setErrorMessage("An error occurred. Please try again later.");
            }
        }
    });

    useEffect(() => {
        fetchWeavers();
    }, [fetchWeavers]);

    const handleUpdateClick = (weaver) => {
        setSelectedWeaver(weaver);
        formik.setValues({
            date: weaver.date,
            weaverName: weaver.weaverName,
            loomName: weaver.loomName,
            loomNumber: weaver.loomNumber,
            address: weaver.address,
            mobileNumber1: weaver.mobileNumber1,
            mobileNumber2: weaver.mobileNumber2,
            reference: weaver.reference,
            document: null
        });
    };

    const handleCancelUpdate = () => {
        setSelectedWeaver(null);
        formik.resetForm();
    };

    return (
        <div className="weaver-page">
            <div className="navigation-buttons">
                <div className='companyName'>
                    <h2 className='companyHeading text-center'>Shri Selvi Fabric</h2>
                    <Link to="/home" className="btn btn-secondary navigation-button">Home</Link>
                    <Link to="/transaction" className="btn btn-secondary navigation-button">Transaction</Link>
                    <Link to="/weaver" className="btn btn-primary navigation-button">Weaver</Link>
                    <Link to="/sareedesign" className="btn btn-secondary navigation-button">Saree Design</Link>
                </div>
            </div>
            <div className="row">
                <div className="col-md-3 my-4">
                    <div className="add-weaver">
                        <div className="weaver-form">
                            <h2>{selectedWeaver ? 'Update Weaver' : 'Add Weaver'}</h2>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            {formik.errors.general && <div className="error-message">{formik.errors.general}</div>}
                            <form onSubmit={formik.handleSubmit}>
                                <div className="form-group">
                                    <label>Date:</label>
                                    <input type="date" className="form-control" name="date" value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.date && formik.errors.date ? <div className="error-message">{formik.errors.date}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Weaver Name:</label>
                                    <input type="text" className="form-control" name="weaverName" value={formik.values.weaverName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.weaverName && formik.errors.weaverName ? <div className="error-message">{formik.errors.weaverName}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Loom Name:</label>
                                    <input type="text" className="form-control" name="loomName" value={formik.values.loomName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.loomName && formik.errors.loomName ? <div className="error-message">{formik.errors.loomName}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Loom Number:</label>
                                    <input type="number" className="form-control" name="loomNumber" value={formik.values.loomNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.loomNumber && formik.errors.loomNumber ? <div className="error-message">{formik.errors.loomNumber}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Address:</label>
                                    <input type="text" className="form-control" name="address" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.address && formik.errors.address ? <div className="error-message">{formik.errors.address}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number 1:</label>
                                    <input type="text" className="form-control" name="mobileNumber1" value={formik.values.mobileNumber1} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.mobileNumber1 && formik.errors.mobileNumber1 ? <div className="error-message">{formik.errors.mobileNumber1}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number 2:</label>
                                    <input type="text" className="form-control" name="mobileNumber2" value={formik.values.mobileNumber2} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                </div>
                                <div className="form-group">
                                    <label>Reference:</label>
                                    <input type="text" className="form-control" name="reference" value={formik.values.reference} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                </div>
                                <div className="form-group">
                                    <label>Upload Document:</label>
                                    <input type="file" className="form-control-file" name="document" onChange={(event) => formik.setFieldValue('document', event.target.files[0])} />
                                    {formik.touched.document && formik.errors.document ? <div className="error-message">{formik.errors.document}</div> : null}
                                </div>
                                <button type="submit" className="btn btn-secondary">{selectedWeaver ? 'Update' : 'Submit'}</button>
                                {selectedWeaver && <button type="button" className="btn btn-secondary bg-danger btn-size mt-1" onClick={handleCancelUpdate}>Cancel</button>}
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="weavers-list">
                        <h2 className='text-center'>All Weavers</h2>
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
                                    <th>Action</th>
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
                                        <td><button className="btn btn-primary" onClick={() => handleUpdateClick(weaver)}>Update</button></td>
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
