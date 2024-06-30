import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Transaction from './components/Transaction';
import Weaver from './components/Weaver';
import SareeDesign from './components/SareeDesign';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './authContext';
import RequireAuth from './RequireAuth';

function App() {
    return (
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              } />
              <Route path="/transaction" element={
                <RequireAuth>
                  <Transaction />
                </RequireAuth>
              } />
              <Route path="/weaver" element={
                <RequireAuth>
                  <Weaver />
                </RequireAuth>
              } />
              <Route path="/sareedesign" element={
                <RequireAuth>
                  <SareeDesign />
                </RequireAuth>
              } />
            </Routes>
          </Router>
        </AuthProvider>
    );
}

export default App;
