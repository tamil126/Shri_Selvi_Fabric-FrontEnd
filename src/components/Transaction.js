import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL } from '../config/constant';
import { Button, Form, Table, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Transaction.css';
import AdminPasswordPrompt from './AdminPasswordPrompt';  // Import the AdminPasswordPrompt component

const AWS_REGION = 'ap-south-1';

function Transaction() {
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [transactionCount, setTransactionCount] = useState(10);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newSubCategory, setNewSubCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [showNewSubCategoryInput, setShowNewSubCategoryInput] = useState(false);
    const [showNewLocationInput, setShowNewLocationInput] = useState(false);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [location, setLocation] = useState('office');
    const [locations, setLocations] = useState(['office', 'factory', 'store']);
    const [newLocation, setNewLocation] = useState('');
    const [adminErrorMessage, setAdminErrorMessage] = useState('');
    const navigate = useNavigate();

    const fetchLocations = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/locations`);
            setLocations(response.data.locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setErrorMessage('Failed to load locations. Please try again later.');
        }
    };

    const fetchRecentTransactions = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/transactions/${location}`);
            const formattedTransactions = response.data.map(transaction => ({
                ...transaction,
                date: new Date(transaction.date).toISOString().split('T')[0]
            }));
            setRecentTransactions(formattedTransactions);
        } catch (error) {
            console.error('Error fetching recent transactions:', error);
            setErrorMessage('Failed to load recent transactions. Please try again later.');
        }
    }, [location]);

    const fetchCategoriesAndSubCategories = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories/${location}`);
            setCategories(response.data.categories);
            setSubCategories(response.data.subCategories);
        } catch (error) {
            console.error('Error fetching categories and subcategories:', error);
            setErrorMessage('Failed to load categories and subcategories. Please try again later.');
        }
    }, [location]);

    useEffect(() => {
        fetchLocations();
        fetchRecentTransactions();
        fetchCategoriesAndSubCategories();
    }, [location, fetchRecentTransactions, fetchCategoriesAndSubCategories]);

    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formik = useFormik({
        initialValues: {
            date: new Date().toISOString().split('T')[0],
            type: '',
            amount: '',
            category: '',
            subCategory: '',
            description: '',
            files: []
        },
        validationSchema: Yup.object({
            date: Yup.string().required('Date is required'),
            type: Yup.string().required('Type is required'),
            amount: Yup.number()
                .required('Amount is required')
                .positive('Amount must be positive')
                .max(1000000, 'Amount cannot exceed 1,000,000'),
            category: Yup.string()
                .required('Category is required')
                .min(3, 'Category must be at least 3 characters')
                .max(50, 'Category cannot exceed 50 characters'),
            subCategory: Yup.string().max(50, 'Sub-Category cannot exceed 50 characters'),
            description: Yup.string().max(200, 'Description cannot exceed 200 characters'),
            files: Yup.array().of(
                Yup.mixed().test('fileSize', 'File too large', value => !value || value.size <= 5242880)
            )
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const formDataForRequest = new FormData();
                formDataForRequest.append('date', values.date);
                formDataForRequest.append('type', values.type);
                formDataForRequest.append('amount', values.amount);
                formDataForRequest.append('category', showNewCategoryInput ? newCategory : values.category);
                formDataForRequest.append('subCategory', showNewSubCategoryInput ? newSubCategory : values.subCategory);
                formDataForRequest.append('description', values.description);
                values.files.forEach(file => {
                    formDataForRequest.append('files', file);
                });
                // eslint-disable-next-line no-unused-vars
                const response = await axios.post(`${BASE_URL}/transactions/${location}`, formDataForRequest, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                resetForm();
                setNewCategory('');
                setNewSubCategory('');
                setShowNewCategoryInput(false);
                setShowNewSubCategoryInput(false);
                fetchRecentTransactions();
                fetchCategoriesAndSubCategories();
            } catch (error) {
                console.error('Error submitting transaction:', error);
                setErrorMessage('Failed to submit transaction. Please try again later.');
            }
        }
    });

    const exportToCSV = () => {
        const ws = XLSX.utils.json_to_sheet(filteredTransactions.map(transaction => ({
            Date: new Date(transaction.date).toLocaleDateString(),
            Type: transaction.type,
            Amount: transaction.amount,
            Category: transaction.category,
            'Sub-Category': transaction.subCategory,
            Description: transaction.description
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
        XLSX.writeFile(wb, 'transactions.csv');
    };

    const handleUpdateClick = (transaction) => {
        setSelectedTransaction(transaction);
        setShowPasswordPrompt(true);
    };

    const handlePasswordConfirm = async (username, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/admin/verifyPassword`, { username, password });
            if (response.data.success) {
                formik.setValues({
                    date: selectedTransaction.date,
                    type: selectedTransaction.type,
                    amount: selectedTransaction.amount,
                    category: selectedTransaction.category,
                    subCategory: selectedTransaction.subCategory,
                    description: selectedTransaction.description,
                    files: []
                });
                setShowNewCategoryInput(false);
                setShowNewSubCategoryInput(false);
                setShowPasswordPrompt(false);
            } else {
                setAdminErrorMessage(response.data.message);
                setTimeout(() => setAdminErrorMessage(''), 5000);
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            setAdminErrorMessage('Failed to verify password. Please try again later.');
            setTimeout(() => setAdminErrorMessage(''), 5000);
        }
    };

    const handleCancelUpdate = () => {
        setSelectedTransaction(null);
        formik.resetForm();
        setShowPasswordPrompt(false);
        setShowNewCategoryInput(false);
        setShowNewSubCategoryInput(false);
    };

    const handleUpdateSubmit = async (event) => {
        event.preventDefault();
        try {
            const formDataForRequest = new FormData();
            formDataForRequest.append('date', formik.values.date);
            formDataForRequest.append('type', formik.values.type);
            formDataForRequest.append('amount', formik.values.amount);
            formDataForRequest.append('category', showNewCategoryInput ? newCategory : formik.values.category);
            formDataForRequest.append('subCategory', showNewSubCategoryInput ? newSubCategory : formik.values.subCategory);
            formDataForRequest.append('description', formik.values.description);
            formik.values.files.forEach(file => {
                formDataForRequest.append('files', file);
            });
            // eslint-disable-next-line no-unused-vars
            const response = await axios.put(`${BASE_URL}/transactions/${location}/${selectedTransaction.id}`, formDataForRequest, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSelectedTransaction(null);
            formik.resetForm();
            setNewCategory('');
            setNewSubCategory('');
            setShowNewCategoryInput(false);
            setShowNewSubCategoryInput(false);
            fetchRecentTransactions();
            fetchCategoriesAndSubCategories();
            navigate('/transaction', { replace: true });
        } catch (error) {
            console.error('Error updating transaction:', error);
            setErrorMessage('Failed to update transaction. Please try again later.');
        }
    };

    const handleLocationChange = async (newLocation) => {
        await checkAndCreateTable(newLocation); // Check and create table if it doesn't exist
        setLocation(newLocation);
        fetchRecentTransactions(); // Fetch transactions without delay
    };

    const checkAndCreateTable = async (tableName) => {
        try {
            await axios.post(`${BASE_URL}/transactions/checkAndCreateTable`, { tableName });
        } catch (error) {
            console.error('Error creating new table:', error);
            setErrorMessage('Failed to create new table. Please try again later.');
        }
    };

    const handleAddLocation = async () => {
        await handleLocationChange(newLocation);
        setLocations([...locations, newLocation]);
        setNewLocation('');
        setShowNewLocationInput(false);
    };

    const filteredTransactions = recentTransactions.filter(transaction => {
        if (startDate && transaction.date < startDate) return false;
        if (endDate && transaction.date > endDate) return false;
        if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
        if (categoryFilter && transaction.category !== categoryFilter) return false;
        if (searchKeyword && !transaction.description.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
        return true;
    });

    const totalIncome = filteredTransactions.reduce((total, transaction) => {
        if (transaction.type === 'income') {
            return total + parseFloat(transaction.amount);
        }
        return total;
    }, 0);

    const totalExpense = filteredTransactions.reduce((total, transaction) => {
        if (transaction.type === 'expense') {
            return total + parseFloat(transaction.amount);
        }
        return total;
    }, 0);

    const totalBalance = totalIncome - totalExpense;

    return (
        <div className="transaction-page">
            {showPasswordPrompt && (
                <AdminPasswordPrompt
                    onConfirm={handlePasswordConfirm}
                    onCancel={handleCancelUpdate}
                    errorMessage={adminErrorMessage}
                    username="nrs"
                />
            )}
            <Row>
                <Col>
                    <div className="companyName">
                        <h2 className="companyHeading">Shri Selvi Fabric</h2>
                        <div className="navigation-buttons">
                            <Link to="/home" className="btn btn-secondary navigation-button">Home</Link>
                            <Link to="/transaction" className="btn btn-primary navigation-button">Transaction</Link>
                            <Link to="/weaver" className="btn btn-secondary navigation-button">Weaver</Link>
                            <Link to="/sareedesign" className="btn btn-secondary navigation-button">Saree Design</Link>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={3} sm={12} className="topSpace">
                    <div className="location-buttons">
                        {locations.map(loc => (
                            <Button key={loc} variant={location === loc ? 'primary' : 'info'} className="mx-2 my-2" onClick={() => handleLocationChange(loc)}>
                                {loc.charAt(0).toUpperCase() + loc.slice(1)}
                            </Button>
                        ))}
                        <Button variant="success" onClick={() => setShowNewLocationInput(true)}>Add Location</Button>
                        {showNewLocationInput && (
                            <div>
                                <Form.Control type="text" className="mt-2" placeholder="Enter new location" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
                                <Button variant="success" className="mt-2 mx-2" onClick={handleAddLocation}>Create Location</Button>
                            </div>
                        )}
                    </div>
                    {selectedTransaction ? (
                        <div className="update-transaction">
                            <h2 className='text-center'>Update Transaction</h2>
                            <Form onSubmit={handleUpdateSubmit}>
                                <Form.Group>
                                    <Form.Label>Date:</Form.Label>
                                    <Form.Control type="date" name="date" value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur} required max={new Date().toISOString().split('T')[0]} />
                                    {formik.touched.date && formik.errors.date && <Alert variant="danger">{formik.errors.date}</Alert>}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Type:</Form.Label>
                                    <Form.Control as="select" name="type" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur} required>
                                        <option value="">Select type</option>
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </Form.Control>
                                    {formik.touched.type && formik.errors.type && <Alert variant="danger">{formik.errors.type}</Alert>}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Amount:</Form.Label>
                                    <Form.Control type="tel" name="amount" value={formik.values.amount} onChange={formik.handleChange} onBlur={formik.handleBlur} required />
                                    {formik.touched.amount && formik.errors.amount && <Alert variant="danger">{formik.errors.amount}</Alert>}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Category:</Form.Label>
                                    <Form.Control as="select" name="category" value={formik.values.category} onChange={(e) => {
                                        formik.handleChange(e);
                                        setShowNewCategoryInput(e.target.value === 'new');
                                    }} onBlur={formik.handleBlur} required>
                                        <option value="">Select category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                        <option value="new">Add new category</option>
                                    </Form.Control>
                                    {showNewCategoryInput && (
                                        <Form.Control type="text" className="mt-2" placeholder="Enter new category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
                                    )}
                                    {formik.touched.category && formik.errors.category && <Alert variant="danger">{formik.errors.category}</Alert>}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Sub-Category:</Form.Label>
                                    <Form.Control as="select" name="subCategory" value={formik.values.subCategory} onChange={(e) => {
                                        formik.handleChange(e);
                                        setShowNewSubCategoryInput(e.target.value === 'new');
                                    }} onBlur={formik.handleBlur} required>
                                        <option value="">Select sub-category</option>
                                        {subCategories.map(subCategory => (
                                            <option key={subCategory} value={subCategory}>{subCategory}</option>
                                        ))}
                                        <option value="new">Add new sub-category</option>
                                    </Form.Control>
                                    {showNewSubCategoryInput && (
                                        <Form.Control type="text" className="mt-2" placeholder="Enter new sub-category" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)} required />
                                    )}
                                    {formik.touched.subCategory && formik.errors.subCategory && <Alert variant="danger">{formik.errors.subCategory}</Alert>}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Description:</Form.Label>
                                    <Form.Control as="textarea" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.description && formik.errors.description && <Alert variant="danger">{formik.errors.description}</Alert>}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Upload Files:</Form.Label>
                                    <Form.Control type="file" name="files" multiple onChange={(event) => formik.setFieldValue('files', Array.from(event.target.files))} />
                                    {formik.touched.files && formik.errors.files && <Alert variant="danger">{formik.errors.files}</Alert>}
                                </Form.Group>
                                <Button type="submit" variant="primary" className='mt-2'>Save</Button>
                                <Button type="button" variant="secondary" className="mt-1" onClick={handleCancelUpdate}>Cancel</Button>
                            </Form>
                        </div>
                    ) : (
                        <div className="add-transaction">
                            <div className="transaction-form">
                                <h2 className='transHeading'>Add Transaction</h2>
                                {formik.errors.general && <Alert variant="danger">{formik.errors.general}</Alert>}
                                <Form onSubmit={formik.handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>Date:</Form.Label>
                                        <Form.Control type="date" name="date" value={formik.values.date} readOnly />
                                        {formik.touched.date && formik.errors.date && <Alert variant="danger">{formik.errors.date}</Alert>}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Type:</Form.Label>
                                        <Form.Control as="select" name="type" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur} required>
                                            <option value="">Select type</option>
                                            <option value="expense">Expense</option>
                                            <option value="income">Income</option>
                                        </Form.Control>
                                        {formik.touched.type && formik.errors.type && <Alert variant="danger">{formik.errors.type}</Alert>}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Amount:</Form.Label>
                                        <Form.Control type="tel" name="amount" value={formik.values.amount} onChange={formik.handleChange} onBlur={formik.handleBlur} required />
                                        {formik.touched.amount && formik.errors.amount && <Alert variant="danger">{formik.errors.amount}</Alert>}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Category:</Form.Label>
                                        <Form.Control as="select" name="category" value={formik.values.category} onChange={(e) => {
                                            formik.handleChange(e);
                                            setShowNewCategoryInput(e.target.value === 'new');
                                        }} onBlur={formik.handleBlur} required>
                                            <option value="">Select category</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                            <option value="new">Add new category</option>
                                        </Form.Control>
                                        {showNewCategoryInput && (
                                            <Form.Control type="text" className="mt-2" placeholder="Enter new category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
                                        )}
                                        {formik.touched.category && formik.errors.category && <Alert variant="danger">{formik.errors.category}</Alert>}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Sub-Category:</Form.Label>
                                        <Form.Control as="select" name="subCategory" value={formik.values.subCategory} onChange={(e) => {
                                            formik.handleChange(e);
                                            setShowNewSubCategoryInput(e.target.value === 'new');
                                        }} onBlur={formik.handleBlur} required>
                                            <option value="">Select sub-category</option>
                                            {subCategories.map(subCategory => (
                                                <option key={subCategory} value={subCategory}>{subCategory}</option>
                                            ))}
                                            <option value="new">Add new sub-category</option>
                                        </Form.Control>
                                        {showNewSubCategoryInput && (
                                            <Form.Control type="text" className="mt-2" placeholder="Enter new sub-category" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)} required />
                                        )}
                                        {formik.touched.subCategory && formik.errors.subCategory && <Alert variant="danger">{formik.errors.subCategory}</Alert>}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Description:</Form.Label>
                                        <Form.Control as="textarea" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        {formik.touched.description && formik.errors.description && <Alert variant="danger">{formik.errors.description}</Alert>}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Upload Files:</Form.Label>
                                        <Form.Control type="file" name="files" multiple onChange={(event) => formik.setFieldValue('files', Array.from(event.target.files))} />
                                        {formik.touched.files && formik.errors.files && <Alert variant="danger">{formik.errors.files}</Alert>}
                                    </Form.Group>
                                    <Button type="submit" variant="primary" className='mt-2'>Submit</Button>
                                </Form>
                            </div>
                        </div>
                    )}
                </Col>
                <Col md={9} sm={12}>
                    <div className='heading'>
                        <h2>{location.charAt(0).toUpperCase() + location.slice(1)} Transactions</h2>
                    </div>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <div className="filters">
                        <Form.Group as={Row}>
                            <Form.Label column>Start Date:</Form.Label>
                            <Col>
                                <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column>End Date:</Form.Label>
                            <Col>
                                <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column>Type:</Form.Label>
                            <Col>
                                <Form.Control as="select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column>Category:</Form.Label>
                            <Col>
                                <Form.Control as="select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column>Search:</Form.Label>
                            <Col>
                                <Form.Control type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="Search description" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column>Show Last:</Form.Label>
                            <Col>
                                <Form.Control as="select" value={transactionCount} onChange={(e) => setTransactionCount(e.target.value)}>
                                    <option value="10">10 Transactions</option>
                                    <option value="20">20 Transactions</option>
                                    <option value="all">All Transactions</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                    </div>
                    <div className="totals">
                        {typeFilter === 'all' && <h4>Total Income: ₹{totalIncome}</h4>}
                        {typeFilter === 'all' && <h4>Total Expense: ₹{totalExpense}</h4>}
                        {typeFilter === 'all' && <h4>Total Balance: ₹{totalBalance}</h4>}
                        {typeFilter === 'income' && <h4>Total Income: ₹{totalIncome}</h4>}
                        {typeFilter === 'expense' && <h4>Total Expense: ₹{totalExpense}</h4>}
                        <Button onClick={exportToCSV}>Export to CSV</Button>
                    </div>
                    <Table striped bordered hover className="transaction-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Sub-Category</th>
                                <th>Description</th>
                                <th>Files</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, transactionCount === 'all' ? filteredTransactions.length : transactionCount).map(transaction => (
                                <tr key={transaction.id}>
                                    <td>{formatDateForDisplay(transaction.date)}</td>
                                    <td>{transaction.type}</td>
                                    <td>₹ {transaction.amount}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.subCategory}</td>
                                    <td>{transaction.description}</td>
                                    <td>
                                        {transaction.file && (
                                            <a href={`https://newrainsarees.s3.${AWS_REGION}.amazonaws.com/transactions/${transaction.file}`} className="btn btn-outline-success" download>Download</a>
                                        )}
                                    </td>
                                    <td><Button variant="primary" onClick={() => handleUpdateClick(transaction)}>Update</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}

export default Transaction;
