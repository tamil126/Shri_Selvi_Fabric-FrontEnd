import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL } from '../config/constant';
import './SareeDesign.css';

function SareeDesign() {
  const [loomNames, setLoomNames] = useState([]);
  const [loomOptions, setLoomOptions] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [viewMode, setViewMode] = useState(false);

  const mainImageRef = useRef(null);
  const munthiImageRef = useRef(null);
  const blouseImageRef = useRef(null);
  const openImageRef = useRef(null);
  const colorSetImageRef = useRef(null);

  useEffect(() => {
    fetchLoomNames();
    fetchRecentDesigns();
  }, []);

  const fetchLoomNames = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/looms`);
      setLoomNames(response.data);
    } catch (error) {
      console.error('Error fetching loom names:', error);
      setErrorMessage('Error fetching loom names. Please try again later.');
    }
  };

  const fetchRecentDesigns = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/recent-saree-designs`);
      setFilteredDesigns(response.data);
    } catch (error) {
      console.error('Error fetching recent designs:', error);
      setErrorMessage('Error fetching recent designs. Please try again later.');
    }
  };

  const fetchLoomNumbers = async (loomName) => {
    try {
      const response = await axios.get(`${BASE_URL}/loom-numbers/${loomName}`);
      const maxLoomNumber = response.data[0].loomNumber;
      const loomNumbers = Array.from({ length: maxLoomNumber }, (_, i) => i + 1);
      setLoomOptions(loomNumbers);
    } catch (error) {
      console.error('Error fetching loom numbers:', error);
      setErrorMessage('Error fetching loom numbers. Please try again later.');
    }
  };

  const fetchFilteredDesigns = async (loomNumber) => {
    try {
      const response = await axios.get(`${BASE_URL}/saree-designs?loomNumber=${loomNumber}`);
      setFilteredDesigns(response.data);
    } catch (error) {
      console.error('Error fetching filtered designs:', error);
      setErrorMessage('Error fetching filtered designs. Please try again later.');
    }
  };

  const formik = useFormik({
    initialValues: {
      loomName: '',
      loomNumber: '',
      mainImage: null,
      munthiImage: null,
      blouseImage: null,
      openImage: null,
      colorSetImage: null,
    },
    validationSchema: Yup.object({
      loomName: Yup.string().required('Loom name is required'),
      loomNumber: Yup.string().required('Loom number is required'),
      mainImage: Yup.mixed().required('Main image is required')
        .test('fileSize', 'File is too large', value => !value || value.size <= 5242880)
        .test('fileType', 'Unsupported file format', value => !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)),
      munthiImage: Yup.mixed().test('fileSize', 'File is too large', value => !value || value.size <= 5242880)
        .test('fileType', 'Unsupported file format', value => !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)),
      blouseImage: Yup.mixed().test('fileSize', 'File is too large', value => !value || value.size <= 5242880)
        .test('fileType', 'Unsupported file format', value => !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)),
      openImage: Yup.mixed().test('fileSize', 'File is too large', value => !value || value.size <= 5242880)
        .test('fileType', 'Unsupported file format', value => !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)),
      colorSetImage: Yup.mixed().test('fileSize', 'File is too large', value => !value || value.size <= 5242880)
        .test('fileType', 'Unsupported file format', value => !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('loomName', values.loomName);
      formData.append('loomNumber', values.loomNumber);
      formData.append('mainImage', values.mainImage);
      formData.append('munthiImage', values.munthiImage);
      formData.append('blouseImage', values.blouseImage);
      formData.append('openImage', values.openImage);
      formData.append('colorSetImage', values.colorSetImage);

      try {
        await axios.post(`${BASE_URL}/saree-designs`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        resetForm();
        mainImageRef.current.value = "";
        munthiImageRef.current.value = "";
        blouseImageRef.current.value = "";
        openImageRef.current.value = "";
        colorSetImageRef.current.value = "";
        setViewMode(false);
        fetchRecentDesigns();
        setErrorMessage('');
      } catch (error) {
        console.error('Error submitting saree design:', error);
        setErrorMessage("An error occurred while submitting saree design. Please try again later.");
      }
    },
  });

  const handleLoomNameChange = async (event) => {
    const selectedLoomName = event.target.value;
    formik.setFieldValue('loomName', selectedLoomName);
    formik.setFieldValue('loomNumber', '');
    fetchLoomNumbers(selectedLoomName);
  };

  const viewDesignDetails = (design) => {
    setSelectedDesign(design);
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'image.jpg');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleReplace = async (id, field, file) => {
    const formData = new FormData();
    formData.append('field', field);
    formData.append(field, file);

    try {
      await axios.put(`${BASE_URL}/saree-designs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchRecentDesigns();
      setSelectedDesign(null);
    } catch (error) {
      console.error('Error replacing image:', error);
      setErrorMessage("An error occurred while replacing image. Please try again later.");
    }
  };

  const handleDelete = async (id, field) => {
    try {
      await axios.delete(`${BASE_URL}/saree-designs/${id}/${field}`);
      fetchRecentDesigns();
      setSelectedDesign(null);
    } catch (error) {
      console.error('Error deleting image:', error);
      setErrorMessage("An error occurred while deleting image. Please try again later.");
    }
  };

  const renderImages = (design) => (
    <>
      <div className="design-images">
        {['mainImage', 'munthiImage', 'blouseImage', 'openImage', 'colorSetImage'].map((field, idx) => (
          <div key={idx} className="text-center m-2">
            <img src={design[field]} alt={field} className="img-thumbnail" style={{ width: '150px', height: '150px' }} />
            <div className="mt-2">
              <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(design[field])}>
                <i className="fas fa-download"></i> Download
              </button>
              <input type="file" className="d-block my-2" onChange={(e) => handleReplace(design.id, field, e.target.files[0])} />
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(design.id, field)}>
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="design-buttons text-center">
        <button className="btn btn-secondary" onClick={() => setSelectedDesign(null)}>Back</button>
      </div>
    </>
  );

  return (
    <div className="row w-100 ">
      <div className="col-md-12 mb-4">
        <div className="companyName">
          <h2 className="companyHeading">Shri Selvi Fabric</h2>
          <div className="navigation-buttons">
            <Link to="/home" className="btn btn-secondary navigation-button">Home</Link>
            <Link to="/transaction" className="btn btn-secondary navigation-button">Transaction</Link>
            <Link to="/weaver" className="btn btn-secondary navigation-button">Weaver</Link>
            <Link to="/sareedesign" className="btn btn-primary navigation-button">Saree Design</Link>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <button className="btn btn-primary my-2 w-100" onClick={() => setViewMode(false)}>Add</button>
        <button className="btn btn-primary my-2 w-100" onClick={() => setViewMode(true)}>View</button>
        {viewMode ? (
          <div className="view-saree my-5">
            <h2 className="text-center">View Saree Designs</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="form-group">
              <label>Select Loom Name:</label>
              <select
                className="form-control"
                onChange={handleLoomNameChange}
              >
                <option value="">Select Loom Name</option>
                {loomNames.map(loom => (
                  <option key={loom.id} value={loom.loomName}>{loom.loomName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Loom Number:</label>
              <select
                className="form-control"
                onChange={(e) => fetchFilteredDesigns(e.target.value)}
              >
                <option value="">Select Loom Number</option>
                {loomOptions.map((loom) => (
                  <option key={loom} value={loom}>{loom}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="add-saree my-5">
            <h2 className="text-center">Add Saree Design</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label>Select Loom Name:</label>
                <select
                  className={`form-control ${formik.touched.loomName && formik.errors.loomName ? 'is-invalid' : ''}`}
                  value={formik.values.loomName}
                  onChange={handleLoomNameChange}
                  onBlur={formik.handleBlur}
                  name="loomName"
                >
                  <option value="">Select Loom Name</option>
                  {loomNames.map(loom => (
                    <option key={loom.id} value={loom.loomName}>{loom.loomName}</option>
                  ))}
                </select>
                {formik.touched.loomName && formik.errors.loomName ? <div className="invalid-feedback">{formik.errors.loomName}</div> : null}
              </div>
              <div className="form-group">
                <label>Select Loom Number:</label>
                <select
                  className={`form-control ${formik.touched.loomNumber && formik.errors.loomNumber ? 'is-invalid' : ''}`}
                  value={formik.values.loomNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="loomNumber"
                >
                  <option value="">Select Loom Number</option>
                  {loomOptions.map((loom) => (
                    <option key={loom} value={loom}>{loom}</option>
                  ))}
                </select>
                {formik.touched.loomNumber && formik.errors.loomNumber ? <div className="invalid-feedback">{formik.errors.loomNumber}</div> : null}
              </div>
              <div className="form-group">
                <label>Upload Main Image:</label>
                <input
                  type="file"
                  className={`form-control-file ${formik.touched.mainImage && formik.errors.mainImage ? 'is-invalid' : ''}`}
                  onChange={(event) => formik.setFieldValue('mainImage', event.target.files[0])}
                  onBlur={formik.handleBlur}
                  name="mainImage"
                  ref={mainImageRef}
                />
                {formik.touched.mainImage && formik.errors.mainImage ? <div className="invalid-feedback">{formik.errors.mainImage}</div> : null}
              </div>
              <div className="form-group">
                <label>Upload Munthi Image:</label>
                <input
                  type="file"
                  className={`form-control-file ${formik.touched.munthiImage && formik.errors.munthiImage ? 'is-invalid' : ''}`}
                  onChange={(event) => formik.setFieldValue('munthiImage', event.target.files[0])}
                  onBlur={formik.handleBlur}
                  name="munthiImage"
                  ref={munthiImageRef}
                />
                {formik.touched.munthiImage && formik.errors.munthiImage ? <div className="invalid-feedback">{formik.errors.munthiImage}</div> : null}
              </div>
              <div className="form-group">
                <label>Upload Blouse Image:</label>
                <input
                  type="file"
                  className={`form-control-file ${formik.touched.blouseImage && formik.errors.blouseImage ? 'is-invalid' : ''}`}
                  onChange={(event) => formik.setFieldValue('blouseImage', event.target.files[0])}
                  onBlur={formik.handleBlur}
                  name="blouseImage"
                  ref={blouseImageRef}
                />
                {formik.touched.blouseImage && formik.errors.blouseImage ? <div className="invalid-feedback">{formik.errors.blouseImage}</div> : null}
              </div>
              <div className="form-group">
                <label>Upload Open Image:</label>
                <input
                  type="file"
                  className={`form-control-file ${formik.touched.openImage && formik.errors.openImage ? 'is-invalid' : ''}`}
                  onChange={(event) => formik.setFieldValue('openImage', event.target.files[0])}
                  onBlur={formik.handleBlur}
                  name="openImage"
                  ref={openImageRef}
                />
                {formik.touched.openImage && formik.errors.openImage ? <div className="invalid-feedback">{formik.errors.openImage}</div> : null}
              </div>
              <div className="form-group">
                <label>Upload Color Set Image:</label>
                <input
                  type="file"
                  className={`form-control-file ${formik.touched.colorSetImage && formik.errors.colorSetImage ? 'is-invalid' : ''}`}
                  onChange={(event) => formik.setFieldValue('colorSetImage', event.target.files[0])}
                  onBlur={formik.handleBlur}
                  name="colorSetImage"
                  ref={colorSetImageRef}
                />
                {formik.touched.colorSetImage && formik.errors.colorSetImage ? <div className="invalid-feedback">{formik.errors.colorSetImage}</div> : null}
              </div>
              <button type="submit" className="btn btn-primary w-100">Submit</button>
            </form>
          </div>
        )}
      </div>
      <div className="col-md-9">
        <h2 className="text-center mt-5 design-details-heading">Recent Saree Designs</h2>
        <table className="table table-striped saree-table">
          <thead className="thead-dark">
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>Loom Name</th>
              <th>Loom Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredDesigns.map((design, index) => (
              <tr key={design.id} onClick={() => viewDesignDetails(design)}>
                <td>{index + 1}</td>
                <td><img src={design.mainImage} alt="Main" className="img-thumbnail" style={{ width: '150px', height: '150px' }} /></td>
                <td>{design.loomName}</td>
                <td>{design.loomNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedDesign && (
          <div className="design-details my-5">
            <h2 className="design-details-heading">Design Details</h2>
            {renderImages(selectedDesign)}
          </div>
        )}
      </div>
    </div>
  );
}

export default SareeDesign;
