import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function SareeDesign() {
    const [weaverOptions, setWeaverOptions] = useState([]);
    const [loomOptions, setLoomOptions] = useState([]);
    const [sareeDesigns, setSareeDesigns] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchWeaverOptions();
        fetchSareeDesigns();
    }, []);

    const fetchWeaverOptions = async () => {
        try {
            const response = await axios.get('/api/weavers');
            setWeaverOptions(response.data);
        } catch (error) {
            console.error('Error fetching weaver options:', error);
            setErrorMessage('Error fetching weaver options. Please try again later.');
        }
    };

    const fetchSareeDesigns = async () => {
        try {
            const response = await axios.get('/api/saree-designs');
            setSareeDesigns(response.data);
        } catch (error) {
            console.error('Error fetching saree designs:', error);
            setErrorMessage('Error fetching saree designs. Please try again later.');
        }
    };

    const formik = useFormik({
        initialValues: {
            weaver: '',
            loom: '',
            image: null,
        },
        validationSchema: Yup.object({
            weaver: Yup.string().required('Weaver is required'),
            loom: Yup.string().required('Loom number is required'),
            image: Yup.mixed().required('Image is required')
                .test('fileSize', 'File is too large', value => !value || value.size <= 5242880)
                .test('fileType', 'Unsupported file format', value => !value || ['image/jpeg', 'image/png'].includes(value.type)),
        }),
        onSubmit: async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append('weaverId', values.weaver);
            formData.append('loomNumber', values.loom);
            formData.append('image', values.image);

            try {
                await axios.post('/api/saree-designs', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                resetForm();
                fetchSareeDesigns();
                setErrorMessage('');
            } catch (error) {
                console.error('Error submitting saree design:', error);
                setErrorMessage("An error occurred while submitting saree design. Please try again later.");
            }
        },
    });

    const handleWeaverChange = async (event) => {
        const selectedWeaver = event.target.value;
        formik.setFieldValue('weaver', selectedWeaver);
        formik.setFieldValue('loom', ''); // Reset selected loom when weaver changes

        try {
            const response = await axios.get(`/api/loom-numbers/${selectedWeaver}`);
            setLoomOptions(response.data);
        } catch (error) {
            console.error('Error fetching loom numbers:', error);
            setErrorMessage('Error fetching loom numbers. Please try again later.');
        }
    };

    return (
        <div className="row w-100">
            <div className="col-md-12">
                <div className="navigation-buttons">
                    <div className='companyName'>
                        <h2 className='companyHeading text-center'>Shri Selvi Fabric</h2>
                        <Link to="/home" className="btn btn-secondary navigation-button">Home</Link>
                        <Link to="/transaction" className="btn btn-secondary navigation-button">Transaction</Link>
                        <Link to="/weaver" className="btn btn-secondary navigation-button">Weaver</Link>
                        <Link to="/sareedesign" className="btn btn-primary navigation-button">Saree Design</Link>
                    </div>
                </div>
            </div>
            <div className="col-md-4 my-5 add-saree">
                <div className="saree-design-page">
                    <h2 className='text-center'>Add Saree Design</h2>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label>Select Weaver:</label>
                            <select
                                className={`form-control ${formik.touched.weaver && formik.errors.weaver ? 'is-invalid' : ''}`}
                                value={formik.values.weaver}
                                onChange={handleWeaverChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select Weaver</option>
                                {weaverOptions.map(weaver => (
                                    <option key={weaver.id} value={weaver.id}>{weaver.weaverName}</option>
                                ))}
                            </select>
                            {formik.touched.weaver && formik.errors.weaver ? <div className="invalid-feedback">{formik.errors.weaver}</div> : null}
                        </div>
                        <div className="form-group">
                            <label>Select Loom Number:</label>
                            <select
                                className={`form-control ${formik.touched.loom && formik.errors.loom ? 'is-invalid' : ''}`}
                                value={formik.values.loom}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="loom"
                            >
                                <option value="">Select Loom Number</option>
                                {loomOptions.map((loom, index) => (
                                    <option key={index} value={loom}>{loom}</option>
                                ))}
                            </select>
                            {formik.touched.loom && formik.errors.loom ? <div className="invalid-feedback">{formik.errors.loom}</div> : null}
                        </div>
                        <div className="form-group">
                            <label>Upload Image:</label>
                            <input
                                type="file"
                                className={`form-control-file ${formik.touched.image && formik.errors.image ? 'is-invalid' : ''}`}
                                onChange={(event) => formik.setFieldValue('image', event.target.files[0])}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.image && formik.errors.image ? <div className="invalid-feedback">{formik.errors.image}</div> : null}
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
            <div className="saree-design-preview col-md-8 my-3">
                <h2 className='text-center mt-5 pt-5'>Saree Design Preview</h2>
                <table className='saree-table'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Image</th>
                            <th>Weaver Name</th>
                            <th>Loom Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sareeDesigns.map((design, index) => (
                            <tr key={design.id}>
                                <td>{index + 1}</td>
                                <td><img src={`/${design.image}`} alt={`Design ${index + 1}`} /></td>
                                <td>{design.weaverName}</td>
                                <td>{design.loomNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SareeDesign;
