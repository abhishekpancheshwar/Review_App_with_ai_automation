import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage1';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminRoute from './components/Routing/AdminRoute';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/admin" element={
                            <AdminRoute>
                                <AdminPage />
                            </AdminRoute>
                        } />
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    );
}

export default App;