import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
function Transaction() {
    const [formData, setFormData] = useState({
        date: '',
        type: '',
        amount: '',
        category: '',
        subCategory: '',
        description: '',
        file: null
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [transactionCount, setTransactionCount] = useState(10);

    useEffect(() => {
        fetchRecentTransactions();
    }, []);

    const fetchRecentTransactions = async () => {
        try {
            const response = await axios.get('/api/transactions');
            setRecentTransactions(response.data);
        } catch (error) {
            console.error('Error fetching recent transactions:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData({ ...formData, file: file });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.date || !formData.type || !formData.amount || !formData.category) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        try {
            const formDataForRequest = new FormData();
            formDataForRequest.append('date', formData.date);
            formDataForRequest.append('type', formData.type);
            formDataForRequest.append('amount', formData.amount);
            formDataForRequest.append('category', formData.category);
            formDataForRequest.append('subCategory', formData.subCategory);
            formDataForRequest.append('description', formData.description);
            formDataForRequest.append('file', formData.file);

            const response = await axios.post('/api/transactions', formDataForRequest, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
            setFormData({
                date: '',
                type: '',
                amount: '',
                category: '',
                subCategory: '',
                description: '',
                file: null
            });
            setErrorMessage('');
            fetchRecentTransactions();
        } catch (error) {
            console.error('Error submitting transaction:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
                console.error('Status code:', error.response.status);
                console.error('Headers:', error.response.headers);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Request setup error:', error.message);
            }
            setErrorMessage("An error occurred. Please try again later.");
        }
    };

    const exportToCSV = () => {
        const ws = XLSX.utils.json_to_sheet(recentTransactions.map(transaction => ({
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

    const filteredTransactions = recentTransactions.filter(transaction => {
        if (startDate && transaction.date < startDate) return false;
        if (endDate && transaction.date > endDate) return false;
        if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
        return true;
    });

    const totalIncome = recentTransactions.reduce((total, transaction) => {
        if (transaction.type === 'income') {
            return total + parseFloat(transaction.amount);
        }
        return total;
    }, 0);

    const totalExpense = recentTransactions.reduce((total, transaction) => {
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
                    <div className="navigation-buttons">
                        <div className='companyName'>
                            <h2 className='companyHeading text-center'>Shri Selvi Fabric</h2>
                            <Link to="/home" className="btn btn-secondary navigation-button">Home</Link>
                            <Link to="/transaction" className="btn btn-primary navigation-button">Transaction</Link>
                            <Link to="/weaver" className="btn btn-secondary navigation-button">Weaver</Link>
                            <Link to="/sareedesign" className="btn btn-secondary navigation-button">Saree Design</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 col-sm-12 topSpace">
                    <div className="add-transaction">
                        <div className="transaction-form">
                            <h2 className='transHeading'>Add Transaction</h2>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Date:</label>
                                    <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <select className="form-control" name="type" value={formData.type} onChange={handleChange} required>
                                        <option value="">Select type</option>
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Amount:</label>
                                    <input type="number" className="form-control" name="amount" value={formData.amount} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Category:</label>
                                    <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Sub-Category:</label>
                                    <input type="text" className="form-control" name="subCategory" value={formData.subCategory} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Description:</label>
                                    <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Upload File:</label>
                                    <input type="file" className="form-control-file" name="file" onChange={handleFileChange} />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className='heading'>
                        <h2>Recent Transaction</h2>
                    </div>
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
                        <select value={transactionCount} onChange={(e) => setTransactionCount(parseInt(e.target.value))}>
                            <option value="10">10 Transactions</option>
                            <option value="20">20 Transactions</option>
                            <option value="all">All Transactions</option>
                        </select>
                    </div>

                    <div className="totals">
                        <h4>Total Income: {totalIncome}</h4>
                        <h4>Total Expense: {totalExpense}</h4>
                        <h4>Total Balance: {totalBalance}</h4>
                        <button className="btn btn-primary" onClick={exportToCSV}>Export to CSV</button>
                    </div>

                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Sub-Category</th>
                                <th>Description</th>
                                {/* <th>File</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, transactionCount === 'all' ? recentTransactions.length : transactionCount).map(transaction => (
                                <tr key={transaction.id}>
                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td>{transaction.type}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.subCategory}</td>
                                    <td>{transaction.description}</td>
                                    {/* <td>{transaction.file}</td> */}
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

