import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Transaction from './components/Transaction';
import Weaver from './components/Weaver';
import SareeDesign from './components/SareeDesign';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/weaver" element={<Weaver />} />
        <Route path="/sareedesign" element={<SareeDesign />} />
      </Routes>
    </Router>
  );
}

export default App;