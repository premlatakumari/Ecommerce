import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import './index.css';
function App() {
    return (
        <div className="App">
            
            <Routes>
                {/* Public Routes  */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                 {/* Protected Routes */}
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/user/dashboard" 
                    element={
                        <ProtectedRoute requiredRole="User">
                            <UserDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/user/profile" 
                    element={
                        <ProtectedRoute requiredRole="User">
                            <ProfilePage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/user/settings" 
                    element={
                        <ProtectedRoute requiredRole="User">
                            <SettingsPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/profile" 
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <ProfilePage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/settings" 
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <SettingsPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <DashboardRedirect />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
            
            {/* Toast notifications */}
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    className: '',
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        theme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        theme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    );
}

function DashboardRedirect() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user?.role === 'Admin') {
            navigate('/admin/dashboard', { replace: true });
        } else {
            navigate('/user/dashboard', { replace: true });
        }
    }, [user, navigate]);
    
    return <div>Redirecting...</div>;
}


export default App;