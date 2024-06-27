import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL } from '../config/constant';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Transaction.css';

function Transaction() {
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [transactionCount, setTransactionCount] = useState(10);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newSubCategory, setNewSubCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [showNewSubCategoryInput, setShowNewSubCategoryInput] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecentTransactions();
        fetchCategoriesAndSubCategories();
    }, []);

    const fetchRecentTransactions = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/transactions`);
            const formattedTransactions = response.data.map(transaction => ({
                ...transaction,
                date: new Date(transaction.date).toISOString().split('T')[0]
            }));
            setRecentTransactions(formattedTransactions);
        } catch (error) {
            console.error('Error fetching recent transactions:', error);
            setErrorMessage('Failed to load recent transactions. Please try again later.');
        }
    };

    const fetchCategoriesAndSubCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories`);
            setCategories(response.data.categories);
            setSubCategories(response.data.subCategories);
        } catch (error) {
            console.error('Error fetching categories and subcategories:', error);
            setErrorMessage('Failed to load categories and subcategories. Please try again later.');
        }
    };

    const formatDateForDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formik = useFormik({
        initialValues: {
            date: '',
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
                const formattedDate = new Date(values.date).toISOString().split('T')[0];
                const formDataForRequest = new FormData();
                formDataForRequest.append('date', formattedDate);
                formDataForRequest.append('type', values.type);
                formDataForRequest.append('amount', values.amount);
                formDataForRequest.append('category', showNewCategoryInput ? newCategory : values.category);
                formDataForRequest.append('subCategory', showNewSubCategoryInput ? newSubCategory : values.subCategory);
                formDataForRequest.append('description', values.description);
                values.files.forEach(file => {
                    formDataForRequest.append('files', file);
                });
                // eslint-disable-next-line no-unused-vars
                const response = await axios.post(`${BASE_URL}/transactions`, formDataForRequest, {
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
        formik.setValues({
            date: transaction.date,
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            subCategory: transaction.subCategory,
            description: transaction.description,
            files: transaction.files || []
        });
        setShowNewCategoryInput(false);
        setShowNewSubCategoryInput(false);
    };

    const handleCancelUpdate = () => {
        setSelectedTransaction(null);
        formik.resetForm();
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
            const response = await axios.put(`${BASE_URL}/transactions/${selectedTransaction.id}`, formDataForRequest, {
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

    const filteredTransactions = recentTransactions.filter(transaction => {
        if (startDate && transaction.date < startDate) return false;
        if (endDate && transaction.date > endDate) return false;
        if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
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
            <div className="row">
                <div className="col-md-12">
                    <div className="companyName">
                        <h2 className="companyHeading">Shri Selvi Fabric</h2>
                        <div className="navigation-buttons">
                            <Link to="/home" className="btn btn-secondary navigation-button">Home</Link>
                            <Link to="/transaction" className="btn btn-primary navigation-button">Transaction</Link>
                            <Link to="/weaver" className="btn btn-secondary navigation-button">Weaver</Link>
                            <Link to="/sareedesign" className="btn btn-secondary navigation-button">Saree Design</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-12 topSpace">
                    {selectedTransaction ? (
                        <div className="update-transaction">
                            <h2 className='text-center'>Update Transaction</h2>
                            <form onSubmit={handleUpdateSubmit} >
                                <div className="form-group">
                                    <label>Date:</label>
                                    <input type="date" className="form-control" name="date" value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur} required autoComplete='new'/>
                                    {formik.touched.date && formik.errors.date ? <div className="error-message">{formik.errors.date}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <select className="form-control" name="type" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur} required >
                                        <option value="">Select type</option>
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                    {formik.touched.type && formik.errors.type ? <div className="error-message">{formik.errors.type}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Amount:</label>
                                    <input type="tel" className="form-control" name="amount" value={formik.values.amount} onChange={formik.handleChange} onBlur={formik.handleBlur} required autoComplete='new' />
                                    {formik.touched.amount && formik.errors.amount ? <div className="error-message">{formik.errors.amount}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Category:</label>
                                    <select className="form-control" name="category" value={formik.values.category} onChange={(e) => {
                                        formik.handleChange(e);
                                        setShowNewCategoryInput(e.target.value === 'new');
                                    }} onBlur={formik.handleBlur} required>
                                        <option value="">Select category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                        <option value="new">Add new category</option>
                                    </select>
                                    {showNewCategoryInput && (
                                        <input type="text" className="form-control mt-2" placeholder="Enter new category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
                                    )}
                                    {formik.touched.category && formik.errors.category ? <div className="error-message">{formik.errors.category}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Sub-Category:</label>
                                    <select className="form-control" name="subCategory" value={formik.values.subCategory} onChange={(e) => {
                                        formik.handleChange(e);
                                        setShowNewSubCategoryInput(e.target.value === 'new');
                                    }} onBlur={formik.handleBlur} required>
                                        <option value="">Select sub-category</option>
                                        {subCategories.map(subCategory => (
                                            <option key={subCategory} value={subCategory}>{subCategory}</option>
                                        ))}
                                        <option value="new">Add new sub-category</option>
                                    </select>
                                    {showNewSubCategoryInput && (
                                        <input type="text" className="form-control mt-2" placeholder="Enter new sub-category" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)} required />
                                    )}
                                    {formik.touched.subCategory && formik.errors.subCategory ? <div className="error-message">{formik.errors.subCategory}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Description:</label>
                                    <textarea className="form-control" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                    {formik.touched.description && formik.errors.description ? <div className="error-message">{formik.errors.description}</div> : null}
                                </div>
                                <div className="form-group">
                                    <label>Upload Files:</label>
                                    <input type="file" className="form-control-file" name="files" multiple onChange={(event) => formik.setFieldValue('files', Array.from(event.target.files))} />
                                    {formik.touched.files && formik.errors.files ? <div className="error-message">{formik.errors.files}</div> : null}
                                </div>
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" className="btn btn-secondary btn-size mt-1" onClick={handleCancelUpdate}>Cancel</button>
                            </form>
                        </div>
                    ) : (
                        <div className="add-transaction">
                            <div className="transaction-form">
                                <h2 className='transHeading'>Add Transaction</h2>
                                {formik.errors.general && <div className="error-message">{formik.errors.general}</div>}
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="form-group">
                                        <label>Date:</label>
                                        <input type="date" className="form-control" name="date" value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur} required />
                                        {formik.touched.date && formik.errors.date ? <div className="error-message">{formik.errors.date}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Type:</label>
                                        <select className="form-control" name="type" value={formik.values.type} onChange={formik.handleChange} onBlur={formik.handleBlur} required>
                                            <option value="">Select type</option>
                                            <option value="expense">Expense</option>
                                            <option value="income">Income</option>
                                        </select>
                                        {formik.touched.type && formik.errors.type ? <div className="error-message">{formik.errors.type}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Amount:</label>
                                        <input type="tel" className="form-control" name="amount" value={formik.values.amount} onChange={formik.handleChange} onBlur={formik.handleBlur} required />
                                        {formik.touched.amount && formik.errors.amount ? <div className="error-message">{formik.errors.amount}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Category:</label>
                                        <select className="form-control" name="category" value={formik.values.category} onChange={(e) => {
                                            formik.handleChange(e);
                                            setShowNewCategoryInput(e.target.value === 'new');
                                        }} onBlur={formik.handleBlur} required>
                                            <option value="">Select category</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                            <option value="new">Add new category</option>
                                        </select>
                                        {showNewCategoryInput && (
                                            <input type="text" className="form-control mt-2" placeholder="Enter new category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
                                        )}
                                        {formik.touched.category && formik.errors.category ? <div className="error-message">{formik.errors.category}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Sub-Category:</label>
                                        <select className="form-control" name="subCategory" value={formik.values.subCategory} onChange={(e) => {
                                            formik.handleChange(e);
                                            setShowNewSubCategoryInput(e.target.value === 'new');
                                        }} onBlur={formik.handleBlur} required>
                                            <option value="">Select sub-category</option>
                                            {subCategories.map(subCategory => (
                                                <option key={subCategory} value={subCategory}>{subCategory}</option>
                                            ))}
                                            <option value="new">Add new sub-category</option>
                                        </select>
                                        {showNewSubCategoryInput && (
                                            <input type="text" className="form-control mt-2" placeholder="Enter new sub-category" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)} required />
                                        )}
                                        {formik.touched.subCategory && formik.errors.subCategory ? <div className="error-message">{formik.errors.subCategory}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Description:</label>
                                        <textarea className="form-control" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        {formik.touched.description && formik.errors.description ? <div className="error-message">{formik.errors.description}</div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Upload Files:</label>
                                        <input type="file" className="form-control-file" name="files" multiple onChange={(event) => formik.setFieldValue('files', Array.from(event.target.files))} />
                                        {formik.touched.files && formik.errors.files ? <div className="error-message">{formik.errors.files}</div> : null}
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-md-9 col-sm-12">
                    <div className='heading'>
                        <h2>Recent Transactions</h2>
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="filters">
                        <label>Start Date:</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <label>End Date:</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        <label>Type:</label>
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                            <option value="all">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <label>Show Last:</label>
                        <select value={transactionCount} onChange={(e) => setTransactionCount(e.target.value)}>
                            <option value="10">10 Transactions</option>
                            <option value="20">20 Transactions</option>
                            <option value="all">All Transactions</option>
                        </select>
                    </div>
                    <div className="totals">
                        {typeFilter === 'all' && <h4>Total Income: ₹{totalIncome}</h4>}
                        {typeFilter === 'all' && <h4>Total Expense: ₹{totalExpense}</h4>}
                        {typeFilter === 'all' && <h4>Total Balance: ₹{totalBalance}</h4>}
                        {typeFilter === 'income' && <h4>Total Income: ₹{totalIncome}</h4>}
                        {typeFilter === 'expense' && <h4>Total Expense: ₹{totalExpense}</h4>}
                        <button className="btn btn-primary" onClick={exportToCSV}>Export to CSV</button>
                    </div>
                    <table className="transaction-table table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Sub-Category</th>
                                <th>Description</th>
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
                                    <td><button className="btn btn-primary" onClick={() => handleUpdateClick(transaction)}>Update</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Transaction;
